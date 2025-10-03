import Link from "next/link";
import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Perdomain</title>
        <meta name="description" content="Privacy Policy for Perdomain, detailing how we collect, use, and protect your personal information when using our domain analysis platform." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Privacy Policy | Perdomain" />
        <meta property="og:description" content="Learn how Perdomain collects and handles your data. Your privacy is important to us." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://perdomain.com/privacy" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-orange-400">Privacy Policy</h1>
          <p className="mb-6 text-gray-200">
            At Perdomain, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our domain name research and analysis services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">1. Information We Collect</h2>
          <p className="mb-4 text-gray-200">
            We may collect personal information you voluntarily provide when registering or contacting us, such as your name, email address, and payment details if applicable. Additionally, we automatically collect certain technical data such as IP addresses, browser type, and usage data through cookies and similar technologies.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">2. How We Use Your Information</h2>
          <p className="mb-4 text-gray-200">
            Your data is used to provide and improve our services, process payments, communicate important updates, customize your experience, and comply with legal obligations. We do not sell your personal information to third parties.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">3. Data Sharing and Disclosure</h2>
          <p className="mb-4 text-gray-200">
            We may share your information with trusted service providers who assist us in operating the platform, such as hosting and payment processing companies, under strict confidentiality agreements. We may also disclose information if required by law or to protect our rights, safety, or property.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">4. Cookies and Tracking Technologies</h2>
          <p className="mb-4 text-gray-200">
            We use cookies and similar technologies to enhance your experience, analyze site traffic, and support marketing efforts. You can choose to disable cookies via your browser settings, but this might affect some features of our platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">5. Your Rights and Choices</h2>
          <p className="mb-4 text-gray-200">
            You have the right to access, correct, or request deletion of your personal data. You can also opt out of receiving marketing communications. To exercise these rights, please contact us using the information below.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">6. Data Security</h2>
          <p className="mb-4 text-gray-200">
            We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, or alteration.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">7. Children's Privacy</h2>
          <p className="mb-4 text-gray-200">
            Our services are not directed to individuals under 13 years of age and we do not knowingly collect personal information from children.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">8. Changes to This Policy</h2>
          <p className="mb-4 text-gray-200">
            We may update this Privacy Policy periodically. Changes will be posted on this page, and your continued use of our services after such updates constitutes your acceptance of the revised terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-orange-300">9. Contact Us</h2>
          <p className="mb-4 text-gray-200">
            If you have questions or concerns about this Privacy Policy or your data, please contact us at:{" "}
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
