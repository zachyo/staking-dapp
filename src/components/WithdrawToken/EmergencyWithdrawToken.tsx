import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import type { UserDetails } from "@/hooks/useGetUserDetails";
import { formatUnits } from "viem";
import useGetStakingStats from "@/hooks/useGetStakingStats";
import useWithdraw from "@/hooks/useWithdrawToken";

export const EmergencyWithdrawToken = ({
  position,
}: {
  position: UserDetails;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const stakedAmount = formatUnits(position?.stakedAmount ?? 0n, 18);
  const { emergencyWithdrawPenalty } = useGetStakingStats()
  const penalty = Number(emergencyWithdrawPenalty)
  const { emergencyWithdraw, isConfirming} = useWithdraw({onSuccess: ()=> {}})

  const penaltyAmount = (
    (parseFloat(stakedAmount) * penalty) /
    100
  ).toFixed(2);
  const receiveAmount = (
    parseFloat(stakedAmount) - parseFloat(penaltyAmount)
  ).toFixed(2);

  const handleEmergencyWithdraw = () => {
    emergencyWithdraw();    
  };


  useEffect(()=>{
    if (!isConfirming) {
      setIsOpen(false);
    }
  }, [isConfirming])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Emergency
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Emergency Withdrawal
          </DialogTitle>
          <DialogDescription>
            This will withdraw your entire stake with a {penalty}% penalty.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Staked Amount:</span>
              <span>{stakedAmount} MST</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Penalty ({penalty}%):</span>
              <span>-{penaltyAmount} MST</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>You'll receive:</span>
              <span>{receiveAmount} MST</span>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ This action cannot be undone. You'll lose {penalty}% of your
              staked amount.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleEmergencyWithdraw} disabled={isConfirming}>
            {isConfirming ? "Confirming..." : "Confirm Emergency Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
