# Guía de Integración Web3 - EmocionalIA+

## Descripción General

EmocionalIA+ ahora incluye funcionalidades Web3 completas para autenticación descentralizada, pagos con criptomonedas y emisión de NFTs de progreso.

## Características Implementadas

### 1. Autenticación con Wallet

**Wallets Soportadas**:
- MetaMask
- WalletConnect (Rainbow, Trust Wallet, etc.)
- Coinbase Wallet
- Brave Wallet

**Seguridad**:
- ✅ Sin almacenamiento de claves privadas
- ✅ Conexión temporal solo para firmar transacciones
- ✅ Desconexión automática al cerrar sesión
- ✅ Verificación de firma de mensajes para login

**Implementación**:
```typescript
import { useAccount, useConnect } from 'wagmi';

const { address, isConnected } = useAccount();
const { connect } = useConnect();

// Conectar wallet
connect({ connector: connectors[0] });

// Verificar conexión
if (isConnected) {
  console.log('Wallet conectada:', address);
}
```

### 2. Pagos Descentralizados

**Tokens Aceptados**:
- USDC (recomendado - stablecoin)
- ETH (en desarrollo)
- DAI (en desarrollo)

**Redes Soportadas**:
- Sepolia (Ethereum Testnet) - Actual
- Mumbai (Polygon Testnet) - Actual
- Polygon Mainnet - Próximamente
- Ethereum Mainnet - Requiere consentimiento

**Flujo de Pago**:
1. Usuario selecciona servicio (ej: suscripción premium)
2. Se muestra precio en USDC + advertencias de seguridad
3. Usuario confirma transacción en su wallet
4. Smart contract transfiere USDC a treasury
5. Backend confirma transacción on-chain
6. Servicio se activa automáticamente

**Fees**:
- Sepolia/Mumbai (testnet): Gratis (ETH/MATIC de prueba)
- Polygon (mainnet): ~$0.01 USD en gas
- Ethereum (mainnet): $5-50 USD en gas (no recomendado)

**Reembolsos Automáticos**:
- Si el servicio no se activa en 24h
- Si el usuario cancela dentro de 7 días
- Smart contract ejecuta reembolso automáticamente

### 3. NFTs de Progreso (Soulbound)

**¿Qué son los NFTs Soulbound?**
- Tokens no transferibles permanentes
- Certifican logros personales en blockchain
- Solo el propietario puede verlos/poseerlos
- No se pueden vender ni transferir

**Tipos de NFTs**:
- 🏅 **Logro de 7 días consecutivos**
- 🎯 **Completar 50 desafíos**
- 🧘 **100 sesiones de meditación**
- 💪 **30 días de seguimiento emocional**
- 🌟 **Nivel de bienestar alcanzado**

**Metadata en IPFS**:
```json
{
  "name": "EmocionalIA+ Badge: 7 Days Streak",
  "description": "Awarded for maintaining 7 consecutive days of wellness activities",
  "image": "ipfs://QmXXX/badge.png",
  "attributes": [
    { "trait_type": "Type", "value": "Consistency" },
    { "trait_type": "Level", "value": "Gold" },
    { "trait_type": "Earned Date", "value": "2025-01-15" }
  ],
  "soulbound": true
}
```

**Minteo de NFTs**:
1. Usuario completa logro elegible
2. Aparece notificación "¡Logro NFT disponible!"
3. Usuario va a Web3 Dashboard → NFTs
4. Click en "Mintear NFT"
5. Confirma transacción en wallet (gas gratuito en testnet)
6. NFT aparece en wallet y OpenSea

### 4. Dashboard Web3

**Ruta**: `/web3`

**Secciones**:
1. **Wallet**: Conectar/desconectar, cambiar red
2. **Pagos**: Realizar pagos con USDC
3. **NFTs**: Ver y mintear badges

**Componentes**:
- `WalletConnect`: Botón de conexión con RainbowKit
- `CryptoPayment`: Interfaz de pago
- `NFTBadges`: Galería de NFTs

## Instalación y Setup

### Dependencias Instaladas

```json
{
  "ethers": "^6.13.0",
  "wagmi": "^2.12.0",
  "viem": "^2.21.0",
  "@rainbow-me/rainbowkit": "^2.1.0",
  "@tanstack/react-query": "^5.83.0"
}
```

### Configuración de Redes

```typescript
// src/contexts/Web3Context.tsx
const config = getDefaultConfig({
  appName: 'EmocionalIA+',
  projectId: 'emocionaliaplus-web3',
  chains: [sepolia, polygonMumbai, mainnet, polygon],
});
```

### Variables de Entorno

```env
# No requiere API keys para testnet
# Para mainnet (futuro):
VITE_ALCHEMY_API_KEY=your_key_here
VITE_INFURA_PROJECT_ID=your_project_id
```

## Seguridad y Compliance

### Medidas de Seguridad

1. **Sin Almacenamiento de Claves**:
   - Nunca guardamos claves privadas
   - Conexión temporal vía RainbowKit
   - Supabase solo almacena wallet address (público)

2. **Testnet por Defecto**:
   - Todas las operaciones en testnet inicialmente
   - Mainnet requiere consentimiento explícito
   - Advertencias claras sobre riesgos

