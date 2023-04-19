import type { NextApiRequest, NextApiResponse } from 'next';
import { getImageFile } from '@/src/lib/utils';
import { encode } from 'base64-arraybuffer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    let imageUrl = req.body.url;
    try {
      let response = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          'Content-type': 'image/*',
        },
      })
        .then(function (response) {
          return response.blob();
        })
        .then(async function (blob) {
          var buffer = await blob.arrayBuffer();
          return res.status(200).json({ buffer: encode(buffer) });
        });
    } catch (error: any) {
      console.log(error, 'error');
      return res.status(400).json({ error: 'Server Error' });
    }
  }
}
