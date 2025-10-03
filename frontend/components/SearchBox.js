// components/SearchBox.js
import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

export default function SearchBox({ t, onResults, loading = false }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onResults(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center flex-grow px-3 bg-white">
        <HiOutlineSearch className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="example.com"
          className="flex-grow py-3 text-black focus:outline-none"
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={loading}
        className={`mt-3 px-6 py-3 font-semibold text-white transition ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-[#f97316] to-[#fb923c] hover:opacity-90"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </span>
        ) : (
          t.search || "Search"
        )}
      </button>
    </div>
  );
}