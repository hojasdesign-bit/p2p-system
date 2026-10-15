# peetoo — P2P de stablecoins (MVP)

Compra y vende USDC y USDT persona a persona. Sin home: la raíz redirige a `/p2p`.
En español, móvil primero, sin KYC.

## Qué incluye el MVP

- **Mercado** (`/p2p`): tabs Comprar / Vender desde la perspectiva del que toma
  la oferta. Filtros separados: crypto, fíat, método de pago, monto, anunciante.
  Cada oferta es unificada: **1 crypto + 1 fíat + 1 único método de pago + 1 red**
  + precio + disponible + mínimo + máximo.
- **Crear oferta** (`/crear-oferta`): lado, crypto, fíat, método único, red,
  precio, disponible, min/max. Validaciones min ≤ max ≤ disponible.
- **Mis ofertas** (`/mis-ofertas`): pausar / reanudar / cancelar / editar precio y disponible.
- **Órdenes** (`/ordenes`, `/orden/:id`): flujo creada → marcar pagado
  (con comprobante) → confirmar recepción → completada, más cancelar y disputar.
- **Perfiles** (`/perfil/:id`, `/mi-perfil`): público + editable en modo demo.
- **Login OpenFort**: Google (social), email OTP y wallet propia. Wallet embebida
  en Base Sepolia (84532) por defecto.
- **Sin dinero real**: el escrow es **simulado** (estados en la app). No hay
  contrato on-chain ni movimiento de fondos en el MVP. El escrow on-chain es paso 2.

## Variables de entorno

Nunca incluyas claves reales en el repo. Copia `.env.example` a `.env`:

```
VITE_OPENFORT_PUBLISHABLE_KEY=pk_test_...
VITE_SHIELD_PUBLISHABLE_KEY=...
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

- Sin `VITE_OPENFORT_*`: la app entra en **modo demo** (banner visible +
  login simulado en localStorage: Google / email OTP / wallet propia).
- Sin `VITE_SUPABASE_*`: usa ofertas seed + localStorage.
- La publishable key de OpenFort y la Shield publishable key son públicas
  (van en el frontend). La **secret key nunca** va en el repo ni en `VITE_*`.

## Supabase

1. Crea un proyecto en Supabase.
2. En SQL Editor, ejecuta `supabase/migration.sql` (crea `profiles`, `offers`,
   `orders` + RLS).
3. Copia URL y anon key a `.env`.

> RLS del MVP es permisiva (lectura pública, escritura libre). **Endurecer
> antes de producción** con `auth.uid()` y roles.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera dist/
npm run preview
```

## Despliegue en Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Variables de entorno en el dashboard de Pages: las 4 `VITE_*` de arriba.
- El archivo `public/_redirects` (`/* /index.html 200`) hace el fallback SPA.
- Alternativa por Git: conecta el repo `p2p-system` a Pages; cada push despliega.

## Añadir una stablecoin

Edita `src/config/stablecoins.js`: agrega símbolo, nombre, decimales y
direcciones por chain. El resto de la app (filtros, formularios, ofertas)
la toma de ahí.

## Paso 2 (fuera del MVP)

Escrow on-chain (contrato + paymaster), chat de orden, mediación de disputas,
notificaciones, fíat-fíat, reputación con historial verificable y RLS estricto.
