import Navigation from "@/components/Navigation";
import { WalletConnect } from "@/components/web3/WalletConnect";
import { CryptoPayment } from "@/components/web3/CryptoPayment";
import { NFTBadges } from "@/components/web3/NFTBadges";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Coins, Award } from "lucide-react";

const Web3Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Web3 Dashboard
          </h1>
          <p className="text-muted-foreground">
            Conecta tu wallet, realiza pagos con crypto y colecciona NFTs de progreso
          </p>
        </div>

        <div className="mb-6">
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Seguridad y Privacidad Web3
              </CardTitle>
              <CardDescription>
                Tu seguridad es nuestra prioridad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ No almacenamos claves privadas ni frases semilla</p>
              <p>✓ Conexión temporal solo para firmar transacciones</p>
              <p>✓ Contratos auditados basados en OpenZeppelin</p>
              <p>✓ Testnet por defecto para tu protección</p>
              <p>✓ Cumplimiento con GDPR - datos minimizados</p>
              <p>✓ NFTs soulbound - no transferibles, solo tuyos</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallet">
              <Shield className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="payments">
              <Coins className="h-4 w-4 mr-2" />
              Pagos
            </TabsTrigger>
            <TabsTrigger value="nfts">
              <Award className="h-4 w-4 mr-2" />
              NFTs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <WalletConnect />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <CryptoPayment
              amount={7.99}
              description="Suscripción Premium Mensual"
              onSuccess={() => console.log("Payment successful")}
            />
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Cómo funcionan los pagos crypto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  1. <strong>Conecta tu wallet</strong> (MetaMask, WalletConnect, etc.)
                </p>
                <p>
                  2. <strong>Selecciona el servicio</strong> que deseas pagar
                </p>
                <p>
                  3. <strong>Confirma la transacción</strong> en tu wallet
                </p>
                <p>
                  4. <strong>Espera la confirmación</strong> on-chain (1-2 minutos)
                </p>
                <p>
                  5. <strong>¡Listo!</strong> Tu servicio se activa automáticamente
                </p>
                <p className="mt-4 text-xs">
                  <strong>Nota:</strong> Usamos USDC en testnet (Sepolia/Mumbai). Puedes obtener
                  USDC de prueba en faucets públicos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            <NFTBadges />
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Sobre los NFTs Soulbound</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Los <strong>NFTs soulbound</strong> son tokens no transferibles que representan
                  tus logros personales en EmocionalIA+.
                </p>
                <p>
                  <strong>Características:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Permanentes en blockchain</li>
                  <li>No se pueden vender ni transferir</li>
                  <li>Verificables públicamente</li>
                  <li>Metadata privada en IPFS</li>
                  <li>Compatible con OpenSea</li>
                </ul>
                <p className="mt-4">
                  Cada vez que completes un desafío significativo o alcances un hito importante,
                  podrás mintear un NFT que certifique tu progreso.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Web3Dashboard;
