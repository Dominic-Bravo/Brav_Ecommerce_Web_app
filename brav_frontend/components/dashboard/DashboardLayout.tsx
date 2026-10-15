import type { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <Header user={user} />

        <main className="flex-1 p-6 lg:p-8 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}