import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Clock, DollarSign } from "lucide-react";
import { type ProtocolStats } from "@/config/store";
import useStakeToken from "@/hooks/useStakeToken";
import useTokenDetails from "@/hooks/useGetTokenDetails";
import type { UserDetails } from "@/hooks/useGetUserDetails";
import { getTimeRemaining } from "@/lib/utils";

type StakingProps = {
  user: UserDetails | null;
  protocol: ProtocolStats | null;
  userBalance: number;
}

export const StakingCard = ({user, protocol, userBalance}:StakingProps) => {
  const [stakeAmount, setStakeAmount] = useState("");
  const { allowance} = useTokenDetails()
  const { useApprove, useStake, isApproving, isStaking } = useStakeToken({
    onSuccess: () => {
      setStakeAmount("");
    },
  });

  const handleMaxClick = () => {
    if (userBalance > 0) {
      setStakeAmount(userBalance.toString());
    }
  };

  const handleStake = () => {        
    if (Number(stakeAmount) > allowance) {
      useApprove(stakeAmount);
    } else {
      useStake(stakeAmount);
    }
  };

  if (!protocol || !user) return null;

  return (
    <Card className="bg-gradient-glass border-border backdrop-blur-sm shadow-large">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Stake Tokens
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-success/10 text-success border-success/20"
          >
            {Number(protocol?.currentAPR ?? 0n)}% APR
          </Badge>
        </div>
        <CardDescription className="text-base">
          Stake your tokens to earn rewards with our dynamic APR system
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Staking Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Current APR
            </div>
            <div className="text-2xl font-bold text-primary">
              {Number(protocol.currentAPR??0n)}%
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              Lock Period
            </div>
            <div className="text-2xl font-bold">{getTimeRemaining(Number(protocol?.minlockDuration))
            }</div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Total Staked
            </div>
            <div className="text-2xl font-bold">
              {Number(protocol.totalStaked??"0").toLocaleString()} MST
            </div>
          </div>
        </div>

        <Separator />

        {/* Staking Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Amount to Stake</label>
              <span className="text-sm text-muted-foreground">
                Balance: {Number(userBalance).toLocaleString()} tokens
              </span>
            </div>

            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="pr-20 text-lg font-medium"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark"
              >
                MAX
              </Button>
            </div>
          </div>

          {/* Reward Preview */}
          {stakeAmount && Number(stakeAmount) > 0 && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="text-sm text-muted-foreground mb-2">
                Estimated rewards:
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Daily rewards:</span>
                  <span className="font-medium text-primary">
                    {(
                      (Number(stakeAmount) * Number(protocol.currentAPR)) /
                      100 /
                      365
                    ).toFixed(4)}{" "}
                    tokens
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly rewards:</span>
                  <span className="font-medium text-primary">
                    {(
                      (Number(stakeAmount) * Number(protocol.currentAPR)) /
                      100 /
                      12
                    ).toFixed(2)}{" "}
                    tokens
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleStake}
            disabled={
              !stakeAmount ||
              Number(stakeAmount) <= 0 ||
              Number(stakeAmount) > Number(userBalance) ||
              isApproving ||
              isStaking
            }
            className="w-full bg-primary hover:opacity-90 text-primary-foreground font-medium py-3 text-lg"
            size="lg"
          >
            {Number(stakeAmount) > Number(allowance) && Number(stakeAmount) > 0
              ? isApproving
                ? "Approving"
                : "Approve"
              : isStaking
              ? "Staking"
              : "Stake"}{" "}
            Tokens
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
