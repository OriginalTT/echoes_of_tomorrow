import { NextResponse } from 'next/server';

let totalVotes = 0;

export async function GET(req) {
    console.log(req.nextUrl.searchParams.get('deviceId'));
    return NextResponse.json({ votes: totalVotes });
};

export async function POST(req) {
    totalVotes++;
    const data = await req.json();
    return NextResponse.json({ votes: totalVotes });
};