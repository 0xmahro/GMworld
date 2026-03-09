import type { NextApiRequest, NextApiResponse } from 'next';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';
import { GMWORLD_ADDRESS } from '@/lib/contracts';

const ABI = [
  parseAbiItem(
    'event MessageSent(address indexed user, string message, uint256 timestamp)'
  ),
] as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const address = GMWORLD_ADDRESS as `0x${string}`;
  if (address === '0x0000000000000000000000000000000000000000') {
    return res.json({ messages: [], gmToday: 0, gnToday: 0, gmTotal: 0, gnTotal: 0 });
  }

  const client = createPublicClient({
    chain: base,
    transport: http('https://base-mainnet.g.alchemy.com/v2/jnWew_yGj44DTFsz0fyt2'),
  });

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    const block = await client.getBlockNumber();
    // Alchemy free tier limits getLogs to ~10k blocks
    const range = 10000n;
    const fromBlock = block > range ? block - range : 0n;

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

    const now = new Date();
    const todayStart = Math.floor(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000
    );

    let gmToday = 0;
    let gnToday = 0;
    let gmTotal = 0;
    let gnTotal = 0;

    const messages = logs
      .map((log) => {
        const args = log.args as { user: string; message: string; timestamp: bigint };
        const ts = Number(args.timestamp);
        const msg = args.message;
        if (gmPhrases.has(msg)) {
          gmTotal++;
          if (ts >= todayStart) gmToday++;
        }
        if (gnPhrases.has(msg)) {
          gnTotal++;
          if (ts >= todayStart) gnToday++;
        }
        return {
          user: args.user,
          message: msg,
          timestamp: ts,
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    res.json({ messages, gmToday, gnToday, gmTotal, gnTotal });
  } catch (e) {
    console.error('Events API error:', e);
    res.json({ messages: [], gmToday: 0, gnToday: 0, gmTotal: 0, gnTotal: 0 });
  }
}
