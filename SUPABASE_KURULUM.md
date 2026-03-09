# GM World - Supabase Kurulumu

## Adım 1: Supabase Projesi Oluştur

1. https://supabase.com/dashboard adresine git
2. **New Project** → proje adı (örn. `gmworld`), şifre belirle
3. Region seç → **Create**

## Adım 2: Tabloyu Oluştur

1. Sol menüden **SQL Editor** aç
2. `supabase/schema.sql` dosyasındaki SQL'i kopyala
3. SQL Editor'a yapıştır → **Run**

## Adım 3: API Anahtarlarını Al

1. Sol menüden **Project Settings** (dişli ikonu)
2. **API** sekmesi
3. Şunları kopyala:
   - **Project URL** (örn. `https://xxxxx.supabase.co`)
   - **anon public** key

## Adım 4: .env.local Oluştur

`frontend/.env.local` dosyasında:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## Adım 5: Dev Server'ı Yeniden Başlat

```bash
cd frontend
npm install
rm -rf .next
npm run dev
```

## Test

1. Cüzdanı bağla
2. **Send GM** veya **Send GN** tıkla
3. Mesaj anında Supabase'e yazılır, sayılar güncellenir
4. Gas ücreti yok ✓
