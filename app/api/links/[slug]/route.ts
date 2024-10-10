import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Link } from '@/models/Link';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  await connectToDatabase();

  try {
    const link = await Link.findOne({ slug });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Update click count and add location data
    link.clicks += 1;
    link.clickData.push({
      timestamp: new Date(),
      location: req.headers.get('x-vercel-ip-country') || 'Unknown',
    });
    await link.save();

    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    return NextResponse.json({ error: 'Error redirecting' }, { status: 500 });
  }
}