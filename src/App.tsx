import AppLayout from "./layout";
import { ContractStats } from "./components/ContractStats";
import { UserSummaryCard } from "./components/UserSummary";
import { UserPositionCard } from "./components/UserPosition";
import { Card, CardContent } from "./components/ui/card";
import { Coins } from "lucide-react";
import useTokenDetails from "./hooks/useGetTokenDetails";
import { Toaster } from "./components/ui/sonner";

const mockUserData = {
  totalStaked: "1,500.00",
  pendingRewards: "45.75",
  positions: [
    {
      id: 1,
      amount: "1000.00",
      stakedAt: "2024-01-15",
      timeUntilUnlock: 86400, // seconds
      canWithdraw: false,
      pendingRewards: "30.25",
    },
    {
      id: 2,
      amount: "500.00",
      stakedAt: "2024-01-10",
      timeUntilUnlock: 0,
      canWithdraw: true,
      pendingRewards: "15.50",
    },
  ],
};

function App() {
  const handleWithdraw = (positionId: number, amount: number) => {
    console.log("Withdrawing:", amount, "from position:", positionId);
    // Implement contract call
  };

  const handleClaimRewards = (positionId: number) => {
    console.log("Claiming rewards for position:", positionId);
    // Implement contract call
  };

  const handleEmergencyWithdraw = (positionId: number) => {
    console.log("Emergency withdraw for position:", positionId);
    // Implement contract call
  };

  const { tokenSymbol, userBal } = useTokenDetails();
  console.log({ userBal });
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Staking Protocol</h1>
          <p className="text-gray-600">
            Stake your {tokenSymbol} tokens and earn rewards
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
