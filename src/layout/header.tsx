import { Coins } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Header = () => {
  return (
    <header className="w-full bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-medium">
              <Coins className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold ">
                RewardStake
              </h1>
              {/* <p className="text-xs text-muted-foreground">Web3 Staking Protocol</p> */}
            </div>
          </div>

          {/* Network Badge & Wallet */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="hidden items-center gap-2 py-1 px-3">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              Sepolia Testnet
            </Badge>
            
            <ConnectButton/>
          </div>
        </div>
      </div>
    </header>
  )
}