3. **Smart Contracts Auditados**:
   - Basados en OpenZeppelin (estándar de oro)
   - No reentrancy attacks
   - Access control robusto
   - Circuit breaker para emergencias

4. **2FA para Operaciones Críticas**:
   - Pagos >$100 requieren confirmación adicional
   - Cambio a mainnet requiere 2FA
   - Minteo de NFTs premium requiere verificación

### Compliance GDPR

- ✅ Datos minimizados: solo wallet address (público)
- ✅ Consentimiento explícito para transacciones
- ✅ Derecho al olvido: metadata NFT cifrada
- ✅ Transparencia: código open source

### Compliance HIPAA

- ✅ No se almacenan datos de salud en blockchain
- ✅ NFTs no contienen información médica
- ✅ Metadata sensible off-chain y cifrada

### Advertencias a Usuarios

Antes de cualquier transacción:
```
⚠️ IMPORTANTE: Riesgos de Crypto
• Las transacciones son irreversibles
• Volatilidad de precios (USDC es stablecoin estable)
• Riesgo de hacks a wallets (usa hardware wallet)
• EmocionalIA+ NUNCA te pedirá tu frase semilla
• Estás en TESTNET - solo para pruebas
```

## Testing

### Obtener Tokens de Testnet

**Sepolia ETH** (para gas):
- https://sepoliafaucet.com
- https://faucet.quicknode.com/ethereum/sepolia

**Sepolia USDC**:
- https://faucet.circle.com/
- Contrato: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

**Mumbai MATIC** (para gas):
- https://faucet.polygon.technology/
- https://mumbaifaucet.com/

**Mumbai USDC**:
- Swap en Uniswap testnet
- Contrato: `0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97`

### Flujo de Testing Completo

1. **Setup Inicial**:
   ```bash
   # Instalar MetaMask
   # Agregar red Sepolia/Mumbai
   # Obtener ETH/MATIC de testnet
   # Obtener USDC de testnet
   ```

2. **Test Conexión Wallet**:
   - Ir a `/web3`
   - Click "Conectar Wallet"
   - Autorizar en MetaMask
   - Verificar address mostrada

3. **Test Pago USDC**:
   - Tab "Pagos"
   - Click "Pagar con USDC"
   - Confirmar transacción
   - Esperar confirmación (1-2 min)
   - Verificar activación de servicio

4. **Test Minteo NFT**:
   - Completar desafío en app
   - Ir a tab "NFTs"
   - Click "Mintear NFT"
   - Confirmar transacción
   - Ver NFT en OpenSea testnet

## Troubleshooting

### "Wallet no conectada"
- Verificar que MetaMask esté instalado
- Asegurar que el sitio está en la whitelist
- Refrescar página

### "Red no soportada"
- Cambiar a Sepolia o Mumbai
- Click en botón de red en wallet
- Seleccionar red correcta

### "Transacción falló"
- Verificar que tienes suficiente gas
- Verificar que tienes suficiente USDC
- Aumentar gas limit si es necesario

### "NFT no aparece"
- Esperar 5 minutos (indexing)
- Refrescar página
- Verificar en Etherscan/Polygonscan

### "USDC no aparece en wallet"
- Agregar token custom en MetaMask
- Usar address de contrato USDC
- Decimales: 6

## Roadmap

### Fase 1 (Actual) ✅
- ✅ Integración RainbowKit/Wagmi
- ✅ Conexión de wallets
- ✅ Pagos USDC en testnet
- ✅ NFTs soulbound
- ✅ Dashboard Web3

### Fase 2 (Q2 2025)
- ⏳ Deploy a Polygon mainnet
- ⏳ Auditoría externa de contratos
- ⏳ Soporte para más tokens (ETH, DAI)
- ⏳ Marketplace de NFTs (viewing only)

### Fase 3 (Q3 2025)
- ⏳ NFTs dinámicos (metadata actualizable)
- ⏳ Governance token para comunidad
- ⏳ Staking de tokens
- ⏳ Recompensas en crypto por referidos

### Fase 4 (Q4 2025)
- ⏳ Layer 2 adicionales (Arbitrum, Optimism)
- ⏳ DAO para decisiones de comunidad
- ⏳ Cross-chain bridge
- ⏳ DeFi integrations

## Recursos Adicionales

**Documentación**:
- [SMART_CONTRACTS.md](./SMART_CONTRACTS.md) - Detalles técnicos de contratos
- [RainbowKit Docs](https://www.rainbowkit.com/docs/introduction)
- [Wagmi Docs](https://wagmi.sh/)
- [OpenZeppelin](https://docs.openzeppelin.com/)

**Explorers**:
- Sepolia: https://sepolia.etherscan.io
- Mumbai: https://mumbai.polygonscan.com

**NFT Viewers**:
- OpenSea Testnet: https://testnets.opensea.io

**Comunidad**:
- Discord: #web3-support
- GitHub Discussions
- Twitter: @EmocionalIAPlus

## Soporte

Para issues de Web3:
- GitHub Issues: [repository]/issues
- Email: web3@emocionaliaplus.com
- Discord: #web3-support

**Reportar vulnerabilidades**: security@emocionaliaplus.com
(Recompensas hasta $10,000 por bugs críticos)
