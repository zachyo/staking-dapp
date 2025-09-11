import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { STAKING_CONTRACT_ABI } from "../config/staking_contract_abi";
import { formatUnits } from "viem";
import { useStakingStore, type ProtocolStats } from "@/config/store";

const useGetStakingStats = () => {
  const publicClient = usePublicClient();
  const [totalStaked, setTotalStaked] = useState("0");
  const [currentAPR, setCurrentAPR] = useState(0n);
  const [emergencyWithdrawPenalty, setEmergencyWithdrawPenalty] = useState(0n);
  const { setProtocol, protocol } = useStakingStore();

  useEffect(() => {
    (async () => {
      if (!publicClient) return;

      const result = await publicClient?.readContract({
        address: import.meta.env.VITE_STAKING_CONTRACT,
        abi: STAKING_CONTRACT_ABI,
        functionName: "totalStaked",
      });

      const aprResult = await publicClient?.readContract({
        address: import.meta.env.VITE_STAKING_CONTRACT,
        abi: STAKING_CONTRACT_ABI,
        functionName: "currentRewardRate",
      });

      const emergencyWithdrawPenaltyResult = await publicClient?.readContract({
        address: import.meta.env.VITE_STAKING_CONTRACT,
        abi: STAKING_CONTRACT_ABI,
        functionName: "emergencyWithdrawPenalty",
      });

      const minLockDurationResult = await publicClient?.readContract({
        address: import.meta.env.VITE_STAKING_CONTRACT,
        abi: STAKING_CONTRACT_ABI,
        functionName: "minLockDuration",
      });

      setProtocol({
        totalStaked: formatUnits(result, 18),
        currentAPR: aprResult as bigint,
        emergencyWithdrawPenalty: emergencyWithdrawPenaltyResult as bigint,
        minlockDuration: Number(minLockDurationResult),
      });

      setTotalStaked(formatUnits(result, 18));
      setCurrentAPR(aprResult as bigint);
      setEmergencyWithdrawPenalty(emergencyWithdrawPenaltyResult as bigint);
    })();
  }, [publicClient]);

  useEffect(() => {
    if (!publicClient) return;

    const onStaked = (logs: any) => {
      const log = logs[0];
      if (log?.args) {
        setTotalStaked(formatUnits(log.args.newTotalStaked, 18));
        setProtocol({
          ...(protocol as ProtocolStats),
          totalStaked: formatUnits(log.args.newTotalStaked, 18),
        });
      }
    };

    const stakedEventAbiItem = STAKING_CONTRACT_ABI.find(
      // @ts-ignore
      (x) => x.name === "Staked" && x.type === "event"
    );
    const emergencyWithdrawnEventAbiItem = STAKING_CONTRACT_ABI.find(
      // @ts-ignore
      (x) => x.name === "EmergencyWithdrawn" && x.type === "event"
    );

    const withdrawnEventAbiItem = STAKING_CONTRACT_ABI.find(
      // @ts-ignore
      (x) => x.name === "Withdrawn" && x.type === "event"
    );

    const unwatch = publicClient.watchEvent({
      address: import.meta.env.VITE_STAKING_CONTRACT,
      event: stakedEventAbiItem,
      onLogs: onStaked,
    });
    const unwatchEmergencyWithdrawn = publicClient.watchEvent({
      address: import.meta.env.VITE_STAKING_CONTRACT,
      event: emergencyWithdrawnEventAbiItem,
      onLogs: onStaked,
    });
    const unwatchWithdrawn = publicClient.watchEvent({
      address: import.meta.env.VITE_STAKING_CONTRACT,
      event: withdrawnEventAbiItem,
      onLogs: onStaked,
    });
    return () => {
      unwatch();
      unwatchEmergencyWithdrawn();
      unwatchWithdrawn()
    };
  }, [publicClient]);

  return useMemo(
    () => ({ totalStaked, currentAPR, emergencyWithdrawPenalty }),
    [totalStaked, currentAPR, emergencyWithdrawPenalty]
  );
};

export default useGetStakingStats;
