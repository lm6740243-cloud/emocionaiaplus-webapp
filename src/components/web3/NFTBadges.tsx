import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NFTBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tokenId?: string;
  mintedAt?: string;
}

export const NFTBadges = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const [badges, setBadges] = useState<NFTBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState<string | null>(null);

  useEffect(() => {
    loadBadges();
  }, [address]);

  const loadBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Map achievements to NFT badges
      const nftBadges: NFTBadge[] = (data || []).map((achievement) => {
        const metadata = achievement.metadata as { tokenId?: string; mintedAt?: string } | null;
        return {
          id: achievement.id,
          name: achievement.achievement_key,
          description: `Logro obtenido: ${achievement.achievement_key}`,
          imageUrl: `/badges/${achievement.achievement_key}.png`,
          tokenId: metadata?.tokenId,
          mintedAt: metadata?.mintedAt,
        };
      });

      setBadges(nftBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async (badgeId: string) => {
    if (!address) {
      toast({
        title: 'Wallet no conectada',
        description: 'Conecta tu wallet para mintear NFTs',
        variant: 'destructive',
      });
      return;
    }

    setMinting(badgeId);

    try {
      // Call edge function to mint NFT
      const { data, error } = await supabase.functions.invoke('mint-nft-badge', {
        body: {
          achievementId: badgeId,
          walletAddress: address,
        },
      });

      if (error) throw error;

      toast({
        title: '¡NFT Minteado!',
        description: 'Tu badge ha sido convertido en un NFT soulbound',
      });

      loadBadges();
    } catch (error) {
      console.error('Minting error:', error);
      toast({
        title: 'Error al mintear',
        description: 'No se pudo crear el NFT. Intenta más tarde.',
        variant: 'destructive',
      });
    } finally {
      setMinting(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Badges NFT
        </CardTitle>
        <CardDescription>
          Convierte tus logros en NFTs soulbound permanentes en blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aún no tienes badges. ¡Completa desafíos para ganarlos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>

                  {badge.tokenId ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <Badge variant="outline" className="text-xs">
                        Token #{badge.tokenId}
                      </Badge>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a
                          href={`https://testnets.opensea.io/assets/sepolia/${badge.tokenId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Ver en OpenSea
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => mintNFT(badge.id)}
                      disabled={!address || minting === badge.id}
                      size="sm"
                      className="w-full bg-gradient-primary"
                    >
                      {minting === badge.id ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Minteando...
                        </>
                      ) : (
                        'Mintear NFT'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
