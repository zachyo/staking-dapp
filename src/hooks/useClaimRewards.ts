import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { STAKING_CONTRACT_ABI } from "../config/staking_contract_abi";

const useClaimRewards = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [isClaiming, setIsClaiming] = useState(false);

  const claimRewards = useCallback(async (): Promise<void> => {
    if (!address || !publicClient) {
      toast.error("Not connected", {
        description: "Please connect your wallet",
      });
      return;
    }

    try {
      setIsClaiming(true);
      const claimHash = await writeContractAsync({
        address: import.meta.env.VITE_STAKING_CONTRACT as `0x${string}`,
        abi: STAKING_CONTRACT_ABI,
        functionName: "claimRewards",
        args: [],
      });

      console.log("Claim rewards txHash:", claimHash);

      const claimReceipt = await publicClient.waitForTransactionReceipt({
        hash: claimHash,
      });

      if (claimReceipt.status === "success") {
        toast.success("Rewards claimed successfully", {
          description: "Your rewards have been transferred to your wallet",
        });
        setIsClaiming(false);
      } else {
        toast.error("Claim failed", {
          description: "Transaction was not successful",
        });
        setIsClaiming(false);
      }
    } catch (error: any) {
      console.error("Claim rewards error:", error);
      setIsClaiming(false);

      if (error?.message?.includes("Pausable: paused")) {
        toast.error("Contract paused", {
          description: "Staking contract is currently paused",
        });
      } else {
        toast.error("Claim failed", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      }
    }
  }, [address, publicClient, writeContractAsync]);

  return {claimRewards, isClaiming}
};

export default useClaimRewards;
