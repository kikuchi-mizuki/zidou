// 商品
export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  unitsPerCase: number;
}

// 在庫
export interface Inventory {
  id: string;
  productCode: string;
  lotNumber: string;
  expiryDate: string;
  cases: number;
  createdAt?: string;
}

// 発注
export interface Order {
  id: string;
  department: string;
  productCode: string;
  quantity: number;
  desiredDeliveryDate: string;
  status: "pending" | "processing" | "completed";
  createdAt?: string;
  completedAt?: string;
}

// ルール
export interface Rule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

// 納品計画
export interface DeliveryPlan {
  id: string;
  deliveryDate: string;
  department: string;
  productCode: string;
  productName: string;
  cases: number;
  lotNumber: string;
  expiryDate: string;
  warning?: string;
  orderId?: string;
  status?: "draft" | "approved" | "delivered";
}

// 計算ログ
export interface CalculationLog {
  id: string;
  timestamp: string;
  step: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
}
