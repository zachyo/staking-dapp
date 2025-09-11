import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { STAKE_TOKEN_ABI } from "../config/stake_token_abi";
import { STAKING_CONTRACT_ABI } from "../config/staking_contract_abi";
import useTokenDetails from "./useGetTokenDetails";

const useStakeToken = ({onSuccess}: {onSuccess: () => void}) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { userBal, allowance } = useTokenDetails();
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);

  const useApprove = useCallback(
    async (amount: string): Promise<void> => {
      if (!address) {
        toast.error("Not connected", {
          description: "Please connect your wallet",
        });
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Invalid amount", {
          description: "Please enter a valid amount to stake",
        });
        return;
      }

      try {
        if (!publicClient) return;
        setIsApproving(true);

        const amountInWei = Number(amount);

        if (userBal && amountInWei > userBal) {
          toast.error("Insufficient balance", {
            description: "You don't have enough tokens to stake this amount",
          });
          return;
        }

        if (!allowance || allowance < amountInWei) {
          toast.info("Approval required", {
            description: "Please approve tokens for staking first",
          });

          const approveHash = await writeContractAsync({
            address: import.meta.env.VITE_STAKE_TOKEN as `0x${string}`,
            abi: STAKE_TOKEN_ABI,
            functionName: "approve",
            args: [
              import.meta.env.VITE_STAKING_CONTRACT as `0x${string}`,
              parseUnits(amountInWei.toString(), 18),
            ],
          });

          const approveReceipt = await publicClient.waitForTransactionReceipt({
            hash: approveHash,
          });

          if (approveReceipt.status !== "success") {
            setIsApproving(false);
            toast.error("Approval failed", {
              description: "Token approval was not successful",
            });
            return;
          }

          setIsApproving(false);
          toast.success("Approval successful", {
            description: "Tokens approved, now proceeding to stake",
          });
        }
      } catch (error) {
        console.error("Approval error:", error);
        setIsApproving(false);
        toast.error("Approval failed", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      }
    },
    [address, publicClient, writeContractAsync, userBal, allowance]
  );

  const useStake = useCallback(
    async (amount: string): Promise<void> => {
      if (!address) {
        toast.error("Not connected", {
          description: "Please connect your wallet",
        });
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Invalid amount", {
          description: "Please enter a valid amount to stake",
        });
        return;
      }

      try {
        if (!publicClient) return;
        setIsStaking(true);

        const amountInWei = Number(amount);

        if (userBal && amountInWei > userBal) {
          toast.error("Insufficient balance", {
            description: "You don't have enough tokens to stake this amount",
          });
          return;
        }

        const stakeHash = await writeContractAsync({
          address: import.meta.env.VITE_STAKING_CONTRACT as `0x${string}`,
          abi: STAKING_CONTRACT_ABI,
          functionName: "stake",
          args: [parseUnits(amountInWei.toString(), 18)],
        });

        const stakeReceipt = await publicClient.waitForTransactionReceipt({
          hash: stakeHash,
        });

        if (stakeReceipt.status === "success") {
          toast.success("Staking successful", {
            description: `Successfully staked ${amount} tokens`,
          });
          onSuccess()
          setIsStaking(false);
        } else {
          toast.error("Staking failed", {
            description: "Transaction was not successful",
          });
          setIsStaking(false);
        }
      } catch (error) {
        console.error("Staking error:", error);
        setIsStaking(false);
        toast.error("Staking failed", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      }
    },
    [address, publicClient, writeContractAsync, userBal, allowance]
  );

  return { useApprove, useStake, isStaking, isApproving };
};

export default useStakeToken;
