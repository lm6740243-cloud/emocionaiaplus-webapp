import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// USDC Contract Addresses (Testnet)
const USDC_ADDRESSES = {
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia
  80001: '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97', // Mumbai
} as const;

const USDC_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const;

interface CryptoPaymentProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

export const CryptoPayment = ({ amount, description, onSuccess }: CryptoPaymentProps) => {
  const { address, chain } = useAccount();
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handlePayment = async () => {
    if (!address || !chain) {
      toast({
        title: 'Wallet no conectada',
        description: 'Por favor conecta tu wallet primero',
        variant: 'destructive',
      });
      return;
    }

    const usdcAddress = USDC_ADDRESSES[chain.id as keyof typeof USDC_ADDRESSES];
    if (!usdcAddress) {
      toast({
        title: 'Red no soportada',
        description: 'Por favor cambia a Sepolia o Mumbai',
        variant: 'destructive',
      });
      return;
    }

    setIsPaying(true);

    try {
      // Recipient address (treasury)
      const recipientAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'; // Example

      writeContract({
        address: usdcAddress,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipientAddress, parseUnits(amount.toString(), 6)],
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Error en el pago',
        description: 'No se pudo procesar la transacción',
        variant: 'destructive',
      });
      setIsPaying(false);
    }
  };

  if (isSuccess && onSuccess) {
    onSuccess();
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          Pago con Crypto
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div>
            <p className="text-sm text-muted-foreground">Monto a pagar</p>
            <p className="text-2xl font-bold text-primary">${amount} USDC</p>
          </div>
          <Badge variant="outline">Testnet</Badge>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Importante:</strong> Estás usando una red de prueba. Necesitas USDC de testnet
            en tu wallet. Puedes obtenerlos gratis en faucets de Sepolia o Mumbai.
          </AlertDescription>
        </Alert>

        {isConfirming && (
          <Alert className="border-primary/50 bg-primary/10">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <AlertDescription>Confirmando transacción en blockchain...</AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>
              ¡Pago completado exitosamente! Tu sesión ha sido activada.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handlePayment}
          disabled={!address || isPaying || isConfirming || isSuccess}
          className="w-full bg-gradient-primary"
          size="lg"
        >
          {isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirmando...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Pago Completado
            </>
          ) : (
            <>
              <Coins className="mr-2 h-4 w-4" />
              Pagar con USDC
            </>
          )}
        </Button>

        {hash && (
          <p className="text-xs text-center text-muted-foreground">
            Hash de transacción:{' '}
            <code className="bg-muted px-2 py-1 rounded text-xs">{hash.slice(0, 10)}...</code>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
