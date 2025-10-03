// frontend/components/AnalysisResults.js
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  HiOutlineChartBar, 
  HiOutlineKey, 
  HiOutlineGlobeAlt, 
  HiOutlineDocumentText, 
  HiOutlinePuzzle, 
  HiOutlineShieldCheck, 
  HiOutlineClock, 
  HiOutlineSearch, 
  HiX,
  HiClipboardCopy
} from "react-icons/hi";

// --- Feature Flags ---
const FEATURES = {
  NEW_APPRAISAL: true,
  SALES_TABLE: true,
  DOMAIN_SALES: false,
  LEAD_GENERATOR: false,
  CPC_SEARCH_VOLUME: false,
  BACKLINK_CHECKER: false,
  ALTERNATIVE_SPELLINGS: false,
  DOMAIN_GENERATOR: false,
  TRADEMARK_CHECKS: false,
  NEW_REGISTRATIONS: false,
  DOMAIN_HISTORY: false,
  ONE_WORD_DOMAINS: false,
  TWO_WORD_DOMAINS: false,
  SUGGESTED_SALE_PRICE: false,
  DOMAIN_PROVIDERS: false,
};

const iconMap = {
  "Domain Sales": HiOutlineChartBar,
  "Lead Generator": HiOutlineKey,
  "CPC & Search Volume": HiOutlineChartBar,
  "Backlink Checker": HiOutlineGlobeAlt,
  "Alternative Spellings": HiOutlineDocumentText,
  "Domain Generator": HiOutlinePuzzle,
  "Trademark Checks": HiOutlineShieldCheck,
  "New Domain Registrations": HiOutlineClock,
  "Domain History": HiOutlineClock,
  "One-word Domains": HiOutlineSearch,
  "Two-word Domains": HiOutlineSearch,
  "Suggested Sale Price": HiOutlineChartBar,
};

