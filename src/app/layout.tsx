// src/app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import TopNavbar from "@/components/layout/TopNavbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <AuthProvider>
          <TopNavbar />

          {/* We set a reasonable default padding for all standard pages. */}
          <main className="pt-20">{children}</main>
        </AuthProvider>
      </body>
    </html> // <-- The missing closing tag
  );
}
