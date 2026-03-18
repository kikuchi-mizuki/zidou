import {
  Product,
  Inventory,
  Order,
  Rule,
  DeliveryPlan,
  CalculationLog,
} from "./types";

// 商品データ - 海外輸入高級チョコレート（専門店向けプレミアムブランド）
export const products: Product[] = [
  {
    id: "1",
    code: "CHO-001",
    name: "アメデイ トスカーノブラック70%",
    brand: "Amedei（イタリア・トスカーナ）",
    unitsPerCase: 12,
  },
  {
    id: "2",
    code: "CHO-002",
    name: "ドモーリ サンプラータ80%",
    brand: "Domori（イタリア・ピエモンテ）",
    unitsPerCase: 10,
  },
  {
    id: "3",
    code: "CHO-003",
    name: "ミシェル・クルイゼル ブラン ド ブラン",
    brand: "Michel Cluizel（フランス）",
    unitsPerCase: 8,
  },
  {
    id: "4",
    code: "CHO-004",
    name: "ボナ リオカリベ75%",
    brand: "Bonnat（フランス・ヴォワロン）",
    unitsPerCase: 6,
  },
  {
    id: "5",
    code: "CHO-005",
    name: "コペヌール シングルオリジン マダガスカル",
    brand: "Coppeneur（ドイツ）",
    unitsPerCase: 15,
  },
  {
    id: "6",
    code: "CHO-006",
    name: "フリス・ホルム チュノ75%",
    brand: "Friis-Holm（デンマーク）",
    unitsPerCase: 8,
  },
];

// 在庫データ
export const inventory: Inventory[] = [
  {
    id: "1",
    productCode: "CHO-001",
    lotNumber: "ITA202601A",
    expiryDate: "2026-04-30",
    cases: 5,
  },
  {
    id: "2",
    productCode: "CHO-001",
    lotNumber: "ITA202602A",
    expiryDate: "2026-06-30",
    cases: 8,
  },
  {
    id: "3",
    productCode: "CHO-002",
    lotNumber: "ITA202601D",
    expiryDate: "2026-05-15",
    cases: 12,
  },
  {
    id: "4",
    productCode: "CHO-003",
    lotNumber: "FRA202601M",
    expiryDate: "2026-04-20",
    cases: 6,
  },
  {
    id: "5",
    productCode: "CHO-004",
    lotNumber: "FRA202603B",
    expiryDate: "2026-05-31",
    cases: 8,
  },
  {
    id: "6",
    productCode: "CHO-005",
    lotNumber: "DEU202602C",
    expiryDate: "2026-07-15",
    cases: 20,
  },
  {
    id: "7",
    productCode: "CHO-006",
    lotNumber: "DNK202602F",
    expiryDate: "2026-04-25",
    cases: 4,
  },
];

// 発注データ
export const orders: Order[] = [
  {
    id: "1",
    department: "高島屋",
    productCode: "CHO-001",
    quantity: 100,
    desiredDeliveryDate: "2026-04-08",
    status: "pending",
    createdAt: "2026-03-15T10:30:00",
  },
  {
    id: "2",
    department: "伊勢丹",
    productCode: "CHO-002",
    quantity: 80,
    desiredDeliveryDate: "2026-04-10",
    status: "pending",
    createdAt: "2026-03-15T14:20:00",
  },
  {
    id: "3",
    department: "三越",
    productCode: "CHO-006",
    quantity: 60,
    desiredDeliveryDate: "2026-04-12",
    status: "pending",
    createdAt: "2026-03-16T09:15:00",
  },
  {
    id: "4",
    department: "大丸",
    productCode: "CHO-005",
    quantity: 150,
    desiredDeliveryDate: "2026-04-15",
    status: "pending",
    createdAt: "2026-03-16T11:00:00",
  },
];

// ルールデータ
export const rules: Rule[] = [
  {
    id: "1",
    name: "賞味期限優先",
    description: "賞味期限が近い在庫を優先的に使用する",
    enabled: true,
  },
  {
    id: "2",
    name: "納品時30日以上",
    description: "納品時に賞味期限が30日以上残っている必要がある",
    enabled: true,
  },
  {
    id: "3",
    name: "高島屋納品曜日",
    description: "高島屋は火曜日と金曜日のみ納品可能",
    enabled: true,
  },
  {
    id: "4",
    name: "1回最大20ケース",
    description: "1回の納品で最大20ケースまで",
    enabled: true,
  },
];

// 納品計画データ（自動計算後の結果）
export const deliveryPlans: DeliveryPlan[] = [
  {
    id: "1",
    deliveryDate: "2026-04-04",
    department: "高島屋",
    productCode: "CHO-001",
    productName: "アメデイ トスカーノブラック70%",
    cases: 5,
    lotNumber: "ITA202601A",
    expiryDate: "2026-04-30",
    warning: "賞味期限まで26日",
    orderId: "1",
    status: "draft",
  },
  {
    id: "2",
    deliveryDate: "2026-04-08",
    department: "高島屋",
    productCode: "CHO-001",
    productName: "アメデイ トスカーノブラック70%",
    cases: 4,
    lotNumber: "ITA202602A",
    expiryDate: "2026-06-30",
    orderId: "1",
    status: "draft",
  },
];

// 計算ログデータ
export const calculationLogs: CalculationLog[] = [
  {
    id: "1",
    timestamp: "2026-03-16 14:30:01",
    step: "初期化",
    message: "処理開始: 4件の発注を処理します",
    type: "info",
  },
  {
    id: "2",
    timestamp: "2026-03-16 14:30:02",
    step: "在庫確認",
    message: "アメデイ トスカーノブラック70%: 2ロット、合計13ケース",
    type: "info",
  },
  {
    id: "3",
    timestamp: "2026-03-16 14:30:03",
    step: "納品日計算",
    message: "高島屋の納品可能日: 2026-04-04, 2026-04-08",
    type: "info",
  },
  {
    id: "4",
    timestamp: "2026-03-16 14:30:04",
    step: "期限チェック",
    message: "ロットITA202601A（イタリア2026年1月輸入）: 納品時残り26日",
    type: "warning",
  },
  {
    id: "5",
    timestamp: "2026-03-16 14:30:05",
    step: "計画作成",
    message: "2026-04-04: アメデイ トスカーノブラック70% 5ケース（ロットITA202601A）",
    type: "success",
  },
  {
    id: "6",
    timestamp: "2026-03-16 14:30:06",
    step: "計画作成",
    message: "2026-04-08: アメデイ トスカーノブラック70% 4ケース（ロットITA202602A）",
    type: "success",
  },
  {
    id: "7",
    timestamp: "2026-03-16 14:30:07",
    step: "完了",
    message: "納品計画を2件作成しました",
    type: "success",
  },
];
