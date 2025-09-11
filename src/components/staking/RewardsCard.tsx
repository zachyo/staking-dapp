import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Gift, TrendingUp, Clock } from "lucide-react";
import { useStakingStore } from "@/config/store";
import { formatUnits } from "viem";
import useClaimRewards from "@/hooks/useClaimRewards";

export const RewardsCard = () => {
  const { user, protocol } = useStakingStore();
  const { claimRewards, isClaiming } = useClaimRewards();

  const handleClaimAll = () => {
    claimRewards();
  };

  if (!user || !protocol) return null;

  const totalClaimable = Number(formatUnits(user.pendingRewards, 18)).toFixed(
    5
  );

  const dailyRewards = Number(
    formatUnits(
      BigInt(
        Math.floor((Number(user.stakedAmount) * Number(protocol.currentAPR)) / 100 / 365)
      ),
      18
    )
  ).toFixed(4);

  return (
    <Card className="bg-gradient-glass border-border/50 backdrop-blur-sm shadow-large">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Rewards Dashboard
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-success/10 text-success border-success/20"
          >
            Active
          </Badge>
        </div>
        <CardDescription className="text-base">
          Track and claim your staking rewards
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rewards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Claimable Now
            </div>
            <div className="text-2xl font-bold text-primary">
              {totalClaimable}
            </div>
            <div className="text-xs text-muted-foreground">Tokens</div>
          </div>

          {/* <div className="bg-card rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Total Earned
            </div>
            <div className="text-2xl font-bold">
              {totalEarned.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Tokens</div>
          </div> */}

          <div className="bg-card rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              Daily Rate
            </div>
            <div className="text-2xl font-bold text-success">
              {dailyRewards}
            </div>
            <div className="text-xs text-muted-foreground">Tokens/day</div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Current APR
            </div>
            <div className="text-2xl font-bold text-primary">
              {Number(protocol.currentAPR)}%
            </div>
            <div className="text-xs text-muted-foreground">Annual</div>
          </div>
        </div>

        <Separator />

        {/* Claim Actions */}
        <div className="space-y-4">
          {/* Individual Position Rewards */}
          <div className="space-y-3">
            <div className="bg-card rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium"></div>
                  <div className="text-sm text-muted-foreground">
                    Staked{" "}
                    {Math.floor(
                      (Date.now() - Number(user.lastStakeTimestamp)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days ago
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      {totalClaimable} tokens
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pending rewards
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary/5 border-primary/20 hover:bg-primary/10"
                    disabled={
                      isClaiming ||
                      Number(formatUnits(user.pendingRewards, 18)) === 0
                    }
                    onClick={handleClaimAll}
                  >
                    {isClaiming ? "Claiming tokens..." : "Claim"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {Number(totalClaimable) <= 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No rewards to claim yet</p>              
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
