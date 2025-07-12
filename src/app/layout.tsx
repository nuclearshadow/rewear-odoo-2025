// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import FloatingNavbar from "@/components/layout/FloatingNavbar"; // <-- Import the new navbar
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <FloatingNavbar />{" "}
          {/* The new floating sidebar. It needs no wrappers. */}
          <div>
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
