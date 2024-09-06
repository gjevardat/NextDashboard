'use server'

import type { NextApiRequest, NextApiResponse } from "next";
import pool from '@/app/lib/db'


export async function getTS() {


  try {
    const data = await pool.query(
      `select * from ts_derived_web('RemoveOutliersFaintAndBrightOperator_FOV_G',417,7632157690368)`
    );
    return data.rows; // Return the actual data
  } catch (err) {
    throw new Error('Failed to load data');
  }


}

