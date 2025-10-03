import Link from "next/link";
import Head from "next/head";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service | Perdomain</title>
        <meta name="description" content="Comprehensive Terms of Service for Perdomain, the platform specializing in domain name research and analysis. Understand your rights, responsibilities, privacy, and usage guidelines." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Terms of Service | Perdomain" />
        <meta property="og:description" content="Detailed Terms of Service outlining lawful use, data accuracy, privacy policy, liability limitations, and terms update for Perdomain users." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://perdomain.com/terms" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-orange-400">Terms of Service</h1>
          <p className="mb-6 text-gray-200">
            Welcome to Perdomain, your trusted platform for domain name research and analysis. By accessing or using our services, you agree to comply with these Terms of Service in full.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">1. Acceptance of Terms</h2>
          <p className="mb-4 text-gray-200">
            By using Perdomain, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use our platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">2. Service Description</h2>
          <p className="mb-4 text-gray-200">
            Perdomain offers tools and resources to analyze domain names' value, history, technical data, and market trends. This information is designed to assist in making informed decisions regarding domain investments or acquisitions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">3. User Responsibilities</h2>
          <p className="mb-4 text-gray-200">
            You agree to use Perdomain only for lawful purposes. Unauthorized use of data or analysis regarding domains owned by others without permission is prohibited. You are responsible for your actions and decisions based on the information obtained from our platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">4. Accuracy and Disclaimer</h2>
          <p className="mb-4 text-gray-200">
            While Perdomain strives to provide accurate and timely domain data, some information may come from third-party sources and may be incomplete or outdated. We do not guarantee the accuracy, completeness, or suitability of any information for your purposes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">5. Intellectual Property</h2>
          <p className="mb-4 text-gray-200">
            All content, trademarks, logos, and software on Perdomain are the intellectual property of Perdomain or its licensors. Unauthorized copying, distribution, or use is strictly prohibited.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">6. Privacy Policy</h2>
          <p className="mb-4 text-gray-200">
            Your privacy is important to us. We collect and process personal data according to our Privacy Policy, which you should review to understand how your information is handled.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">7. Limitation of Liability</h2>
          <p className="mb-4 text-gray-200">
            Perdomain is not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform. Any decisions made based on our data or reports are at your own risk.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">8. Termination</h2>
          <p className="mb-4 text-gray-200">
            We reserve the right to suspend or terminate your access to Perdomain at our sole discretion, without prior notice, for violation of these Terms or any unlawful behavior.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">9. Changes to Terms</h2>
          <p className="mb-4 text-gray-200">
            These Terms may be updated periodically without prior notice. Continued use of Perdomain after changes constitutes acceptance of the revised terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">10. Governing Law</h2>
          <p className="mb-4 text-gray-200">
            These Terms are governed by and construed in accordance with the laws applicable in the jurisdiction where Perdomain operates, without regard to conflict of law principles.
          </p>

          <p className="text-gray-200 mt-6">
            For questions or concerns regarding these Terms, please contact us at:{" "}
            <a href="mailto:admin@perdomain.com" className="text-orange-400 underline">
              admin@perdomain.com
            </a>
          </p>

          <div className="mt-10">
            <Link href="/" legacyBehavior>
              <a className="px-6 py-3 bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded text-white font-semibold hover:opacity-90 transition">
                ← Back to Home
              </a>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
