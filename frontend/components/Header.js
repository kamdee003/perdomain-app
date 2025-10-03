import { useState } from "react";
import { useRouter } from "next/router";
import { HiMenu, HiX, HiOutlineSearch } from "react-icons/hi";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="fixed w-full z-50 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => router.push("/")}>
          <img 
            src="/logo.png" 
            alt="Perdomain Logo" 
            className="h-14 w-auto" 
          />
        </div>

        {/* روابط الديسكتوب */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-[#fb923c] transition">Home</a>
          <a href="#tools" className="hover:text-[#fb923c] transition">Tools</a>
          <a href="/privacy" className="hover:text-[#fb923c] transition">Privacy</a>
          <a href="/terms" className="hover:text-[#fb923c] transition">Terms</a>
          <a href="/contact" className="hover:text-[#fb923c] transition">Contact</a>
        </nav>

        {/* زر القائمة في الموبايل */}
        <div className="md:hidden flex items-center space-x-2">
          <HiOutlineSearch className="w-6 h-6 text-white" />
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {menuOpen && (
        <nav className="md:hidden bg-[#0f172a] px-6 pb-4 animate-fade-down">
          <a href="/" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-[#fb923c] transition">
            Home
          </a>
          <a href="#tools" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-[#fb923c] transition">
            Tools
          </a>
          <a href="/privacy" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-[#fb923c] transition">
            Privacy
          </a>
          <a href="/terms" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-[#fb923c] transition">
            Terms
          </a>
          <a href="/contact" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-[#fb923c] transition">
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}
