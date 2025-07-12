export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-gray-800">ReWear</h3>
            <p className="text-gray-500 mt-2">Sustainable Fashion Community.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Contact
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Terms
            </a>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ReWear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
