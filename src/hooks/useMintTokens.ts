import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { STAKE_TOKEN_ABI } from "@/config/stake_token_abi";
import { getUserFriendlyError } from "@/lib/utils";

const useMintTokens = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [isMinting, setIsMinting] = useState(false);

  const mintTokens = useCallback(async (): Promise<void> => {
    if (!address || !publicClient) {
      toast.error("Not connected", {
        description: "Please connect your wallet",
      });
      return;
    }

    try {
      setIsMinting(true);
      const mintHash = await writeContractAsync({
        address: import.meta.env.VITE_STAKE_TOKEN as `0x${string}`,
        abi: STAKE_TOKEN_ABI,
        functionName: "mint",
        args: [100000000000000000000n],
      });

      const mintReceipt = await publicClient.waitForTransactionReceipt({
        hash: mintHash,
      });

      if (mintReceipt.status === "success") {
        toast.success("Tokens minted successfully", {
          description: "Test tokens have been transferred to your wallet",
        });
        setIsMinting(false);
      } else {
        toast.error("Token mint failed", {
          description: "Transaction was not successful",
        });
        setIsMinting(false);
      }
    } catch (error: any) {
      console.error("Token mint error:", error?.message);
      setIsMinting(false);
      toast.error("Claim failed", {
        description: getUserFriendlyError(error),
      });
    }
  }, [address, publicClient, writeContractAsync]);

  return { mintTokens, isMinting };
};

export default useMintTokens;
