import { useAccount, usePublicClient } from "wagmi";
import { STAKING_CONTRACT_ABI } from "../config/staking_contract_abi";
import { useEffect, useMemo, useState } from "react";

export interface UserDetails {
  stakedAmount: bigint;
  lastStakeTimestamp: bigint;
  pendingRewards: bigint;
  timeUntilUnlock: bigint;
  canWithdraw: boolean;
}

const useGetUserDetails = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient()
const [userDetails, setUserDetails] = useState<UserDetails>()

  useEffect(() => {
      if (!publicClient || !address) return;
  
      (async () => {
        const userDetailsResult = await publicClient.readContract({
          address: import.meta.env.VITE_STAKING_CONTRACT,
          abi: STAKING_CONTRACT_ABI,
          functionName: "getUserDetails",
          args: [address],
        });
  
        setUserDetails(userDetailsResult);
      })();
    }, [publicClient]);

  return useMemo(() => userDetails, [userDetails]);

};

export default useGetUserDetails;
