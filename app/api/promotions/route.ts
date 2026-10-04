import { NextResponse } from 'next/server';
import { promotionRepository } from '@/backend/repositories';

export async function GET(req: Request) {
  const url = new URL(req.url);
  let promos = await promotionRepository.findAll();
  
  if (url.searchParams.get('activeOnly') === 'true') {
    promos = promos.filter(p => p.active);
  }
  if (url.searchParams.get('flashSalesOnly') === 'true') {
    promos = promos.filter(p => p.type === 'flash_sale');
  }

  return NextResponse.json(promos);
}
