import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { achievementId, walletAddress } = await req.json();

    if (!achievementId || !walletAddress) {
      throw new Error("Missing required parameters");
    }

    // Get achievement details
    const { data: achievement, error: achievementError } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("id", achievementId)
      .single();

    if (achievementError) throw achievementError;

    // In production, this would interact with a smart contract
    // For now, we'll simulate minting by updating metadata
    const tokenId = Math.floor(Math.random() * 1000000).toString();
    const ipfsMetadata = {
      name: `EmocionalIA+ Badge: ${achievement.achievement_type}`,
      description: `Awarded for completing ${achievement.achievement_type}`,
      image: `ipfs://QmExample/${achievement.achievement_type}.png`,
      attributes: [
        { trait_type: "Type", value: achievement.achievement_type },
        { trait_type: "Earned Date", value: achievement.earned_at },
        { trait_type: "Level", value: achievement.tier || "1" },
      ],
      soulbound: true,
    };

    // Update achievement with NFT metadata
    const { error: updateError } = await supabase
      .from("user_achievements")
      .update({
        metadata: {
          ...achievement.metadata,
          tokenId,
          contractAddress: "0x1234567890123456789012345678901234567890", // Example
          ipfsMetadata,
          mintedAt: new Date().toISOString(),
          walletAddress,
        },
      })
      .eq("id", achievementId);

    if (updateError) throw updateError;

    console.log(`NFT minted for achievement ${achievementId}, tokenId: ${tokenId}`);

    return new Response(
      JSON.stringify({
        success: true,
        tokenId,
        contractAddress: "0x1234567890123456789012345678901234567890",
        ipfsMetadata,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error minting NFT:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
