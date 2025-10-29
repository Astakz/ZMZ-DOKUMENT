
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/custom-toast';

interface SupportProjectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportProject: React.FC<SupportProjectProps> = ({
  open,
  onOpenChange,
}) => {
  const [copied, setCopied] = React.useState(false);
  const cardNumber = "5429 9973 8546 2188";

  const handleCopy = () => {
    navigator.clipboard.writeText(cardNumber);
    setCopied(true);
    toast.success("Номер карты скопирован");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Поддержка проекта</DialogTitle>
          <DialogDescription>
            Ваша поддержка поможет нам развивать сервис и делать его лучше
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <CreditCard className="h-16 w-16 text-primary" />
            <p className="text-lg font-medium">{cardNumber}</p>
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Скопировано" : "Скопировать номер карты"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <div className="w-full text-center">
            <p className="font-medium text-primary">Спасибо за поддержку проекта!</p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupportProject;
