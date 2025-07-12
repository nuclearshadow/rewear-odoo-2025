import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          ReWear
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/browse"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Browse Items
          </Link>
          <Link
            href="/#how-it-works"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            About Us
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-block text-gray-600 font-medium hover:text-blue-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
