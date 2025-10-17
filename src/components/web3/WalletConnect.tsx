import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

export const WalletConnect = () => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Conexión Web3
        </CardTitle>
        <CardDescription>
          Conecta tu wallet para pagos descentralizados y NFTs de progreso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm">
            <strong>Advertencia de Seguridad:</strong> Solo conecta wallets que conozcas y confíes.
            EmocionalIA+ nunca te pedirá tu frase semilla o claves privadas. Por defecto, usamos
            redes de prueba (testnet) para tu seguridad.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg border">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div className="flex flex-col items-center gap-4 w-full">
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                          Conectar Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-semibold"
                        >
                          Red no soportada
                        </button>
                      );
                    }

                    return (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="flex gap-3">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                          >
                            {chain.hasIcon && (
                              <div className="inline-block mr-2">
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    className="w-4 h-4 inline"
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            {account.displayName}
                          </button>
                        </div>
                        {(chain.id === 11155111 || chain.id === 80001) && (
                          <span className="text-xs text-muted-foreground">
                            Red de prueba activa
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>

          <div className="text-xs text-muted-foreground text-center max-w-md">
            <p className="mb-2">
              Tu wallet se conecta temporalmente solo para firmar transacciones. No almacenamos
              claves privadas.
            </p>
            <p>
              <strong>Soportamos:</strong> MetaMask, WalletConnect, Coinbase Wallet, Rainbow
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
