# GMWorldV2 Deploy Talimatları

GMWorldV2 her GM/GN mesajında **0.000025 ETH** fee alır. Fee, contract'ı deploy eden cüzdana gider.

## 1. Deploy

```bash
cd contracts
forge build
forge create GMWorldV2.sol:GMWorldV2 --rpc-url https://mainnet.base.org --private-key YOUR_PRIVATE_KEY
```

Veya Foundry script ile:
```bash
PRIVATE_KEY=0x... forge script script/DeployGMWorldV2.s.sol:DeployGMWorldV2 --rpc-url https://mainnet.base.org --broadcast
```

## 2. Frontend'e adresi ekle

`.env.local` ve Vercel Environment Variables:
```
NEXT_PUBLIC_GMWORLD_ADDRESS=0xDEPLOY_EDILEN_ADRES
```

## 3. Redeploy

Frontend'i yeniden deploy et (veya push + Vercel auto-deploy).

---
**Not:** Deploy eden cüzdan = fee'lerin gideceği adres (owner).
