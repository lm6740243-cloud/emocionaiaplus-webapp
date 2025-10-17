# Smart Contracts - EmocionalIA+

## Descripción General

EmocionalIA+ utiliza smart contracts en Ethereum y Polygon para gestionar pagos descentralizados y emisión de NFTs de progreso. Por defecto, todos los contratos operan en **testnet** (Sepolia y Mumbai) para garantizar la seguridad del usuario.

## Contratos Implementados

### 1. Pagos con USDC (ERC-20)

**Propósito**: Permitir pagos de suscripciones y sesiones de terapia usando USDC.

**Direcciones de Contrato**:
- Sepolia (Testnet): `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- Mumbai (Testnet): `0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97`
- Ethereum Mainnet: TBD (requiere consentimiento explícito)
- Polygon Mainnet: TBD (requiere consentimiento explícito)

**ABI**:
```solidity
function transfer(address _to, uint256 _value) returns (bool)
```

**Seguridad**:
- ✅ Basado en OpenZeppelin ERC-20 estándar
- ✅ No hay funciones admin que puedan congelar fondos
- ✅ Auditable en blockchain
- ✅ Sin reentrancy attacks
- ✅ Sin overflow/underflow (Solidity 0.8+)

**Flujo de Pago**:
1. Usuario conecta wallet (MetaMask/WalletConnect)
2. Usuario aprueba cantidad de USDC
3. Smart contract ejecuta `transfer()` al treasury
4. Confirmación on-chain (15-30 segundos)
5. Backend confirma y activa servicio

**Reembolsos**:
Los reembolsos se procesan automáticamente mediante el contrato si:
- El servicio no se activa en 24 horas
- El usuario cancela dentro de la ventana de cancelación (7 días)

### 2. NFT Badges (ERC-721 Soulbound)

**Propósito**: Emitir certificados no transferibles de logros del usuario.

**Direcciones de Contrato**:
- Sepolia (Testnet): `0x1234567890123456789012345678901234567890` (ejemplo)
- Mumbai (Testnet): TBD
- Ethereum Mainnet: TBD
- Polygon Mainnet: TBD

**Características Soulbound**:
```solidity
// No se puede transferir (soulbound)
function transferFrom(address from, address to, uint256 tokenId) public override {
    require(false, "Soulbound: transfer not allowed");
}

function safeTransferFrom(address from, address to, uint256 tokenId) public override {
    require(false, "Soulbound: transfer not allowed");
}
```

**Metadata (IPFS)**:
```json
{
  "name": "EmocionalIA+ Badge: [Type]",
  "description": "Awarded for completing [Achievement]",
  "image": "ipfs://QmXXXXXX/badge.png",
  "attributes": [
    {
      "trait_type": "Type",
      "value": "7_days_streak"
    },
    {
      "trait_type": "Earned Date",
      "value": "2025-01-15"
    },
    {
      "trait_type": "Level",
      "value": "Gold"
    }
  ],
  "soulbound": true
}
```

**Privacidad en IPFS**:
- Metadata privada cifrada con clave del usuario
- Solo el propietario del NFT puede acceder a detalles completos
- Público: nombre del logro, fecha de emisión
- Privado: notas terapéuticas, datos biométricos

**Flujo de Minteo**:
1. Usuario completa desafío/milestone
2. Sistema detecta logro elegible para NFT
3. Usuario elige mintear desde dashboard
4. Edge function llama smart contract
5. NFT se emite a wallet del usuario
6. Metadata se almacena en IPFS
7. Visible en OpenSea/Rarible

## Seguridad y Auditoría

### Medidas de Seguridad Implementadas

1. **No Reentrancy**:
```solidity
// Todos los contratos usan Checks-Effects-Interactions pattern
function withdraw() public {
    uint amount = balances[msg.sender];
    require(amount > 0, "No balance");
    balances[msg.sender] = 0; // State change BEFORE external call
    payable(msg.sender).transfer(amount);
}
```

2. **Access Control**:
```solidity
// Solo el owner puede mintear NFTs
modifier onlyMinter() {
    require(msg.sender == minterRole, "Not authorized");
    _;
}
```

3. **Rate Limiting**:
```solidity
// Previene spam de transacciones
mapping(address => uint256) public lastMintTime;
uint256 public constant MINT_COOLDOWN = 1 hours;

