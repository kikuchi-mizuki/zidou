"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orders as initialOrders, products } from "@/lib/mock-data";
import { Order } from "@/lib/types";
import { Plus, X } from "lucide-react";

const departments = ["高島屋", "伊勢丹", "三越", "大丸", "松坂屋"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    department: "",
    productCode: "",
    quantity: "",
    desiredDeliveryDate: "",
  });

  // localStorageから読み込み・保存
  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">処理待ち</Badge>;
      case "processing":
        return <Badge variant="default">処理中</Badge>;
      case "completed":
        return <Badge variant="success">完了</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const addOrder = () => {
    if (
      newOrder.department &&
      newOrder.productCode &&
      newOrder.quantity &&
      newOrder.desiredDeliveryDate
    ) {
      const order: Order = {
        id: String(orders.length + 1),
        department: newOrder.department,
        productCode: newOrder.productCode,
        quantity: parseInt(newOrder.quantity),
        desiredDeliveryDate: newOrder.desiredDeliveryDate,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setOrders([...orders, order]);
      setNewOrder({
        department: "",
        productCode: "",
        quantity: "",
        desiredDeliveryDate: "",
      });
      setShowAddForm(false);
    } else {
      alert("すべての項目を入力してください");
    }
  };

  const deleteOrder = (id: string) => {
    if (confirm("この発注を削除してもよろしいですか？")) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">発注管理</h1>
            <p className="text-sm text-gray-600 sm:text-base">デパートからの発注一覧</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full sm:w-auto">
            {showAddForm ? (
              <>
                <X className="mr-2 h-4 w-4" />
                キャンセル
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                新規発注
              </>
            )}
          </Button>
        </div>

        {showAddForm && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>新規発注登録</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    デパート名 <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={newOrder.department}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, department: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    商品 <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={newOrder.productCode}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, productCode: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {products.map((product) => (
                      <option key={product.code} value={product.code}>
                        {product.code} - {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    数量（個数） <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="例: 100"
                    min="1"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    希望納品日 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={newOrder.desiredDeliveryDate}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        desiredDeliveryDate: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  キャンセル
                </Button>
                <Button onClick={addOrder}>登録</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>発注一覧（{orders.length}件）</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                発注データがありません
              </div>
            ) : (
              <>
                {/* モバイル: カード形式 */}
                <div className="space-y-4 md:hidden">
                  {orders.map((order) => {
                    const product = products.find(
                      (p) => p.code === order.productCode
                    );
                    const requiredCases = product
                      ? Math.ceil(order.quantity / product.unitsPerCase)
                      : 0;

                    return (
                      <div
                        key={order.id}
                        className="rounded-lg border border-gray-200 p-5 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-semibold text-gray-900 mb-1">
                              {order.department}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString("ja-JP")
                                : "-"}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">商品</div>
                          <div className="font-medium text-gray-900">
                            {product?.name || order.productCode}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.productCode}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">数量</span>
                            <span className="font-medium text-gray-900">
                              {order.quantity}個 ({requiredCases}ケース)
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">希望納品日</span>
                            <span className="font-medium text-gray-900">
                              {order.desiredDeliveryDate}
                            </span>
                          </div>
                        </div>

                        {order.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteOrder(order.id)}
                            className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            削除
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* タブレット以上: テーブル形式 */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>発注日</TableHead>
                        <TableHead>デパート</TableHead>
                        <TableHead>商品</TableHead>
                        <TableHead>数量</TableHead>
                        <TableHead>希望納品日</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const product = products.find(
                          (p) => p.code === order.productCode
                        );
                        const requiredCases = product
                          ? Math.ceil(order.quantity / product.unitsPerCase)
                          : 0;

                        return (
                          <TableRow key={order.id}>
                            <TableCell className="text-sm text-gray-600">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString(
                                    "ja-JP"
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell className="font-medium">
                              {order.department}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {product?.name || order.productCode}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {order.productCode}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>{order.quantity}個</div>
                                <div className="text-sm text-gray-600">
                                  ({requiredCases}ケース)
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{order.desiredDeliveryDate}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              {order.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteOrder(order.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  削除
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-medium text-blue-900">
              次のステップ
            </h3>
            <p className="text-sm text-blue-700">
              1. 発注を登録したら「在庫管理」で在庫を確認してください
              <br />
              2. 在庫が足りない場合は在庫を追加してください
              <br />
              3. 「自動計算」で納品計画を作成できます
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
