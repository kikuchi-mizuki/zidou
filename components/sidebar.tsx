"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Settings,
  Calculator,
  Truck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/",
    label: "ダッシュボード",
    icon: LayoutDashboard,
  },
  {
    href: "/products",
    label: "商品管理",
    icon: Package,
  },
  {
    href: "/inventory",
    label: "在庫管理",
    icon: Warehouse,
  },
  {
    href: "/orders",
    label: "発注管理",
    icon: ShoppingCart,
  },
  {
    href: "/rules",
    label: "ルール管理",
    icon: Settings,
  },
  {
    href: "/calculate",
    label: "自動計算",
    icon: Calculator,
  },
  {
    href: "/delivery-plan",
    label: "納品計画",
    icon: Truck,
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-gray-50">
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
        <h1 className="text-base font-bold text-gray-900 sm:text-lg">納品計画システム</h1>
        {/* モバイルの閉じるボタン */}
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-200 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
