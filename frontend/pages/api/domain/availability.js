// pages/api/domain/availability.js
import DomainNameAPI from '../../../lib/DomainNameAPI';

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { domain } = req.body;
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Valid domain required' });
  }

  const clean = domain.trim().toLowerCase();
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(clean)) {
    return res.status(400).json({ error: 'Invalid domain format' });
  }

  try {
    const api = new DomainNameAPI(
      process.env.DNA_USERNAME,
      process.env.DNA_PASSWORD
    );

    const parts = clean.split('.');
    const sld = parts.slice(0, -1).join('.');

   // ← استخدم فقط الامتدادات التي جربتها يدويًا ونجحت
    const commonTlds = ['com', 'net', 'org', 'io', 'ai', 'xyz', 'me', 'co', 'app', 'pro', 'shop', 'is'];

    // ← استخدم 'create' كما في test.js
    const availability = await api.CheckAvailability([sld], commonTlds, 1, 'create');

    console.log("API Response:", availability); // ← للتحقق
    res.status(200).json({ availability });
  } catch (error) {
    console.error('Domainnameapi Error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
}