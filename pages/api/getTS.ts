import { getTS } from '@/app/lib/data';

import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req:NextApiRequest , res:NextApiResponse) {
    try {
      const {sourceId} = req.query;
      const data = await getTS(sourceId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }