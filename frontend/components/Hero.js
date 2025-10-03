import { useState } from "react";
import SearchBox from "./SearchBox";

export default function Hero({ t }) {
  const [results, setResults] = useState([]);

  return (
    <section className="flex flex-col items-center justify-center flex-grow text-center py-20 
                        bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white" id="home">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        {t.title}
      </h1>
      <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-2xl">
        {t.subtitle}
      </p>

      <SearchBox t={t} onResults={setResults} />

      {/* نتائج البحث العامة */}
      {results.length > 0 && (
        <div className="mt-10 w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-[#fb923c]">Search Results</h3>
          <ul>
            {results.map((item, idx) => (
              <li key={idx} className="flex justify-between py-2 border-b border-white/20">
                <span>{item.domain}</span>
                <span
                  className={`font-semibold ${
                    item.status === "Available" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