function mint() public {
    require(block.timestamp >= lastMintTime[msg.sender] + MINT_COOLDOWN, "Cooldown");
    lastMintTime[msg.sender] = block.timestamp;
    // ... mint logic
}
```

4. **Circuit Breaker**:
```solidity
// Permite pausar contratos en emergencia
bool public paused = false;

modifier whenNotPaused() {
    require(!paused, "Contract paused");
    _;
}
```

### Auditoría

**Estado**: ✅ Contratos basados en OpenZeppelin (auditados)

**Herramientas de Testing**:
- Hardhat para testing local
- Slither para análisis estático
- MythX para vulnerabilidades
- Tenderly para simulación

**Tests Cubiertos**:
- ✅ Transfer básico de USDC
- ✅ Reembolsos automáticos
- ✅ Minteo de NFT soulbound
- ✅ Protección contra reentrancy
- ✅ Access control
- ✅ Gas optimization

## Compliance y Regulación

### GDPR (Europa)
- ✅ Datos minimizados: solo wallet address público
- ✅ Derecho al olvido: metadata en IPFS es privada/cifrada
- ✅ Consentimiento explícito para transacciones mainnet
- ✅ Transparencia: toda lógica es on-chain verificable

### HIPAA (EE.UU.)
- ✅ No se almacenan datos de salud en blockchain
- ✅ NFTs no contienen información médica identificable
- ✅ Metadata sensible cifrada y off-chain

### Advertencias a Usuarios

Antes de cualquier transacción, se muestra:

```
⚠️ ADVERTENCIA DE RIESGOS
• Las transacciones blockchain son irreversibles
• Los precios de crypto son volátiles (USDC es stablecoin)
• Riesgo de hacks a wallets personales (usa hardware wallet)
• Fees de gas pueden variar (Layer 2 recomendado)
• Estás usando TESTNET - solo para pruebas
• NUNCA compartas tu frase semilla con nadie
• EmocionalIA+ NUNCA te pedirá claves privadas
```

## Optimización y Escalabilidad

### Layer 2 (Polygon)
- **Gas fees**: ~$0.01 vs $5-50 en Ethereum L1
- **Velocidad**: 2 segundos vs 15 segundos
- **Throughput**: 7000 TPS vs 15 TPS
- **Recomendación**: Usar Polygon para producción

### Batch Operations
Para reducir costos, agrupamos operaciones:
```solidity
function batchMint(address[] calldata recipients) external onlyMinter {
    for (uint i = 0; i < recipients.length; i++) {
        _mint(recipients[i], tokenIdCounter++);
    }
}
```

### Gas Optimization
- Uso de `calldata` en lugar de `memory` cuando es posible
- Variables packed en storage
- Events en lugar de storage para datos históricos
- Lazy minting para NFTs (solo mintea si usuario lo solicita)

## Deployment

### Testnet (Actual)
```bash
# Sepolia
npx hardhat deploy --network sepolia

# Mumbai
npx hardhat deploy --network mumbai
```

### Mainnet (Requiere Aprobación)
```bash
# Ethereum
npx hardhat deploy --network mainnet --confirm

# Polygon
npx hardhat deploy --network polygon --confirm
```

## Monitoreo y Analytics

**Métricas a trackear**:
- Volumen de transacciones USDC
- NFTs minteados por día
- Gas fees promedio
- Tasa de reembolsos
- Errores de transacción

**Herramientas**:
- Etherscan/Polygonscan para explorer
- The Graph para indexing
- Tenderly para alertas
- Dune Analytics para dashboards

## Roadmap

### Q1 2025
- ✅ Deploy en testnet (Sepolia/Mumbai)
- ✅ Integración con RainbowKit
- ✅ Sistema de pagos USDC
- ✅ NFTs soulbound básicos

### Q2 2025
- ⏳ Auditoría externa de contratos
- ⏳ Deploy en Polygon mainnet
- ⏳ Integración con más wallets
- ⏳ Marketplace de NFTs secundario (solo para viewing)

### Q3 2025
- ⏳ Soporte para DAI y ETH
- ⏳ NFTs dinámicos (metadata actualizable)
- ⏳ Governance token para comunidad

### Q4 2025
- ⏳ Bridge a Arbitrum/Optimism
- ⏳ Staking de tokens de governance
- ⏳ DAO para decisiones de comunidad

## Soporte

Para issues de smart contracts:
- GitHub: [repository]/issues
- Discord: #web3-support
- Email: web3@emocionaliaplus.com

**Reportar vulnerabilidades**: security@emocionaliaplus.com (recompensas hasta $10,000)
