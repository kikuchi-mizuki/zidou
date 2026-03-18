"use client";

import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { orders, inventory, products } from "@/lib/mock-data";
import { AlertCircle, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  // 期限が近い在庫を計算（60日以内）
  const expiringInventory = inventory.filter((item) => {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 60;
  });

  // 在庫が少ない商品（10ケース未満）
  const lowStockProducts = products.filter((product) => {
    const totalStock = inventory
      .filter((item) => item.productCode === product.code)
      .reduce((sum, item) => sum + item.cases, 0);
    return totalStock < 10;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600">納品計画システムの概要</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">発注件数</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-gray-600">処理待ち</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">在庫アラート</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockProducts.length}</div>
              <p className="text-xs text-gray-600">在庫が少ない商品</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                期限が近い在庫
              </CardTitle>
              <Package className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiringInventory.length}</div>
              <p className="text-xs text-gray-600">60日以内に期限切れ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">商品数</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-gray-600">登録済み商品</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>期限が近い在庫</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expiringInventory.map((item) => {
                  const product = products.find(
                    (p) => p.code === item.productCode
                  );
                  const expiryDate = new Date(item.expiryDate);
                  const today = new Date();
                  const daysUntilExpiry = Math.floor(
                    (expiryDate.getTime() - today.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">
                          {product?.name} ({item.lotNumber})
                        </p>
                        <p className="text-sm text-gray-600">
                          期限: {item.expiryDate}
                        </p>
                      </div>
                      <Badge
                        variant={daysUntilExpiry <= 30 ? "destructive" : "warning"}
                      >
                        残り{daysUntilExpiry}日
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>処理待ち発注</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.map((order) => {
                  const product = products.find(
                    (p) => p.code === order.productCode
                  );
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{order.department}</p>
                        <p className="text-sm text-gray-600">
                          {product?.name} - {order.quantity}個
                        </p>
                      </div>
                      <Badge variant="outline">
                        {order.desiredDeliveryDate}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => router.push("/calculate")}
            className="w-full max-w-md"
          >
            自動計算を実行
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
