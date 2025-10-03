import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";
import { 
  HiLightningBolt, 
  HiLightBulb, 
  HiOutlineSearch, 
  HiGlobeAlt, 
  HiTrendingUp, 
  HiAdjustments 
} from "react-icons/hi";

export default function Features() {
  const features = [
    {
      icon: <HiLightningBolt className="w-8 h-8 text-white" />,
      title: "Fast Search",
      description: "Find the perfect domain in seconds with lightning-fast results."
    },
    {
      icon: <HiLightBulb className="w-8 h-8 text-white" />,
      title: "Smart Suggestions",
      description: "Receive intelligent domain name suggestions based on your input."
    },
    {
      icon: <HiOutlineSearch className="w-8 h-8 text-white" />,
      title: "No Signup Required",
      description: "Start searching instantly without the need to register or login."
    },
    {
      icon: <HiGlobeAlt className="w-8 h-8 text-white" />,
      title: "Global Search",
      description: "Search for domains worldwide with a single click."
    },
    {
      icon: <HiTrendingUp className="w-8 h-8 text-white" />,
      title: "Popular Domains",
      description: "Explore trending and highly sought-after domain names easily."
    },
    {
      icon: <HiAdjustments className="w-8 h-8 text-white" />,
      title: "Advanced Filters",
      description: "Filter domains by length, extension, and popularity for precise results."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white font-sans">
          Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
