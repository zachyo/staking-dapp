import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { STAKING_CONTRACT_ABI } from "../config/staking_contract_abi";
import { getUserFriendlyError } from "@/lib/utils";

const useWithdraw = ({ onSuccess }: { onSuccess: () => void }) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [isConfirming, setIsConfirming] = useState(false);

  const withdrawCallback = useCallback(
    async (amount: string): Promise<void> => {
      if (!address || !publicClient) {
        toast.error("Not connected", {
          description: "Please connect your wallet",
        });
        return;
      }

      try {
        const amountInWei = parseUnits(amount, 18);
        setIsConfirming(true);

        const withdrawHash = await writeContractAsync({
          address: import.meta.env.VITE_STAKING_CONTRACT as `0x${string}`,
          abi: STAKING_CONTRACT_ABI,
          functionName: "withdraw",
          args: [amountInWei],
        });

        const withdrawReceipt = await publicClient.waitForTransactionReceipt({
          hash: withdrawHash,
        });

        if (withdrawReceipt.status === "success") {
          toast.success("Withdrawal successful", {
            description: `Successfully withdrew ${amount} tokens`,
          });
          setIsConfirming(false);
          onSuccess();
        } else {
          toast.error("Withdrawal failed", {
            description: "Transaction was not successful",
          });
          setIsConfirming(false);
        }
      } catch (error: any) {
        console.error("Withdraw error:", error);

        toast.error("Withdrawal failed", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
        setIsConfirming(false);
      }
    },
    [address, publicClient, writeContractAsync]
  );

  const emergencyWithdrawCallback = useCallback(async (): Promise<void> => {
    if (!address || !publicClient) {
      toast.error("Not connected", {
        description: "Please connect your wallet",
      });
      return;
    }

    try {
      setIsConfirming(true);

      const withdrawHash = await writeContractAsync({
        address: import.meta.env.VITE_STAKING_CONTRACT as `0x${string}`,
        abi: STAKING_CONTRACT_ABI,
        functionName: "emergencyWithdraw",
      });

      const withdrawReceipt = await publicClient.waitForTransactionReceipt({
        hash: withdrawHash,
      });

      if (withdrawReceipt.status === "success") {
        toast.success("Emergency Withdrawal successful", {
          description: `Successfully withdrew all tokens`,
        });
        setIsConfirming(false);
      } else {
        toast.error("Emergency Withdrawal failed", {
          description: "Transaction was not successful",
        });
        setIsConfirming(false);
      }
    } catch (error: any) {
      console.error("Emergency Withdraw error:", error);

      toast.error("Emergency Withdrawal failed", {
        description: getUserFriendlyError(error),
      });
      setIsConfirming(false);
    }
  }, [address, publicClient, writeContractAsync]);

  

  return {
    withdraw: withdrawCallback,
    isConfirming,
    emergencyWithdraw: emergencyWithdrawCallback,
  };
};

export default useWithdraw;
