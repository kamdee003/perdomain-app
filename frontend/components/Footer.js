import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white py-10 mt-auto font-sans">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">

        {/* حقوق النشر */}
        <p className="text-sm opacity-80 animate-fade-up text-center md:text-left">
          © {new Date().getFullYear()} Perdomain. All rights reserved.
        </p>

        {/* الروابط */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 animate-fade-up">
          <a
            href="/privacy"
            className="hover:text-orange-400 transition-all duration-300 transform hover:scale-110"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="hover:text-orange-400 transition-all duration-300 transform hover:scale-110"
          >
            Terms
          </a>
          <a
            href="/contact"
            className="hover:text-orange-400 transition-all duration-300 transform hover:scale-110"
          >
            Contact
          </a>
        </div>

        {/* أيقونات التواصل */}
        <div className="flex space-x-4 animate-fade-up">
          <a href="#" className="hover:text-orange-400 transition-all duration-300 transform hover:scale-125">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="hover:text-orange-400 transition-all duration-300 transform hover:scale-125">
            <FaFacebookF size={20} />
          </a>
          <a href="#" className="hover:text-orange-400 transition-all duration-300 transform hover:scale-125">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="hover:text-orange-400 transition-all duration-300 transform hover:scale-125">
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
