import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Link } from '@/models/Link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { originalUrl, customSlug } = await req.json();

  await connectToDatabase();

  let slug = customSlug || Math.random().toString(36).substring(2, 8);

  try {
    const newLink = new Link({
      originalUrl,
      slug,
      userId: session.user.id,
    });

    await newLink.save();

    return NextResponse.json({ link: newLink }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating link' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const links = await Link.find({ userId: session.user.id });
    return NextResponse.json({ links }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching links' }, { status: 500 });
  }
}