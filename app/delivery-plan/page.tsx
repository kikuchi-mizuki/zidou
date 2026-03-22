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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deliveryPlans as initialPlans } from "@/lib/mock-data";
import { DeliveryPlan } from "@/lib/types";
import { Download, CheckCircle } from "lucide-react";

export default function DeliveryPlanPage() {
  const [plans, setPlans] = useState<DeliveryPlan[]>(initialPlans);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    // localStorageから計画データを読み込む
    const savedPlans = localStorage.getItem("deliveryPlans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, []);

  const handleExport = () => {
    alert(
      "Excel出力機能（デモ）\n\n実際の実装では、納品計画をExcelファイルとしてダウンロードします。\n\n含まれる情報:\n- 納品日\n- デパート名\n- 商品詳細\n- ケース数\n- ロット番号\n- 賞味期限"
    );
  };

  const handleApprove = () => {
    if (confirm("この納品計画を承認してもよろしいですか？\n承認後、納品実行が可能になります。")) {
      const approvedPlans = plans.map(plan => ({
        ...plan,
        status: "approved" as const
      }));
      setPlans(approvedPlans);
      localStorage.setItem("deliveryPlans", JSON.stringify(approvedPlans));
      setApproved(true);
    }
  };

  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.deliveryDate]) {
      acc[plan.deliveryDate] = [];
    }
    acc[plan.deliveryDate].push(plan);
    return acc;
  }, {} as Record<string, DeliveryPlan[]>);

  const allApproved = plans.length > 0 && plans.every(p => p.status === "approved");

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">納品計画</h1>
            <p className="text-sm text-gray-600 sm:text-base">自動計算された納品計画</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {!allApproved && plans.length > 0 && (
              <Button onClick={handleApprove} variant="default" className="w-full sm:w-auto">
                <CheckCircle className="mr-2 h-4 w-4" />
                計画を承認
              </Button>
            )}
            <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Excel出力
            </Button>
          </div>
        </div>

        {approved && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-900">
                    納品計画が承認されました
                  </h3>
                  <p className="text-sm text-green-700">
                    この計画に基づいて納品を実行できます。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {plans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">
                納品計画がありません。
                <br />
                「自動計算」から計画を作成してください。
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>納品計画サマリー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">総納品回数</div>
                    <div className="text-2xl font-bold">{plans.length}回</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">納品先</div>
                    <div className="text-2xl font-bold">
                      {new Set(plans.map(p => p.department)).size}社
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">総ケース数</div>
                    <div className="text-2xl font-bold">
                      {plans.reduce((sum, p) => sum + p.cases, 0)}ケース
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {Object.keys(groupedPlans).sort().map(date => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle>
                    {new Date(date).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* モバイル: カード形式 */}
                  <div className="space-y-4 md:hidden">
                    {groupedPlans[date].map(plan => (
                      <div
                        key={plan.id}
                        className="rounded-lg border border-gray-200 p-5 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-semibold text-gray-900 mb-1">
                              {plan.department}
                            </div>
                            <div className="text-sm text-gray-600">
                              {plan.productName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {plan.productCode}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {plan.warning ? (
                              <Badge variant="warning" className="text-xs px-2 py-1">
                                {plan.warning}
                              </Badge>
                            ) : (
                              <Badge variant="success" className="text-xs px-2 py-1">正常</Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">ケース数</span>
                            <span className="font-medium text-gray-900">{plan.cases}ケース</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">使用ロット</span>
                            <span className="font-medium text-gray-900">{plan.lotNumber}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">賞味期限</span>
                            <span className="font-medium text-gray-900">{plan.expiryDate}</span>
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
                          <TableHead>デパート</TableHead>
                          <TableHead>商品</TableHead>
                          <TableHead>ケース数</TableHead>
                          <TableHead>使用ロット</TableHead>
                          <TableHead>賞味期限</TableHead>
                          <TableHead>状態</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupedPlans[date].map(plan => (
                          <TableRow key={plan.id}>
                            <TableCell className="font-medium">
                              {plan.department}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{plan.productName}</div>
                                <div className="text-sm text-gray-600">
                                  {plan.productCode}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{plan.cases}ケース</TableCell>
                            <TableCell>{plan.lotNumber}</TableCell>
                            <TableCell>{plan.expiryDate}</TableCell>
                            <TableCell>
                              {plan.warning ? (
                                <Badge variant="warning">{plan.warning}</Badge>
                              ) : (
                                <Badge variant="success">正常</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-medium text-blue-900">計画のポイント</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• 賞味期限が近い在庫（LOT1）を優先的に使用</li>
              <li>• デパート別の納品可能曜日に合わせて計画</li>
              <li>• 1回の納品は最大20ケース以内</li>
              <li>• 納品時に賞味期限30日以上を確保</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
