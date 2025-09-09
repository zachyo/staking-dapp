import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserDetails } from "@/hooks/useGetUserDetails";
import { formatUnits } from "viem";

export const WithdrawToken = ({ position } : {position : UserDetails}) => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const stakedAmount = formatUnits(position?.stakedAmount ?? 0n, 18)

  const handleWithdraw = () => {
    if (amount && parseFloat(amount) > 0) {
    //   onWithdraw(position.id, amount);
      setAmount("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!position?.canWithdraw}
          className="w-full !bg-white !border-black"
        >
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Tokens</DialogTitle>
          <DialogDescription>
            Enter the amount to withdraw from your stake of {stakedAmount}{" "}
            MST.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="withdraw-amount" className="text-right">
              Amount
            </Label>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="0.00"
              max={stakedAmount}
              className="col-span-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Maximum: {stakedAmount} MST
          </div>
        </div>
        <DialogFooter className="text-white">
          <Button
            onClick={handleWithdraw}
            disabled={!amount || parseFloat(amount) <= 0}            
          >
            Withdraw
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
