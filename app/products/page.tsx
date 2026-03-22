"use client";

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
import { products } from "@/lib/mock-data";

export default function ProductsPage() {
  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">商品管理</h1>
          <p className="text-sm text-gray-600 sm:text-base">登録されている商品一覧</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>商品一覧</CardTitle>
          </CardHeader>
          <CardContent>
            {/* モバイル: カード形式 */}
            <div className="space-y-3 md:hidden">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-gray-200 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.code}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">ブランド:</span>
                      <div className="font-medium">{product.brand}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">ケース入数:</span>
                      <div className="font-medium">{product.unitsPerCase}個</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* タブレット以上: テーブル形式 */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品コード</TableHead>
                    <TableHead>商品名</TableHead>
                    <TableHead>ブランド</TableHead>
                    <TableHead>ケース入数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.code}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.unitsPerCase}個/ケース</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
