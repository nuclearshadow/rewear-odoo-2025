// src/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // 1. Import it

export const metadata = {
  title: "ReWear",
  description: "Community Clothing Exchange",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {" "}
          {/* 2. Wrap your children with it */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