// --- Appraisal Card (محدث بدون أيقونات وتصميم محسن) ---
const AppraisalCard = ({ appraisal }) => {
  if (!appraisal) return null;

  return (
    <div className="appraisal-report bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] p-6 rounded-xl shadow-lg mb-6">
      {/* التقييم الأساسي */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Estimated Value</h3>
          <p className="text-gray-300">Based on real sales & active market listings</p>
        </div>
        <div className="mt-2 md:mt-0 text-right">
          <span className="text-3xl font-bold text-orange-400">
            ${appraisal.estimated_price.toLocaleString()}
          </span>
          <div className="text-sm text-gray-400 mt-1">
            Confidence: {(appraisal.confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* AI Insight (إن وُجد) */}
      {appraisal.ai_insight && (
        <div className="appraisal-section mt-4 bg-white/10 p-4 rounded-lg border-l-4 border-blue-500">
          <div>
            <h4 className="section-title font-semibold text-white mb-2">AI Market Insight</h4>
            <p className="text-gray-200 text-sm leading-relaxed">{appraisal.ai_insight}</p>
          </div>
        </div>
      )}

      {/* العوامل الرئيسية */}
      <div className="appraisal-section mt-4">
        <h4 className="section-title font-semibold text-white mb-3">Key Factors</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {appraisal.reasons.map((reason, idx) => (
            <div key={idx} className="key-factor-item bg-white/10 p-3 rounded-lg text-gray-200">
              {reason}
            </div>
          ))}
        </div>
      </div>

      {/* المبيعات التاريخية المشابهة */}
      {appraisal.comparables && appraisal.comparables.length > 0 && (
        <div className="appraisal-section mt-4">
          <h5 className="section-title text-green-400 font-medium mb-3">Historical Sales</h5>
          <ul className="sales-list space-y-2 text-sm text-gray-200">
            {appraisal.comparables.map((sale, idx) => (
              <li key={idx} className="sale-item">
                {sale.domain} sold for{" "}
                <span className="text-green-300 font-semibold">${sale.price.toLocaleString()}</span>
                {sale.venue && ` at ${sale.venue}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* سياق السوق */}
      <div className="appraisal-section mt-4">
        <h4 className="section-title font-semibold text-white mb-3">Market Context</h4>
        
        {/* الفئة السوقية */}
        <div className="mb-4">
          <span className="category-badge inline-block px-4 py-2 bg-blue-900/30 text-blue-300 rounded-full text-sm font-medium">
            Category: {appraisal.category || "General"}
          </span>
        </div>

        {/* العروض الحالية من Atom */}
        {appraisal.atom_listings && appraisal.atom_listings.length > 0 ? (
          <div className="mt-3">
            <h5 className="section-title text-orange-400 font-medium mb-3">Active Listings on Atom</h5>
            <ul className="listings-list space-y-2">
              {appraisal.atom_listings.map((listing, idx) => (
                <li key={idx} className="listing-item text-sm text-gray-200">
                  <a 
                    href={listing.page_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-300 hover:text-orange-200 transition-colors duration-200"
                  >
                    {listing.domain}
                  </a>{" "}
                  listed for{" "}
                  <span className="text-orange-300 font-semibold">${listing.price.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic mt-2">
            No similar active listings found on Atom.
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sales Table (كما هو) ---
const SalesTable = ({ sales, page, setPage, size, setSize }) => {
  if (!sales || !Array.isArray(sales.data) || sales.data.length === 0) {
    return <div className="mt-6 text-center text-gray-400">No sales data found.</div>;
  }
  const currentPage = page || sales.page || 1;
  const pageSize = size || sales.size || 10;
  const totalSales = sales.total_sales || 0;
  const totalPages = sales.total_pages || Math.ceil(totalSales / pageSize);
  const showingStart = (currentPage - 1) * pageSize + 1;
  const showingEnd = Math.min(currentPage * pageSize, totalSales);
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-orange-400">Latest Domain Sales</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <span>Rows per page:</span>
          <select
            value={size}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setSize(newSize);
            }}
            className="bg-gray-700 text-white px-2 py-1 rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/20">
            <tr>
              <th className="px-4 py-2">Domain</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Venue</th>
              <th className="px-4 py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {sales.data.map((sale, idx) => (
              <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                <td className="px-4 py-2 font-mono">{sale.domain}</td>
                <td className="px-4 py-2 text-green-400">${Number(sale.price).toLocaleString()}</td>
                <td className="px-4 py-2">{sale.date}</td>
                <td className="px-4 py-2">{sale.venue}</td>
                <td className="px-4 py-2">
                  {sale.source_url ? (
                    <a href={sale.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                      {sale.source_text || "Source"}
                    </a>
                  ) : (
                    <span className="text-gray-300">{sale.source_text || "N/A"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-4 py-3 bg-white/5">
          <div className="text-sm text-gray-300">
            Showing {showingStart}-{showingEnd} of {totalSales} sales
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-600 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-600 disabled:text-gray-400"
            >
              Next
            </button>
            <span className="text-sm text-white">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component (كامل مع الدعم القديم) ---
export default function AnalysisResults({ 
  appraisal, 
  sales, 
  query, 
  page, 
  setPage, 
  size, 
  setSize, 
  results 
}) {
  const [openTool, setOpenTool] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy");
    }
  };

  const closeModal = () => setOpenTool(null);

  const handleViewDetails = async (tool) => {
    if (tool.name === "Domain History" && query) {
      try {
        const res = await fetch('/api/domain/wayback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: query })
        });
        const data = await res.json();
        if (res.ok) {
          setOpenTool({ ...tool, waybackData: data });
        } else {
          setOpenTool({ ...tool, error: data.error || "Analysis failed" });
        }
      } catch (err) {
        setOpenTool({ ...tool, error: "Network error" });
      }
    } else {
      setOpenTool(tool);
    }
  };

  // --- Display NEW FEATURES ---
  if (FEATURES.NEW_APPRAISAL || FEATURES.SALES_TABLE) {
    return (
      <div className="max-w-6xl mx-auto mt-6">
        {query && (
          <div className="mb-6 flex items-center justify-center">
            <span className="font-mono bg-gray-800 px-3 py-1 rounded-l text-orange-300">{query}</span>
            <button
              onClick={copyToClipboard}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-r flex items-center gap-1 transition"
              title="Copy domain"
            >
              <HiClipboardCopy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        {/* معلومات الاستخدام */}
        {appraisal && appraisal.usage_info && (
          <div className="usage-info mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400"></span>
                <span className="text-white text-sm">
                  Your remaining requests today: {appraisal.usage_info.remaining_requests}/3
                </span>
              </div>
              <div className="text-xs text-blue-300">
                {appraisal.usage_info.message}
              </div>
            </div>
            <div className="w-full bg-blue-900/30 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(appraisal.usage_info.remaining_requests / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {FEATURES.NEW_APPRAISAL && <AppraisalCard appraisal={appraisal} />}
        {FEATURES.SALES_TABLE && (
          <SalesTable 
            sales={sales} 
            page={page} 
            setPage={setPage} 
            size={size} 
            setSize={setSize} 
          />
        )}
        {openTool && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={closeModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0f172a] text-white p-6 rounded-lg max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{openTool.name}</h3>
                <button
                  onClick={closeModal}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center gap-1"
                >
                  <HiX className="w-4 h-4" /> Close
                </button>
              </div>
              {openTool.name === "Domain History" && openTool.waybackData ? (
                <div className="mt-2 text-sm whitespace-pre-line font-sans">
                  {openTool.waybackData.analysis.split('\n').map((line, i) => (
                    <p key={i} className="mb-1 leading-relaxed">{line}</p>
                  ))}
                  <div className="text-gray-400 text-xs mt-3 border-t border-white/10 pt-2">
                    Raw Data: {openTool.waybackData.raw.total} archives • {openTool.waybackData.raw.firstYear}–{openTool.waybackData.raw.lastYear}
                  </div>
                  <a href={openTool.waybackData.waybackUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 px-3 py-1 bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white rounded text-xs hover:opacity-90">
                    View Full Archive
                  </a>
                </div>
              ) : openTool.name === "Domain History" && openTool.error ? (
                <div className="mt-4 text-red-400">Error: {openTool.error}</div>
              ) : (
                <p className="text-gray-200">{openTool.description}</p>
              )}
              {openTool.suggestedPrice && openTool.name !== "Domain History" && (
                <div className="mt-4 text-green-400">
                  Suggested Price: {openTool.suggestedPrice}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // --- Display OLD RESULTS ---
  if (!results || !results[0]?.tools) return null;
  const allTools = results[0].tools;
  const filteredTools = allTools.filter(tool => {
    const toolFlags = {
      "Domain Sales": FEATURES.DOMAIN_SALES,
      "Lead Generator": FEATURES.LEAD_GENERATOR,
      "CPC & Search Volume": FEATURES.CPC_SEARCH_VOLUME,
      "Backlink Checker": FEATURES.BACKLINK_CHECKER,
      "Alternative Spellings": FEATURES.ALTERNATIVE_SPELLINGS,
      "Domain Generator": FEATURES.DOMAIN_GENERATOR,
      "Trademark Checks": FEATURES.TRADEMARK_CHECKS,
      "New Domain Registrations": FEATURES.NEW_REGISTRATIONS,
      "Domain History": FEATURES.DOMAIN_HISTORY,
      "One-word Domains": FEATURES.ONE_WORD_DOMAINS,
      "Two-word Domains": FEATURES.TWO_WORD_DOMAINS,
      "Suggested Sale Price": FEATURES.SUGGESTED_SALE_PRICE,
    };
    return toolFlags[tool.name] !== false;
  });
  const analysisCards = filteredTools.filter(tool => tool.name !== "Domain Providers");
  const domainProvidersCard = FEATURES.DOMAIN_PROVIDERS ? allTools.find(tool => tool.name === "Domain Providers") : null;
  const providerNames = domainProvidersCard ? Object.keys(domainProvidersCard.providersPrices) : [];

  return (
    <div className="max-w-6xl mx-auto mt-6">
      {/* Copy domain */}
      {query && (
        <div className="mb-6 flex items-center justify-center">
          <span className="font-mono bg-gray-800 px-3 py-1 rounded-l text-orange-300">{query}</span>
          <button
            onClick={copyToClipboard}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-r flex items-center gap-1 transition"
            title="Copy domain"
          >
            <HiClipboardCopy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      {/* OLD ANALYSIS CARDS */}
      {analysisCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysisCards.map((tool, idx) => {
            const Icon = iconMap[tool.name] || HiOutlineSearch;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-center"
              >
                <div className="flex justify-center mb-3 text-3xl text-orange-400">
                  <Icon />
                </div>
                <h4 className="font-semibold text-lg mb-2 text-white">{tool.name}</h4>
                <p className="text-gray-200 text-sm mb-2">{tool.description}</p>
                {tool.name === "Suggested Sale Price" && tool.suggestedPrice && (
                  <div className="mt-2 text-sm text-green-400">
                    Suggested Price: {tool.suggestedPrice}
                  </div>
                )}
                <button
                  onClick={() => handleViewDetails(tool)}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded text-white hover:opacity-90 transition"
                >
                  View Details
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
      {/* DOMAIN PROVIDERS */}
      {domainProvidersCard && (
        <div className="col-span-1 md:col-start-2 mt-10">
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-center mb-4">
            <h4 className="font-semibold text-lg mb-2 text-white">{domainProvidersCard.name}</h4>
            <p className="text-gray-200 text-sm mb-4">{domainProvidersCard.description}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {providerNames.map((provider, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="p-3 bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded-lg text-center cursor-pointer"
              >
                <h5 className="font-semibold text-black">{provider}</h5>
                <p className="text-black text-sm mb-2">{domainProvidersCard.providersPrices[provider]}</p>
                <button 
                  className="px-3 py-1 bg-white/20 text-black rounded 
                             transition-all duration-200 ease-in-out
                             hover:bg-white/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Buy Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {/* POPUP */}
      {openTool && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={closeModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f172a] text-white p-6 rounded-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">{openTool.name}</h3>
              <button
                onClick={closeModal}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center gap-1"
              >
                <HiX className="w-4 h-4" /> Close
              </button>
            </div>
            {openTool.name === "Domain History" && openTool.waybackData ? (
              <div className="mt-2 text-sm whitespace-pre-line font-sans">
                {openTool.waybackData.analysis.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 leading-relaxed">{line}</p>
                ))}
                <div className="text-gray-400 text-xs mt-3 border-t border-white/10 pt-2">
                  Raw Data: {openTool.waybackData.raw.total} archives • {openTool.waybackData.raw.firstYear}–{openTool.waybackData.raw.lastYear}
                </div>
                <a href={openTool.waybackData.waybackUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-3 px-3 py-1 bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white rounded text-xs hover:opacity-90">
                  View Full Archive
                </a>
              </div>
            ) : openTool.name === "Domain History" && openTool.error ? (
              <div className="mt-4 text-red-400">Error: {openTool.error}</div>
            ) : (
              <p className="text-gray-200">{openTool.description}</p>
            )}
            {openTool.suggestedPrice && openTool.name !== "Domain History" && (
              <div className="mt-4 text-green-400">
                Suggested Price: {openTool.suggestedPrice}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}