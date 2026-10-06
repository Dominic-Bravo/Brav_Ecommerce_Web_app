"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Products",
    href: "/dashboard/products",
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
  },
  {
    name: "API Testing",
    href: "/dashboard/api-test",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r border-brav-border bg-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-brav-border px-6 py-6">
          <span className="text-2xl font-bold tracking-tight">
            BRAV
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  block rounded-brav-md px-4 py-3 text-sm font-medium
                  transition
                  ${
                    active
                      ? "bg-brav-primary text-white"
                      : "text-brav-foreground hover:bg-brav-secondary"
                  }
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-brav-border p-4">
          <button className="w-full rounded-brav-md px-4 py-3 text-left text-sm text-brav-muted hover:bg-brav-secondary hover:text-brav-foreground">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}