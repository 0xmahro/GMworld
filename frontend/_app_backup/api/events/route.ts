import { NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';
import { GMWORLD_ADDRESS } from '@/lib/contracts';

const ABI = [
  parseAbiItem(
    'event MessageSent(address indexed user, string message, uint256 timestamp)'
  ),
] as const;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const address = GMWORLD_ADDRESS as `0x${string}`;
  if (address === '0x0000000000000000000000000000000000000000') {
    return NextResponse.json({
      messages: [],
      gmToday: 0,
      gnToday: 0,
    });
  }

  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  try {
    const block = await client.getBlockNumber();
    const fromBlock = block > 50000n ? block - 50000n : 0n;

    const logs = await client.getLogs({
      address,
      event: ABI[0],
      fromBlock,
      toBlock: block,
    });

    const gmPhrases = new Set([
      'Good morning', 'Buenos días', 'Bonjour', 'Guten Morgen', 'Buongiorno',
      'Bom dia', 'Доброе утро', 'صباح الخير', 'Günaydın', 'सुप्रभात', 'おはよう',
      '좋은 아침', '早上好', 'Selamat pagi', 'Chào buổi sáng', 'สวัสดีตอนเช้า',
      'Καλημέρα', 'Goedemorgen', 'Dzień dobry', 'Habari za asubuhi',
    ]);
    const gnPhrases = new Set([
      'Good night', 'Buenas noches', 'Bonne nuit', 'Gute Nacht', 'Buona notte',
      'Boa noite', 'Спокойной ночи', 'تصبح على خير', 'İyi geceler', 'शुभ रात्रि',
      'おやすみ', '안녕히 주무세요', '晚安', 'Selamat malam', 'Chúc ngủ ngon',
      'ราตรีสวัสดิ์', 'Καληνύχτα', 'Goedenacht', 'Dobranoc', 'Usiku mwema',
    ]);

    const todayStart = Math.floor(
      new Date(new Date().toDateString()).getTime() / 1000
    );

    let gmToday = 0;
    let gnToday = 0;

    const messages = logs
      .map((log) => {
        const args = log.args as { user: string; message: string; timestamp: bigint };
        const ts = Number(args.timestamp);
        const msg = args.message;
        if (gmPhrases.has(msg) && ts >= todayStart) gmToday++;
        if (gnPhrases.has(msg) && ts >= todayStart) gnToday++;
        return {
          user: args.user,
          message: msg,
          timestamp: ts,
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      messages,
      gmToday,
      gnToday,
    });
  } catch (e) {
    console.error('Events API error:', e);
    return NextResponse.json({
      messages: [],
      gmToday: 0,
      gnToday: 0,
    });
  }
}
