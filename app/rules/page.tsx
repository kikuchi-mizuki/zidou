"use client";

import { useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { rules as initialRules } from "@/lib/mock-data";
import { Rule } from "@/lib/types";

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", description: "" });

  const toggleRule = (id: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const addRule = () => {
    if (newRule.name && newRule.description) {
      const rule: Rule = {
        id: String(rules.length + 1),
        name: newRule.name,
        description: newRule.description,
        enabled: true,
      };
      setRules([...rules, rule]);
      setNewRule({ name: "", description: "" });
      setShowAddForm(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ルール管理</h1>
            <p className="text-gray-600">納品計画の自動計算ルール</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "キャンセル" : "ルール追加"}
          </Button>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>新しいルールを追加</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  ルール名
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) =>
                    setNewRule({ ...newRule, name: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="例: 納品時30日以上"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  説明
                </label>
                <textarea
                  value={newRule.description}
                  onChange={(e) =>
                    setNewRule({ ...newRule, description: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="ルールの詳細を入力してください"
                  rows={3}
                />
              </div>
              <Button onClick={addRule}>追加</Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>登録済みルール</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-start justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{rule.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {rule.enabled ? "有効" : "無効"}
                    </span>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
