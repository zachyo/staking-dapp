import AppLayout from "./layout";
import { ContractStats } from "./components/ContractStats";
import { UserPositionCard } from "./components/UserPosition";
import useTokenDetails from "./hooks/useGetTokenDetails";
import { Toaster } from "./components/ui/sonner";
import { StakingDashboard } from "./components/Dashboard/Dashboard";



function App() {
  

  const { tokenSymbol, userBal } = useTokenDetails();
  
  return (
    <AppLayout>
      <StakingDashboard/>
      <div className="container mx-auto px-4 py-8 hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">StakingDapp</h1>
          <p className="text-gray-600">
            Stake your {tokenSymbol} tokens and earn rewards
            {/* check update */}
          </p>
        </div>

        {/* Protocol Statistics */}
        <ContractStats />

        {/* User Summary */}
        {/* <UserSummaryCard userData={mockUserData} /> */}

        {/* User Positions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Staking Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UserPositionCard />
          </div>
        </div>
      </div>
      <Toaster />
    </AppLayout>
  );
}

export default App;
