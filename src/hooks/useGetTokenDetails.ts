import { useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { STAKE_TOKEN_ABI } from "../config/stake_token_abi";
import useStakeTokenStore, { useStakingStore } from "@/config/store";
import { formatUnits } from "viem";

const useTokenDetails = () => {
  const publicClient = usePublicClient();
  const setSymbol = useStakeTokenStore((state) => state.setTokenSymbol);
  const tokenSymbol = useStakeTokenStore((state) => state.tokenSymbol);
  const [userBal, setUserBal] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const { address } = useAccount();
  const { setAllowance: setContractAllowance, setUserBalance } =
    useStakingStore();

  const fetchBalanceOf = async () => {
    if (!publicClient || !address) {
      setUserBal(0);
      return;
    }

    const balResult = await publicClient.readContract({
      address: import.meta.env.VITE_STAKE_TOKEN,
      abi: STAKE_TOKEN_ABI,
      functionName: "balanceOf",
      args: [address],
    });

    setUserBal(Number(formatUnits(balResult, 18)));
    setUserBalance(Number(formatUnits(balResult, 18)));
  };

  const fetchAllowance = async () => {
    if (!publicClient || !address) return;

    const allowanceResult = await publicClient.readContract({
      address: import.meta.env.VITE_STAKE_TOKEN,
      abi: STAKE_TOKEN_ABI,
      functionName: "allowance",
      args: [address, import.meta.env.VITE_STAKING_CONTRACT],
    });

    setAllowance(Number(formatUnits(allowanceResult, 18)));
    setContractAllowance(Number(formatUnits(allowanceResult, 18)));
  };

  useEffect(() => {
    (async () => {
      const result = await publicClient?.readContract({
        address: import.meta.env.VITE_STAKE_TOKEN,
        abi: STAKE_TOKEN_ABI,
        functionName: "symbol",
      });

      setSymbol(result as string);
    })();
  }, [publicClient]);

  useEffect(() => {
    fetchBalanceOf();
  }, [publicClient, address]);

  useEffect(() => {
    fetchAllowance();
  }, [publicClient, address]);

  useEffect(() => {
    if (!publicClient || !address) return;

    const onApproval = (logs: any) => {
      const log = logs[0];
      if (log?.args && log.args.owner === address) {
        setAllowance(Number(formatUnits(log.args.value, 18)));
        setContractAllowance(Number(formatUnits(log.args.value, 18)));
      }
    };

    const onTransfer = (logs: any) => {
      logs.forEach((log: any) => {
        if (log?.args) {
          // If user is sender or receiver, refetch balance and allowance
          if (log.args.from === address || log.args.to === address) {
            // Refetch balance
            fetchBalanceOf();

            // Refetch allowance
            fetchAllowance();
          }
        }
      });
    };

    // Watch Approval events
    const approvalEventAbi = STAKE_TOKEN_ABI.find(
      (x) => x.type === "event" && x.name === "Approval"
    );

    // Watch Transfer events
    const transferEventAbi = STAKE_TOKEN_ABI.find(
      (x) => x.type === "event" && x.name === "Transfer"
    );

    const unwatchApproval = approvalEventAbi
      ? publicClient.watchEvent({
          address: import.meta.env.VITE_STAKE_TOKEN, // Watch token contract, not staking contract
          event: approvalEventAbi,
          args: {
            owner: address,
            spender: import.meta.env.VITE_STAKING_CONTRACT,
          },
          onLogs: onApproval,
        })
      : () => {};

    const unwatchTransfer = transferEventAbi
      ? publicClient.watchEvent({
          address: import.meta.env.VITE_STAKE_TOKEN,
          event: transferEventAbi,
          onLogs: onTransfer,
        })
      : () => {};

    return () => {
      unwatchApproval();
      unwatchTransfer();
    };
  }, [publicClient, address]);

  return useMemo(
    () => ({ tokenSymbol, userBal, allowance }),
    [tokenSymbol, userBal, allowance]
  );
};

export default useTokenDetails;
