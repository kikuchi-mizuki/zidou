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
import { inventory as initialInventory, products } from "@/lib/mock-data";
import { Inventory } from "@/lib/types";
import { Plus, X } from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>(initialInventory);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInventory, setNewInventory] = useState({
    productCode: "",
    lotNumber: "",
    expiryDate: "",
    cases: "",
  });

  // localStorageから読み込み・保存
  useEffect(() => {
    const saved = localStorage.getItem("inventory");
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  // 期限までの日数を計算
  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return Math.floor(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const addInventory = () => {
    if (
      newInventory.productCode &&
      newInventory.lotNumber &&
      newInventory.expiryDate &&
      newInventory.cases
    ) {
      const inv: Inventory = {
        id: String(inventory.length + 1),
        productCode: newInventory.productCode,
        lotNumber: newInventory.lotNumber,
        expiryDate: newInventory.expiryDate,
        cases: parseInt(newInventory.cases),
        createdAt: new Date().toISOString(),
      };
      setInventory([...inventory, inv]);
      setNewInventory({
        productCode: "",
        lotNumber: "",
        expiryDate: "",
        cases: "",
      });
      setShowAddForm(false);
    } else {
      alert("すべての項目を入力してください");
    }
  };

  const updateCases = (id: string, newCases: number) => {
    if (newCases < 0) return;
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, cases: newCases } : item
      )
    );
  };

  const deleteInventory = (id: string) => {
    if (confirm("この在庫を削除してもよろしいですか？")) {
      setInventory(inventory.filter((item) => item.id !== id));
    }
  };

  // 商品別の在庫集計
  const getStockByProduct = () => {
    const stockMap = new Map<string, number>();
    inventory.forEach((item) => {
      const current = stockMap.get(item.productCode) || 0;
      stockMap.set(item.productCode, current + item.cases);
    });
    return stockMap;
  };

  const stockByProduct = getStockByProduct();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">在庫管理</h1>
            <p className="text-gray-600">現在の在庫状況</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? (
              <>
                <X className="mr-2 h-4 w-4" />
                キャンセル
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                在庫追加
              </>
            )}
          </Button>
        </div>

        {showAddForm && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>新規在庫登録</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    商品 <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={newInventory.productCode}
                    onChange={(e) =>
                      setNewInventory({
                        ...newInventory,
                        productCode: e.target.value,
                      })
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
                    ロット番号 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={newInventory.lotNumber}
                    onChange={(e) =>
                      setNewInventory({
                        ...newInventory,
                        lotNumber: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="例: LOT5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    賞味期限 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={newInventory.expiryDate}
                    onChange={(e) =>
                      setNewInventory({
                        ...newInventory,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ケース数 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={newInventory.cases}
                    onChange={(e) =>
                      setNewInventory({
                        ...newInventory,
                        cases: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="例: 10"
                    min="1"
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
                <Button onClick={addInventory}>登録</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => {
            const stock = stockByProduct.get(product.code) || 0;
            return (
              <Card key={product.code}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        {product.code}
                      </div>
                      <div className="font-medium">{product.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{stock}</div>
                      <div className="text-sm text-gray-600">ケース</div>
                    </div>
                  </div>
                  {stock < 10 && (
                    <Badge variant="warning" className="mt-2">
                      在庫少
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>在庫一覧（{inventory.length}ロット）</CardTitle>
          </CardHeader>
          <CardContent>
            {inventory.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                在庫データがありません
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品</TableHead>
                    <TableHead>ロット番号</TableHead>
                    <TableHead>賞味期限</TableHead>
                    <TableHead>ケース数</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const product = products.find(
                      (p) => p.code === item.productCode
                    );
                    const daysUntilExpiry = getDaysUntilExpiry(
                      item.expiryDate
                    );

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {product?.name || item.productCode}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.productCode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.lotNumber}
                        </TableCell>
                        <TableCell>{item.expiryDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={item.cases}
                              onChange={(e) =>
                                updateCases(
                                  item.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                              min="0"
                            />
                            <span className="text-sm text-gray-600">
                              ケース
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {daysUntilExpiry <= 30 ? (
                            <Badge variant="destructive">
                              残り{daysUntilExpiry}日
                            </Badge>
                          ) : daysUntilExpiry <= 60 ? (
                            <Badge variant="warning">
                              残り{daysUntilExpiry}日
                            </Badge>
                          ) : (
                            <Badge variant="success">正常</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteInventory(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            削除
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-medium text-blue-900">
              次のステップ
            </h3>
            <p className="text-sm text-blue-700">
              1. 在庫が確認できたら「発注管理」で発注状況を確認してください
              <br />
              2. 発注と在庫が揃ったら「自動計算」で納品計画を作成できます
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
