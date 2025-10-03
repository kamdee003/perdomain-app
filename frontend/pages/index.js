import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import SearchBox from "../components/SearchBox";
import AnalysisResults from "../components/AnalysisResults";
import DomainAvailabilityPanel from "../components/DomainAvailabilityPanel";

// --- Feature Flags ---
const FEATURES = {
  NEW_APPRAISAL: true,
  SALES_TABLE: true,
  DOMAIN_AVAILABILITY: false,
  OLD_ANALYSIS_RESULTS: false,
};

export default function Home() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appraisalData, setAppraisalData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [latestSalesData, setLatestSalesData] = useState(null); // ← جديد
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // ✅ جلب "Latest Sales" عند تحميل الصفحة (مستقل عن query)
  useEffect(() => {
    if (!FEATURES.SALES_TABLE) return;
    const fetchLatestSales = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/sales?page=1&size=10`);
        if (res.ok) {
          const payload = await res.json();
          setLatestSalesData(payload);
        }
      } catch (err) {
        console.error("Failed to load latest sales:", err);
      }
    };
    fetchLatestSales();
  }, [FEATURES.SALES_TABLE]);

  // جلب المبيعات عند تغيير الصفحة/الحجم (بعد البحث)
  useEffect(() => {
    if (!query || !FEATURES.SALES_TABLE || (page === 1 && size === 10)) return;
    const fetchSales = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/sales?page=1&size=10`);
        if (res.ok) {
          const payload = await res.json();
          setLatestSalesData(payload);
        }
      } catch (err) {
        console.error("Sales API error:", err);
      }
    };
    fetchSales();
  }, [page, size, query, FEATURES.SALES_TABLE]);

  const handleSizeChange = (newSize) => {
    console.log("Changing page size from", size, "to", newSize);
    setSize(newSize);
    setPage(1);
  };

  const [availabilityData, setAvailabilityData] = useState(null);

  const t = {
    title: "AI-Powered Domain Appraisal",
    subtitle: "Instantly value any domain using real-time market data, historical sales, and artificial intelligence.",
    search: "Search",
    stats: {
      title: "Trusted by Thousands of Users",
      domains: "Domains Processed",
      queries: "Daily Queries",
      years: "Years of Experience"
    }
  };

  const isValidDomain = (str) => {
    const trimmed = str.trim();
    return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/i.test(trimmed);
  };

  const handleResults = async (q) => {
    setError("");
    if (!isValidDomain(q)) {
      setError("Please enter a valid domain (e.g., example.com)");
      return;
    }
    
    setQuery(q);
    setLoading(true);
    
    // إعادة تعيين جميع الحالات (لكن لا نمسح latestSalesData)
    setResults([]);
    setAvailabilityData(null);
    setAppraisalData(null);
    // setSalesData(null); ← تم تعطيله
    // setLatestSalesData(null); ← تم تعطيله
    setPage(1);
    setSize(10);

    if (FEATURES.DOMAIN_AVAILABILITY) {
      try {
        const res = await fetch('/api/domain/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: q })
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.availability)) {
          setAvailabilityData(data.availability);
        }
      } catch (err) {
        console.error("Domain availability error:", err);
      }
    }

    if (FEATURES.NEW_APPRAISAL) {
      try {
        const appraisalRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/appraise`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: q, use_ai: true })
        });
    
        // ← أضف هذا الجزء الجديد لمعالجة الخطأ 429
        if (appraisalRes.status === 429) {
          const errorData = await appraisalRes.json();
          setError(errorData.detail.message || "You have used all your daily requests. Please come back tomorrow.");
          setLoading(false);
          return; // توقف عن التنفيذ لأن المستخدم تجاوز الحد
         }
    
         if (!appraisalRes.ok) {
           throw new Error('فشل في تحميل التقييم');
         }
    
         const appraisal = await appraisalRes.json();
         setAppraisalData(appraisal);
    
       } catch (err) {
         console.error("Appraisal API error:", err);
         setError(err.message || "فشل في تحميل تقييم النطاق.");
       }
     }

    if (FEATURES.OLD_ANALYSIS_RESULTS) {
      setTimeout(() => {
        const formattedResults = [
          {
            tools: [
              { name: "Domain Sales", description: "Search historical domain sales over $500M" },
              { name: "Lead Generator", description: "Find potential buyers for your domains" },
              { name: "CPC & Search Volume", description: "Check CPC and search volume for keywords" },
              { name: "Backlink Checker", description: "Check backlinks of your domains" },
              { name: "Alternative Spellings", description: "Find typos and alternative spellings" },
              { name: "Domain Generator", description: "Get AI-powered domain name suggestions" },
              { name: "Trademark Checks", description: "Verify trademark conflicts for a domain" },
              { name: "New Domain Registrations", description: "Check popular keywords by new registrations" },
              { name: "Domain History", description: "Check historical archives via Wayback Machine" },
              { name: "One-word Domains", description: "Explore all available one-word domains" },
              { name: "Two-word Domains", description: "Explore all available two-word domains" },
              { 
                name: "Suggested Sale Price", 
                description: "Estimated sale price for this domain", 
                suggestedPrice: "$1,500" 
              },
              { 
                name: "Domain Providers", 
                description: "Choose the best provider for purchasing this domain",
                providersPrices: {
                  "GoDaddy": "$1,200",
                  "Namecheap": "$1,250",
                  "Unstoppable": "$1,300",
                  "Spaceship": "$1,220",
                  "Gname": "$1,240",
                  "Namebright": "$1,260"
                }
              }
            ]
          }
        ];
        setResults(formattedResults);
      }, 800);
    }

    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
    setQuery("");
    setError("");
    setAvailabilityData(null);
    setAppraisalData(null);
    // لا نمسح latestSalesData هنا أيضًا
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-white">
      <Head>
        <title>Perdomain — AI-Powered Domain Appraisal & Valuation Tool</title>
        <meta name="description" content="Instantly appraise any domain name using AI, real sales data, and market trends. Get accurate valuations for .com, .ai, .io domains in seconds." />
        <meta name="keywords" content="domain appraisal, domain valuation, domain price, domain checker, domain value, buy domain, sell domain, domain sales" />
        <meta property="og:title" content="Perdomain — AI Domain Valuation Tool" />
        <meta property="og:description" content="Get instant, AI-powered domain valuations based on real market data." />
        <meta property="og:url" content="https://perdomain.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://perdomain.com" />
      </Head>
      <Header />
      <main className="flex-grow">
        <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.title}</h1>
          <p className="text-lg md:text-xl mb-4 text-gray-200 max-w-2xl">{t.subtitle}</p>
          {error && <p className="text-red-400 mb-2">{error}</p>}
          <SearchBox 
            t={t} 
            onResults={handleResults} 
            loading={loading} 
          />
        </section>

        {FEATURES.DOMAIN_AVAILABILITY && (
          <DomainAvailabilityPanel 
            domain={query} 
            availabilityData={availabilityData} 
            loading={loading} 
          />
        )}

        {(FEATURES.NEW_APPRAISAL || FEATURES.SALES_TABLE) && query && (
           <div className="max-w-6xl mx-auto px-4 mt-6">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-semibold text-orange-400">
                 Appraisal for: <span className="font-mono">{query}</span>
               </h2>
               <button 
                 onClick={clearResults}
                 className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
               >
                 Clear Results
               </button>
             </div>
             <AnalysisResults 
               appraisal={appraisalData} 
               sales={latestSalesData} 
               query={query}
               page={page}
               setPage={setPage}
               size={size}
               setSize={handleSizeChange}
             /> 
           </div>
         )}

        {FEATURES.OLD_ANALYSIS_RESULTS && results.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-orange-400">
                Analysis for: <span className="font-mono">{query}</span>
              </h2>
              <button 
                onClick={clearResults}
                className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
              >
                Clear Results
              </button>
            </div>
            <AnalysisResults results={results} query={query} />
          </div>
        )}

        <Features />
        <Stats t={t} />
      </main>
      <Footer />
    </div>
  );
}