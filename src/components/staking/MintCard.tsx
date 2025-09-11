import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Banknote } from "lucide-react";
import { Button } from "../ui/button";
import useMintTokens from "@/hooks/useMintTokens";

const MintCard = () => {
  const { mintTokens, isMinting } = useMintTokens();
  return (
    <Card className="bg-gradient-glass border-border/50 backdrop-blur-sm shadow-large">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" />
          Mint Test Tokens
        </CardTitle>
        <CardDescription>
          Get some test tokens to interact with dApp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled={isMinting} onClick={mintTokens}>
            {isMinting ? "Minting..." : "Mint tokens"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MintCard;
