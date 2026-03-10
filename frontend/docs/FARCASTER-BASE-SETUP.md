# Farcaster & Base App Entegrasyonu

GM World için Farcaster ve Base Mini App kurulum adımları.

---

## 1. Base Mini App Manifest

**Yapıldı:** Manifest API route ve rewrite eklendi.

### Yapman Gerekenler

1. **`NEXT_PUBLIC_APP_URL`** ayarla (örn. `https://worldgm.xyz`).

2. **Account Association** oluştur:
   - https://base.dev/preview adresine git
   - "Account association" sekmesine geç
   - App URL’ini gir (örn. `worldgm.xyz`) ve "Submit" tıkla
   - Cüzdanınla imzala
   - Oluşan `header`, `payload`, `signature` değerlerini `.env` / Vercel’a ekle:
     - `FC_ACCOUNT_HEADER`
     - `FC_ACCOUNT_PAYLOAD`
     - `FC_ACCOUNT_SIGNATURE`

3. **Manifest’i test et:** `https://your-domain.com/.well-known/farcaster.json` adresine git.

4. **Yayınlama:** Base uygulamasında app URL’in ile bir post at.

---

## 2. Farcaster Frame Meta Tags

**Yapıldı:** Layout’a `fc:frame`, `fc:frame:image` ve Open Graph meta tag’leri eklendi.

Paylaşıldığında Warpcast’te link önizlemesi ve Frame olarak görünecek.

---

## 3. Neynar Sign in with Farcaster (Opsiyonel)

Neynar ile Farcaster girişi eklemek için:

### Gereksinimler

- Neynar hesabı (https://neynar.com)
- React 19 (Neynar SDK uyumluluğu için)

### Kurulum

```bash
npm i @neynar/react @neynar/nodejs-sdk
npm i @pigment-css/react@^0.0.30 hls.js@^1.5.20 react@^19.0.0 react-dom@^19.0.0 swr@^2.3.2
```

### Env

```
NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_client_id
NEYNAR_API_KEY=your_api_key
```

Neynar dashboard’da localhost ve production domain’ini authorized origins’e ekle.

### Kullanım

`MainProviders` veya `layout` içinde `NeynarContextProvider` ile sarmalayın:

```tsx
import { NeynarContextProvider, Theme } from "@neynar/react";
import "@neynar/react/dist/style.css";

<NeynarContextProvider
  settings={{
    clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
    defaultTheme: Theme.Dark,
  }}
>
  {children}
</NeynarContextProvider>
```

`NeynarAuthButton` ile giriş butonu ekleyebilirsin.

---

## Özet

| Özellik                         | Durum   | Not                               |
|---------------------------------|---------|------------------------------------|
| Base manifest `/.well-known/farcaster.json` | Hazır   | Env’leri doldur + account association |
| Farcaster Frame meta tags       | Hazır   | OG + fc:frame                      |
| Dinamik OG görselleri           | Hazır   | `/og-image.png`, `/og-icon.png`   |
| Neynar Sign in                  | Opsiyonel | React 19 + Neynar SDK gerekli     |
