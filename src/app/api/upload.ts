import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      // Upload image to Cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(data, {
        folder: 'profileImages', // Optional: organize images in a folder
      });

      res.status(200).json({ url: uploadedResponse.secure_url });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ error: 'Image upload failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
