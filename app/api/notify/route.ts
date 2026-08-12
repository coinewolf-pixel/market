import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_API = process.env.TELEGRAM_BOT_API_URL || 'http://localhost:8081/notify';
const API_SECRET = process.env.API_SECRET || 'super-secret-api-key-12345';

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('X-API-Secret');
    if (secret !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(TELEGRAM_BOT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret': API_SECRET,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Bot service error' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}