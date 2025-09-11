import type { UserDetails } from '@/hooks/useGetUserDetails'
import { create } from 'zustand'

interface TokenState {
  tokenSymbol: string
  tokenName: string  
  setTokenSymbol: (sym : string) => void
}

interface StakingContractState {
  totalStaked : bigint
  setTotalStaked : (total : bigint) => void
}
export interface ProtocolStats {
  totalStaked: string
  currentAPR: bigint
  emergencyWithdrawPenalty : bigint
  minlockDuration: number
}

export interface StakingStore {
  // User data
  user: UserDetails | null
  userBalance: number
  allowance:number
  setAllowance: (allowance: number) => void
  setUserBalance: (balance: number) => void
  
  // Protocol data
  protocol: ProtocolStats | null
  
  // UI state
  isLoading: boolean
  selectedTab: 'stake' | 'rewards'
  isConnected: boolean
  
  // Actions
  setUser: (user: UserDetails) => void
  setProtocol: (protocol: ProtocolStats) => void
  setSelectedTab: (tab: 'stake' | 'rewards') => void
  setLoading: (loading: boolean) => void
  setConnected: (connected: boolean) => void
  reset: () => void
}

const useStakeTokenStore = create<TokenState>((set) => ({
  tokenSymbol: '',
  tokenName: 'MyStakeToken',
  setTokenSymbol: (sym : string) => set(() => ({ tokenSymbol: sym })),
}))

export const useStakingContractStore = create<StakingContractState>((set) => ({
  totalStaked : 0n,
  setTotalStaked : (total : bigint) => set(() => ({ totalStaked : total }))
}))

type tabType = 'stake' | 'rewards'
const initialState = {
  user: {} as UserDetails,
  userBalance : 0,
  allowance: 0,
  protocol: {} as ProtocolStats,
  isLoading: false,
  selectedTab: 'stake' as tabType,
  isConnected: false,
}

export const useStakingStore = create<StakingStore>((set) => ({
  // Initial state
  ...initialState,
  
  // Actions
  setUser: (user: UserDetails) => set({ user }),
  setUserBalance: (balance: number) => set({ userBalance: balance }),
  setAllowance: (allowance: number) => set({ allowance: allowance }),
  setProtocol: (protocol: ProtocolStats) => set({ protocol }),
  setSelectedTab: (tab: 'stake' | 'rewards') => set({ selectedTab: tab }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setConnected: (connected: boolean) => set({ isConnected: connected }),
  reset: () => set({userBalance: 0, allowance: 0, user: initialState.user}),
}))

export default useStakeTokenStore
