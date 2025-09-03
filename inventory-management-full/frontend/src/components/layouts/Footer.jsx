import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-600 text-sm">
          © {currentYear} Akshay Enterprises. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
