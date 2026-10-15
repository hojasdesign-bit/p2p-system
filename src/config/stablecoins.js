// Monedas y redes del MVP. Para añadir una stablecoin, agrega una entrada
// aquí con su dirección por chain. Nada de esto mueve dinero real: el
// escrow on-chain es paso 2 (ver README).

export const CHAINS = [
  { id: 84532, name: 'Base Sepolia', short: 'Base Sepolia', testnet: true },
  { id: 8453, name: 'Base', short: 'Base', testnet: false },
]

export const DEFAULT_CHAIN_ID = 84532

export const STABLECOINS = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    addresses: { 84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', 8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    addresses: { 84532: '', 8453: '' },
  },
]

export const FIATS = ['CUP', 'EUR', 'USD', 'MLC']

// Cada oferta usa UN único método de pago. Los filtros de moneda y método
// van separados en la UI, pero la oferta los trae unificados.
export const PAYMENT_METHODS = [
  'Transferencia Bancaria',
  'Efectivo',
  'Zelle',
  'PayPal',
]

export const CHAINS_BY_ID = Object.fromEntries(CHAINS.map((c) => [c.id, c]))
export const STABLECOIN_BY_SYMBOL = Object.fromEntries(STABLECOINS.map((s) => [s.symbol, s]))

export function formatMoney(value, currency) {
  const n = Number(value)
  if (!Number.isFinite(n)) return `0 ${currency}`
  return `${n.toLocaleString('es-ES', { maximumFractionDigits: 2 })} ${currency}`
}

export function shortAddress(addr) {
  if (!addr || addr.length < 10) return addr || '—'
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
