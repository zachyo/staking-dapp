import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock } from "lucide-react";
import { useStakingStore } from "@/config/store";
import { calculateProgress, getTimeRemaining } from "@/lib/utils";
import { formatUnits } from "viem";
import { WithdrawToken } from "../WithdrawToken/WithdrawToken";
import { fromUnixTime, format } from "date-fns";
import { EmergencyWithdrawToken } from "../WithdrawToken/EmergencyWithdrawToken";

export const PositionsCard = () => {
  const { user, protocol } = useStakingStore();

  const convertUnixToReadableDate = (unixTimestamp: number): string => {
    const date = fromUnixTime(unixTimestamp);
    return format(date, "EEEE, MMMM do, yyyy h:mm:ss a");
  };


  const isUnlocked = user?.canWithdraw;
  const timeRemaining = Number(user?.timeUntilUnlock) === 0 ? "Unlocked" : getTimeRemaining(Number(user?.timeUntilUnlock));
  const progress = calculateProgress(
    BigInt(protocol?.minlockDuration as number),
    user?.timeUntilUnlock as bigint
  );

  if (!user?.stakedAmount) {
    return (
      <Card className="bg-gradient-glass border-border/50 backdrop-blur-sm shadow-large">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-primary" />
            Your Position
          </CardTitle>
          <CardDescription>
            View and manage your staking position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No active position</p>
            <p>Start staking to see your position here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-glass border-border/50 backdrop-blur-sm shadow-large">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-6 w-6 text-primary" />
          Your Position
        </CardTitle>
        <CardDescription>
          {/* {user.stakes.length} active position{user.stakes.length === 1 ? '' : 's'} */}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-card rounded-lg p-4 border border-border/50 space-y-4">
          {/* Position Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isUnlocked ? (
                <Unlock className="h-5 w-5 text-success" />
              ) : (
                <Lock className="h-5 w-5 text-primary" />
              )}
              <div>
                <div className="font-semibold text-lg">
                  {Number(formatUnits(user.stakedAmount, 18)).toLocaleString()}{" "}
                  tokens
                </div>
                <div className="text-sm text-muted-foreground">
                  Staked on{" "}
                  {convertUnixToReadableDate(Number(user.lastStakeTimestamp))}
                </div>
              </div>
            </div>

            <Badge
              variant={isUnlocked ? "default" : "secondary"}
              className={isUnlocked ? "bg-success text-success-foreground" : ""}
            >
              {timeRemaining}
            </Badge>
          </div>

          {/* Progress Bar */}
          {
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unlock progress</span>
                <span className="text-muted-foreground">
                  {progress.toFixed(0)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          }

          {/* Rewards & Actions */}
          <div className="flex items-center justify-end pt-2">           
            <div className="flex gap-2">
              {isUnlocked ? (
                <WithdrawToken position={user} />
              ) : (
                <EmergencyWithdrawToken position={user}/>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
