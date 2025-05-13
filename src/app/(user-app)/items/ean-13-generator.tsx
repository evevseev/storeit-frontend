import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Wand2 } from "lucide-react";

const generateEan13 = () => {
  let code = "101";

  for (let i = 0; i < 9; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  return parseInt(code + checkDigit);
};

export default function Ean13Generator({
  onChange: onChange,
}: {
  onChange: (ean13: number) => void;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const ean13 = generateEan13();
            onChange(ean13);
          }}
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Генерация EAN-13</h4>
          <p className="text-sm text-muted-foreground">
            Генерация случайного EAN-13 кода. Начинается со статичного префикса
            "101", остальные цифры генерируются случайным образом.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
