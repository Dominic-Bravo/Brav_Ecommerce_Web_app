import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AppProviders from "@/components/providers/QueryClientProvider";
import CartProvider from "@/components/providers/CartProvider";

export const metadata: Metadata = {
  title: "BRAV",
  description: "BRAV E-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <AppProviders>{children}</AppProviders>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}