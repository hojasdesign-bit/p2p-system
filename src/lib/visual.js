// Ayudas visuales del lenguaje original: avatares con iniciales, colores de red y pares de monedas.
// No cambian datos ni lógica: solo presentación.

export const AVATAR_COLORS = ['#F59E0B', '#14B8A6', '#84CC16', '#EF4444', '#EAB308', '#EC4899', '#3B82F6', '#8B5CF6', '#22C55E', '#F97316']

export function initials(name) {
  const parts = String(name || 'U').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function avatarColor(name) {
  const s = String(name || 'U')
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export const CHAIN_COLORS = {
  'Base Sepolia': '#0052FF',
  'Base': '#0052FF',
  'Arbitrum': '#2D9CDB',
  'BNB Chain': '#F0B90B',
  'BSC': '#F0B90B',
  'Polygon': '#8247E5',
  'Solana': '#14F195',
  'Tron': '#FF060A',
  'TRC20': '#FF060A',
  'Ethereum': '#627EEA',
  'ERC20': '#627EEA',
  'TON': '#0098EA',
  'Stellar': '#7D00FF',
}

export function chainColor(chainName) {
  return CHAIN_COLORS[chainName] || '#8A857C'
}

// Moneda fíat: círculo con símbolo. Crypto: círculo con símbolo.
export const FIAT_COIN = {
  CUP: { bg: '#EAB308', symbol: '$' },
  EUR: { bg: '#64748B', symbol: '€' },
  USD: { bg: '#22C55E', symbol: '$' },
  MLC: { bg: '#14B8A6', symbol: '$' },
}

export const CRYPTO_COIN = {
  USDC: { bg: '#2775CA', symbol: '$' },
  USDT: { bg: '#26A17B', symbol: '₮' },
}

export function fiatCoin(fiat) {
  return FIAT_COIN[fiat] || { bg: '#8A857C', symbol: fiat?.slice(0, 1) || '¤' }
}

export function cryptoCoin(crypto) {
  return CRYPTO_COIN[crypto] || { bg: '#111', symbol: crypto?.slice(0, 1) || '¤' }
}
