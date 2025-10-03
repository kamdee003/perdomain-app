export default function Stats({ t }) {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          {t?.stats?.title || "Trusted by Thousands of Users"}
        </h2>

        {/* Stats Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#fb923c]">
              400K+
            </p>
            <p className="opacity-80 mt-2">
              {t?.stats?.domains || "Domains Processed"}
            </p>
          </div>

          <div>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#fb923c]">
              30K+
            </p>
            <p className="opacity-80 mt-2">
              {t?.stats?.queries || "Daily Queries"}
            </p>
          </div>

          <div>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#fb923c]">
              10+
            </p>
            <p className="opacity-80 mt-2">
              {t?.stats?.years || "Years of Experience"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
