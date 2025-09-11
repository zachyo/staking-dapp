import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStakingStore } from '@/config/store'
import { StakingCard } from '../staking/StakingCard'
import { RewardsCard } from '../staking/RewardsCard'
import { PositionsCard } from '../staking/PositionsCard'
import MintCard from '../staking/MintCard'


export const StakingDashboard = () => {
  const { selectedTab, setSelectedTab, user, protocol, userBalance } = useStakingStore()  

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
        Staking Protocol
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stake your tokens and earn dynamic rewards with our innovative APR system. 
          Higher stakes unlock better returns.
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={(value : any) => setSelectedTab(value as 'stake' | 'rewards')}>
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/50 backdrop-blur-sm border border-primary">
          <TabsTrigger 
            value="stake" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Stake Tokens
          </TabsTrigger>        
          <TabsTrigger 
            value="rewards"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stake" className="space-y-6">
          <StakingCard user={user} protocol={protocol} userBalance={userBalance}/>
          <MintCard/>
        </TabsContent>
       

        <TabsContent value="rewards" className="space-y-6">
          <RewardsCard/>
          <PositionsCard/>
        </TabsContent>
      </Tabs>
    </div>
  )
}