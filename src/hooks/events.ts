// import { usePublicClient } from "wagmi";
// import { STAKING_CONTRACT_ABI } from "../config/staking_contract_abi";


// const publicClient = usePublicClient()

// const stakedEventAbiItem = STAKING_CONTRACT_ABI.find(
//   // @ts-ignore
//   (x) => x.name === "Staked" && x.type === "event"
// );

// const unwatchStaked = () => {
//   publicClient?.watchEvent({
//     address: import.meta.env.VITE_STAKING_CONTRACT,
//     event: stakedEventAbiItem,
//     onLogs: onUserEvent,
//   });
// };

// const onUserEvent = (logs:any) => {
//       const log = logs[0];
//       if (log?.args?.user === address) {
//         fetchUserDetails();
//       }
//     };