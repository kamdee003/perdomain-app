import { useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    // TODO: Add API call or email sending logic here

    // Simulate async submission delay
    setTimeout(() => {
      setStatus("Thank you for your message! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Contact Us | Perdomain</title>
        <meta name="description" content="Contact Perdomain for questions, feedback or suggestions regarding domain name research and analysis services." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Contact Us | Perdomain" />
        <meta property="og:description" content="Reach out to Perdomain with your questions or feedback about our domain analysis platform." />
        <link rel="canonical" href="https://perdomain.com/contact" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-orange-400">Contact Us</h1>
          <p className="mb-10 text-gray-200">
            Have questions, suggestions, or feedback? Fill out the form below and we’ll get back to you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-8 text-left"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none"
                disabled={isSubmitting}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white font-semibold rounded hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          {status && <p className="mt-4 text-orange-300">{status}</p>}

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
