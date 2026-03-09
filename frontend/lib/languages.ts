export type MessageType = 'gm' | 'gn';

export interface Language {
  code: string;
  name: string;
  flag: string;
  gm: string;
  gn: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', gm: 'Good morning', gn: 'Good night' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', gm: 'Buenos días', gn: 'Buenas noches' },
  { code: 'fr', name: 'French', flag: '🇫🇷', gm: 'Bonjour', gn: 'Bonne nuit' },
  { code: 'de', name: 'German', flag: '🇩🇪', gm: 'Guten Morgen', gn: 'Gute Nacht' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', gm: 'Buongiorno', gn: 'Buona notte' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', gm: 'Bom dia', gn: 'Boa noite' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', gm: 'Доброе утро', gn: 'Спокойной ночи' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', gm: 'صباح الخير', gn: 'تصبح على خير' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', gm: 'Günaydın', gn: 'İyi geceler' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', gm: 'सुप्रभात', gn: 'शुभ रात्रि' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', gm: 'おはよう', gn: 'おやすみ' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', gm: '좋은 아침', gn: '안녕히 주무세요' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', gm: '早上好', gn: '晚安' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', gm: 'Selamat pagi', gn: 'Selamat malam' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', gm: 'Chào buổi sáng', gn: 'Chúc ngủ ngon' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', gm: 'สวัสดีตอนเช้า', gn: 'ราตรีสวัสดิ์' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', gm: 'Καλημέρα', gn: 'Καληνύχτα' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', gm: 'Goedemorgen', gn: 'Goedenacht' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', gm: 'Dzień dobry', gn: 'Dobranoc' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', gm: 'Habari za asubuhi', gn: 'Usiku mwema' },
];
