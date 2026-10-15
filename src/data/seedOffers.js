// Ofertas de ejemplo. Se muestran cuando Supabase está vacío o sin keys.
// side: 'buy_crypto' = el maker COMPRA crypto (taker vende).
//       'sell_crypto' = el maker VENDE crypto (taker compra).
// Cada oferta: 1 crypto + 1 fiat + 1 único método + 1 red.

export const SEED_OFFERS = [
  { id: 'seed-1', owner_id: 'u1', owner_name: 'Usuario 1', owner_location: 'La Habana', owner_trades: 120, owner_score: 92, side: 'sell_crypto', crypto: 'USDC', fiat: 'CUP', payment_method: 'Transferencia Bancaria', chain: 84532, chain_name: 'Base Sepolia', price: 1.08, available: 500, min_amount: 10, max_amount: 100, status: 'active' },
  { id: 'seed-2', owner_id: 'u2', owner_name: 'Jorge Ramos', owner_location: 'La Habana', owner_trades: 233, owner_score: 84, side: 'sell_crypto', crypto: 'USDT', fiat: 'CUP', payment_method: 'Efectivo', chain: 84532, chain_name: 'Base Sepolia', price: 1.1, available: 600, min_amount: 20, max_amount: 200, status: 'active' },
  { id: 'seed-3', owner_id: 'u3', owner_name: 'Sofía Ramírez', owner_location: 'Santiago de Cuba', owner_trades: 98, owner_score: 96, side: 'sell_crypto', crypto: 'USDT', fiat: 'CUP', payment_method: 'Transferencia Bancaria', chain: 84532, chain_name: 'Base Sepolia', price: 1.15, available: 750, min_amount: 5, max_amount: 50, status: 'active' },
  { id: 'seed-4', owner_id: 'u4', owner_name: 'María Pérez', owner_location: 'La Habana', owner_trades: 175, owner_score: 89, side: 'sell_crypto', crypto: 'USDT', fiat: 'CUP', payment_method: 'Zelle', chain: 84532, chain_name: 'Base Sepolia', price: 1.12, available: 150, min_amount: 10, max_amount: 90, status: 'active' },
  { id: 'seed-5', owner_id: 'u1', owner_name: 'Usuario 1', owner_location: 'La Habana', owner_trades: 120, owner_score: 92, side: 'buy_crypto', crypto: 'USDC', fiat: 'CUP', payment_method: 'Transferencia Bancaria', chain: 84532, chain_name: 'Base Sepolia', price: 1.06, available: 200, min_amount: 5, max_amount: 80, status: 'active' },
  { id: 'seed-6', owner_id: 'u5', owner_name: 'Camila Prieto', owner_location: 'La Habana', owner_trades: 233, owner_score: 84, side: 'buy_crypto', crypto: 'USDC', fiat: 'USD', payment_method: 'Zelle', chain: 84532, chain_name: 'Base Sepolia', price: 1.0, available: 300, min_amount: 10, max_amount: 100, status: 'active' },
  { id: 'seed-7', owner_id: 'u6', owner_name: 'Ana Gómez', owner_location: 'Matanzas', owner_trades: 64, owner_score: 91, side: 'buy_crypto', crypto: 'USDT', fiat: 'EUR', payment_method: 'PayPal', chain: 84532, chain_name: 'Base Sepolia', price: 1.02, available: 400, min_amount: 10, max_amount: 120, status: 'active' },
  { id: 'seed-8', owner_id: 'u2', owner_name: 'Jorge Ramos', owner_location: 'La Habana', owner_trades: 233, owner_score: 84, side: 'sell_crypto', crypto: 'USDC', fiat: 'USD', payment_method: 'Efectivo', chain: 84532, chain_name: 'Base Sepolia', price: 1.01, available: 250, min_amount: 15, max_amount: 150, status: 'active' },
]
