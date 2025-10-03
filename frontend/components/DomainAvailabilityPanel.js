// components/DomainAvailabilityPanel.js
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiCheckCircle, HiXCircle, HiX } from "react-icons/hi";

export default function DomainAvailabilityPanel({ domain, availabilityData, loading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summaryStatus, setSummaryStatus] = useState(null); // 'available' or 'taken'

  // Determine status of the main domain (the one user searched for)
  useEffect(() => {
    if (availabilityData?.length > 0) {
      const mainDomain = availabilityData.find(item => 
        `${item.DomainName}.${item.TLD}`.toLowerCase() === domain.toLowerCase()
      ) || availabilityData[0];
      
      setSummaryStatus(
        (mainDomain?.Status || mainDomain?.status || "").toLowerCase() === "available" 
          ? "available" 
          : "taken"
      );
    }
  }, [availabilityData, domain]);

  if (!domain || (!availabilityData && !loading)) return null;

  const normalizedData = Array.isArray(availabilityData)
    ? availabilityData
    : availabilityData
    ? [availabilityData]
    : [];

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Summary row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 mt-6"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/20 text-center">
          <div className="font-mono text-lg md:text-xl mb-2">{domain}</div>
          <div className="flex items-center justify-center gap-2 mb-4">
            {summaryStatus === "available" ? (
              <span className="text-green-400 flex items-center gap-1">
                <HiCheckCircle className="w-4 h-4" /> Available
              </span>
            ) : summaryStatus === "taken" ? (
              <span className="text-red-400 flex items-center gap-1">
                <HiXCircle className="w-4 h-4" /> Taken
              </span>
            ) : (
              <span className="text-gray-400">Checking...</span>
            )}
          </div>
          {summaryStatus && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white rounded hover:opacity-90 transition text-sm"
            >
              View Details
            </button>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f172a] text-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <h3 className="text-xl font-bold">Domain Availability</h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/10 rounded"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {normalizedData.length > 0 ? (
                <div className="space-y-3">
                  {normalizedData.map((item, idx) => {
                    const status = (item.Status || item.status || "").toLowerCase();
                    const sld = item.DomainName || '';
                    const tld = item.TLD || '';
                    const fullName = sld && tld ? `${sld}.${tld}` : '';
                    const price = item.Price || item.price;
                    const currency = item.Currency || item.currency || "USD";

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          status === "available"
                            ? "bg-green-900/20 border-green-500/30"
                            : "bg-red-900/20 border-red-500/30"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-mono text-sm">{fullName}</div>
                            <div className="text-xs mt-1 flex items-center gap-1">
                              {status === "available" ? (
                                <span className="text-green-400 flex items-center gap-1">
                                  <HiCheckCircle className="w-3 h-3" /> Available
                                </span>
                              ) : (
                                <span className="text-red-400 flex items-center gap-1">
                                  <HiXCircle className="w-3 h-3" /> Taken
                                </span>
                              )}
                            </div>
                          </div>
                          {status === "available" && price && (
                            <div className="text-right">
                              <div className="text-orange-300 font-semibold text-sm">
                                ${price} {currency}
                              </div>
                              <button
                                onClick={() => {
                                  const buyUrl = `https://cp.domainnameapi.com/cart.php?a=add&domain=register&sld=${encodeURIComponent(sld)}&tld=${encodeURIComponent(tld)}`;
                                  window.open(buyUrl, '_blank', 'width=800,height=600');
                                }}
                                className="mt-1 px-2 py-1 bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white rounded text-xs hover:opacity-90"
                              >
                                Buy Now
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-300 text-center">No data available.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}