// pages/api/domain/wayback.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { domain } = req.body;
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Valid domain required' });
  }

  try {
    const url = `http://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(domain)}&output=json&fl=timestamp`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length <= 1) {
      return res.status(200).json({
        analysis: [
          "🔍 **No Historical Footprint**",
          "This domain has no archives in the Wayback Machine.",
          "→ Likely a new, parked, or never-published domain.",
          "→ **Caution**: High risk if sold as an 'established brand'."
        ].join("\n"),
        raw: { total: 0 }
      });
    }

    const timestamps = data.slice(1)
      .map(row => row[0])
      .filter(ts => /^\d{14}$/.test(ts))
      .sort();

    if (timestamps.length === 0) {
      return res.status(200).json({
        analysis: "No valid archives found.",
        raw: { total: 0 }
      });
    }

    const firstTs = timestamps[0];
    const lastTs = timestamps[timestamps.length - 1];
    const firstYear = parseInt(firstTs.slice(0, 4));
    const lastYear = parseInt(lastTs.slice(0, 4));
    const currentYear = new Date().getFullYear();
    const total = timestamps.length;
    const yearsActive = lastYear - firstYear + 1;
    const archivesPerYear = total / yearsActive;

    // تحليل التكرار الشهري
    const monthlyArchives = {};
    timestamps.forEach(ts => {
      const month = ts.slice(0, 6);
      monthlyArchives[month] = (monthlyArchives[month] || 0) + 1;
    });
    const maxMonthly = Math.max(...Object.values(monthlyArchives));
    const activeMonths = Object.keys(monthlyArchives).length;

    // تحليل الفجوات الزمنية
    let gaps = [];
    for (let i = 1; i < timestamps.length; i++) {
      const prevYear = parseInt(timestamps[i-1].slice(0, 4));
      const currYear = parseInt(timestamps[i].slice(0, 4));
      const gap = currYear - prevYear;
      if (gap > 1) gaps.push(gap);
    }
    const maxGap = gaps.length > 0 ? Math.max(...gaps) : 0;

    // بناء التحليل كخبير
    let analysisLines = [];

    // 1. Brand Longevity
    const brandAge = currentYear - firstYear + 1;
    if (brandAge >= 10) {
      analysisLines.push(`🏆 **Legacy Brand (${brandAge}+ Years)**`);
      analysisLines.push(`First archived in ${firstYear} — this domain has deep roots in the digital landscape.`);
    } else if (brandAge >= 5) {
      analysisLines.push(`✅ **Established Brand (${brandAge} Years)**`);
      analysisLines.push(`Consistent presence since ${firstYear} — indicates serious business intent.`);
    } else {
      analysisLines.push(`🆕 **Emerging Brand (${brandAge} Years)**`);
      analysisLines.push(`First appeared in ${firstYear}. Potential for growth, but limited history.`);
    }

    // 2. Activity Intensity & Content Type
    if (maxMonthly >= 5) {
      analysisLines.push(`🔥 **High-Frequency Publisher**`);
      analysisLines.push(`Peak activity: ${maxMonthly} captures in a single month.`);
      analysisLines.push(`→ Likely a news site, blog, or e-commerce platform with daily updates.`);
    } else if (archivesPerYear >= 5) {
      analysisLines.push(`📊 **Active Publisher**`);
      analysisLines.push(`${total} archives over ${yearsActive} years (${archivesPerYear.toFixed(1)}/year).`);
      analysisLines.push(`→ Suggests regular content updates or business operations.`);
    } else {
      analysisLines.push(`ℹ️ **Low-Frequency Publisher**`);
      analysisLines.push(`Only ${total} archives in ${yearsActive} years.`);
      analysisLines.push(`→ May be a portfolio, landing page, or personal site.`);
    }

    // 3. Current Status & Drop Risk
    if (lastYear === currentYear) {
      analysisLines.push(`🟢 **Currently Active**`);
      analysisLines.push(`Last archived this year — strong indicator of ongoing use.`);
    } else if (lastYear >= currentYear - 1) {
      analysisLines.push(`🟡 **Recently Active**`);
      analysisLines.push(`Last archived in ${lastYear} — may be temporarily inactive.`);
    } else {
      analysisLines.push(`🔴 **Likely Abandoned**`);
      analysisLines.push(`No archives since ${lastYear} — high risk of being dropped.`);
    }

    // 4. Stability
    if (maxGap > 2) {
      analysisLines.push(`⚠️ **Unstable History**`);
      analysisLines.push(`Detected gaps >${maxGap} years — suggests inconsistent ownership or use.`);
    } else if (activeMonths / yearsActive > 6) {
      analysisLines.push(`✅ **Stable & Consistent**`);
      analysisLines.push(`Active in ${Math.round(activeMonths / yearsActive)} months/year on average.`);
    }

    // 5. Investment Verdict
    let verdict = "";
    if (brandAge >= 5 && lastYear >= currentYear - 1 && archivesPerYear >= 2) {
      verdict = "💎 **High-Value Asset**: Strong history + current activity = premium resale potential.";
    } else if (brandAge >= 5 && lastYear < currentYear - 1) {
      verdict = "⚠️ **Reactivation Opportunity**: Established brand, but currently dormant. Low acquisition cost.";
    } else if (brandAge < 3 && archivesPerYear >= 5) {
      verdict = "🚀 **Rising Star**: New but highly active — potential for rapid value growth.";
    } else {
      verdict = "🔍 **Due Diligence Required**: Limited history or activity. Verify before investing.";
    }
    analysisLines.push(`\n${verdict}`);

    res.status(200).json({
      analysis: analysisLines.join("\n"),
      raw: {
        total,
        firstYear,
        lastYear,
        yearsActive,
        archivesPerYear: archivesPerYear.toFixed(1),
        maxMonthly,
        maxGap
      },
      waybackUrl: `https://web.archive.org/web/*/${domain}`
    });
  } catch (error) {
    console.error('Wayback API Error:', error);
    res.status(500).json({ error: 'Failed to analyze domain history' });
  }
}