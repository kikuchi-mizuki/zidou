import { Order, Inventory, Product, Rule, DeliveryPlan, CalculationLog } from "./types";

// デパート別の納品可能曜日（0=日曜, 1=月曜, ..., 6=土曜）
const DELIVERY_RULES: Record<string, number[]> = {
  "高島屋": [2, 5], // 火曜・金曜
  "伊勢丹": [1, 4], // 月曜・木曜
  "三越": [3, 6],   // 水曜・土曜
  "大丸": [1, 3, 5], // 月水金
  "松坂屋": [2, 4],  // 火曜・木曜
};

const MAX_CASES_PER_DELIVERY = 20;
const MIN_EXPIRY_DAYS = 30;

/**
 * 自動計算のメインロジック
 */
export function calculateDeliveryPlan(
  orders: Order[],
  inventory: Inventory[],
  products: Product[],
  rules: Rule[]
): {
  plans: DeliveryPlan[];
  logs: CalculationLog[];
  success: boolean;
} {
  const logs: CalculationLog[] = [];
  const plans: DeliveryPlan[] = [];
  let logId = 1;

  // 有効なルールのみ抽出
  const activeRules = rules.filter((r) => r.enabled);

  logs.push({
    id: String(logId++),
    timestamp: new Date().toLocaleString("ja-JP"),
    step: "初期化",
    message: `処理開始: ${orders.filter(o => o.status === "pending").length}件の発注を処理します`,
    type: "info",
  });

  // pending の発注のみ処理
  const pendingOrders = orders.filter((o) => o.status === "pending");

  for (const order of pendingOrders) {
    const product = products.find((p) => p.code === order.productCode);
    if (!product) {
      logs.push({
        id: String(logId++),
        timestamp: new Date().toLocaleString("ja-JP"),
        step: "エラー",
        message: `商品 ${order.productCode} が見つかりません`,
        type: "error",
      });
      continue;
    }

    // ステップ1: 在庫確認
    const productInventory = inventory
      .filter((inv) => inv.productCode === order.productCode)
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

    logs.push({
      id: String(logId++),
      timestamp: new Date().toLocaleString("ja-JP"),
      step: "在庫確認",
      message: `${product.name}: ${productInventory.length}ロット、合計${productInventory.reduce((sum, inv) => sum + inv.cases, 0)}ケース`,
      type: "info",
    });

    // 必要ケース数を計算
    const requiredCases = Math.ceil(order.quantity / product.unitsPerCase);
    const totalCases = productInventory.reduce((sum, inv) => sum + inv.cases, 0);

    if (totalCases < requiredCases) {
      logs.push({
        id: String(logId++),
        timestamp: new Date().toLocaleString("ja-JP"),
        step: "在庫不足",
        message: `${product.name}: 必要${requiredCases}ケース、在庫${totalCases}ケース（不足${requiredCases - totalCases}ケース）`,
        type: "error",
      });
      continue;
    }

    // ステップ2: 納品日計算
    const deliveryDates = calculateDeliveryDates(
      order.desiredDeliveryDate,
      order.department,
      requiredCases
    );

    logs.push({
      id: String(logId++),
      timestamp: new Date().toLocaleString("ja-JP"),
      step: "納品日計算",
      message: `${order.department}の納品可能日: ${deliveryDates.join(", ")}`,
      type: "info",
    });

    // ステップ3: ロット割り当て
    let remainingCases = requiredCases;
    let deliveryIndex = 0;
    let inventoryIndex = 0;

    while (remainingCases > 0 && inventoryIndex < productInventory.length) {
      const inv = productInventory[inventoryIndex];
      const deliveryDate = deliveryDates[deliveryIndex] || deliveryDates[deliveryDates.length - 1];

      // 賞味期限チェック
      const daysUntilExpiry = Math.floor(
        (new Date(inv.expiryDate).getTime() - new Date(deliveryDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry < MIN_EXPIRY_DAYS) {
        logs.push({
          id: String(logId++),
          timestamp: new Date().toLocaleString("ja-JP"),
          step: "期限チェック",
          message: `ロット${inv.lotNumber}: 納品時残り${daysUntilExpiry}日（30日未満のためスキップ）`,
          type: "warning",
        });
        inventoryIndex++;
        continue;
      }

      // 1回あたりの最大ケース数を考慮
      const casesToAllocate = Math.min(
        remainingCases,
        inv.cases,
        MAX_CASES_PER_DELIVERY
      );

      const plan: DeliveryPlan = {
        id: String(plans.length + 1),
        deliveryDate,
        department: order.department,
        productCode: order.productCode,
        productName: product.name,
        cases: casesToAllocate,
        lotNumber: inv.lotNumber,
        expiryDate: inv.expiryDate,
        orderId: order.id,
        status: "draft",
      };

      // 警告メッセージの追加
      if (daysUntilExpiry <= 45) {
        plan.warning = `賞味期限まで${daysUntilExpiry}日`;
      }

      plans.push(plan);

      logs.push({
        id: String(logId++),
        timestamp: new Date().toLocaleString("ja-JP"),
        step: "計画作成",
        message: `${deliveryDate}: ${product.name} ${casesToAllocate}ケース（ロット${inv.lotNumber}）`,
        type: "success",
      });

      remainingCases -= casesToAllocate;
      inv.cases -= casesToAllocate;

      if (inv.cases === 0) {
        inventoryIndex++;
      }

      // 次の納品日へ
      if (remainingCases > 0 && casesToAllocate === MAX_CASES_PER_DELIVERY) {
        deliveryIndex++;
      }
    }

    if (remainingCases > 0) {
      logs.push({
        id: String(logId++),
        timestamp: new Date().toLocaleString("ja-JP"),
        step: "警告",
        message: `${product.name}: ${remainingCases}ケース未割り当て（賞味期限の制約により）`,
        type: "warning",
      });
    }
  }

  logs.push({
    id: String(logId++),
    timestamp: new Date().toLocaleString("ja-JP"),
    step: "完了",
    message: `納品計画を${plans.length}件作成しました`,
    type: "success",
  });

  return {
    plans,
    logs,
    success: plans.length > 0,
  };
}

/**
 * 納品可能日を計算
 */
function calculateDeliveryDates(
  desiredDate: string,
  department: string,
  requiredCases: number
): string[] {
  const dates: string[] = [];
  const allowedDays = DELIVERY_RULES[department] || [1, 2, 3, 4, 5]; // デフォルトは平日

  const startDate = new Date(desiredDate);
  const maxDeliveries = Math.ceil(requiredCases / MAX_CASES_PER_DELIVERY);

  let currentDate = new Date(startDate);
  let foundDates = 0;

  // 最大30日先まで探索
  for (let i = 0; i < 30 && foundDates < maxDeliveries; i++) {
    const dayOfWeek = currentDate.getDay();

    if (allowedDays.includes(dayOfWeek)) {
      dates.push(currentDate.toISOString().split("T")[0]);
      foundDates++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
