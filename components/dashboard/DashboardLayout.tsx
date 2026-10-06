import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-brav-secondary">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          userName="John Doe"
          role="Customer"
        />

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}