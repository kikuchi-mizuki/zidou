"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { orders as initialOrders, inventory as initialInventory, products, rules } from "@/lib/mock-data";
import { CalculationLog } from "@/lib/types";
import { calculateDeliveryPlan } from "@/lib/calculation";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CalculatePage() {
  const router = useRouter();
  const [isCalculating, setIsCalculating] = useState(false);
  const [logs, setLogs] = useState<CalculationLog[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);

  // localStorageから最新のデータを読み込む
  const [currentOrders, setCurrentOrders] = useState(initialOrders);
  const [currentInventory, setCurrentInventory] = useState(initialInventory);

  useEffect(() => {
    // localStorageから読み込む（他の画面で追加されたデータを反映）
    const savedOrders = localStorage.getItem("orders");
    const savedInventory = localStorage.getItem("inventory");

    if (savedOrders) setCurrentOrders(JSON.parse(savedOrders));
    if (savedInventory) setCurrentInventory(JSON.parse(savedInventory));
  }, []);

  const runCalculation = () => {
    setIsCalculating(true);
    setLogs([]);
    setIsComplete(false);
    setHasError(false);

    // 少し遅延させてUX向上
    setTimeout(() => {
      const result = calculateDeliveryPlan(
        currentOrders,
        currentInventory,
        products,
        rules
      );

      // ログを1つずつ表示
      result.logs.forEach((log, index) => {
        setTimeout(() => {
          setLogs((prev) => [...prev, log]);

          if (log.type === "error") {
            setHasError(true);
          }

          if (index === result.logs.length - 1) {
            setIsCalculating(false);
            if (result.success) {
              setIsComplete(true);
              // 計画データをlocalStorageに保存
              localStorage.setItem("deliveryPlans", JSON.stringify(result.plans));
              // 発注ステータスを更新
              const updatedOrders = currentOrders.map(order => {
                const hasPlann = result.plans.some(p => p.orderId === order.id);
                if (hasPlann && order.status === "pending") {
                  return { ...order, status: "processing" as const };
                }
                return order;
              });
              localStorage.setItem("orders", JSON.stringify(updatedOrders));
            }
          }
        }, (index + 1) * 500);
      });
    }, 500);
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getLogBadgeVariant = (type: string) => {
    switch (type) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  const pendingOrders = currentOrders.filter(o => o.status === "pending");

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">自動計算</h1>
          <p className="text-sm text-gray-600 sm:text-base">納品計画を自動的に作成します</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>計算実行</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 font-medium">処理対象</h3>
              <div className="space-y-1 text-sm">
                <p>• 処理待ち発注: {pendingOrders.length}件</p>
                <p>• 在庫ロット数: {currentInventory.length}件</p>
                <p>• 有効なルール: {rules.filter(r => r.enabled).length}件</p>
              </div>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  処理待ちの発注がありません。「発注管理」から発注を追加してください。
                </p>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={runCalculation}
                disabled={isCalculating}
                className="w-full"
              >
                {isCalculating ? "計算中..." : "自動計算を実行"}
              </Button>
            )}
          </CardContent>
        </Card>

        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">計算ログ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 sm:p-4"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getLogIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                        <Badge variant={getLogBadgeVariant(log.type)} className="text-xs w-fit">
                          {log.step}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isComplete && !hasError && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-900">
                    計算が完了しました
                  </h3>
                  <p className="text-sm text-green-700">
                    納品計画が作成されました。結果を確認してください。
                  </p>
                </div>
                <Button onClick={() => router.push("/delivery-plan")} className="w-full sm:w-auto">
                  納品計画を確認
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-900">
                    エラーが発生しました
                  </h3>
                  <p className="text-sm text-red-700">
                    在庫不足や商品未登録などの問題が発生しました。ログを確認して対応してください。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-medium text-blue-900">計算ルール</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              {rules.filter(r => r.enabled).map(rule => (
                <li key={rule.id}>• {rule.name}: {rule.description}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
