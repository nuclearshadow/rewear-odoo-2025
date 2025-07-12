// src/app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import TopNavbar from "@/components/layout/TopNavbar"; // Import the new navbar

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
          <TopNavbar /> {/* The new top-floating navbar */}
          {/* Main content must have top padding to not be hidden underneath the fixed navbar */}
          <main className="pt-24">{children}</main>
        </AuthProvider>
      </body>
    </html> // <-- The missing closing tag
  );
}
