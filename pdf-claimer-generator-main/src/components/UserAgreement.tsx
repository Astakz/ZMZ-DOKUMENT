
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface UserAgreementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
}

const UserAgreement: React.FC<UserAgreementProps> = ({
  open,
  onOpenChange,
  onAccept,
  accepted,
  setAccepted,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Пайдаланушы келісімі</DialogTitle>
          <DialogDescription>
            Пожалуйста, ознакомьтесь с пользовательским соглашением перед использованием сервиса
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-4 text-left">
            <h3 className="font-medium text-lg">1. Жалпы ережелер</h3>
            <p>
              Осы пайдаланушы келісімі (бұдан әрі – «Келісім») қарсылықтарды генерациялау бойынша онлайн-сервисті (бұдан әрі – «Сервис») пайдалану тәртібін реттейді. Сервисті пайдалана отырып, сіз осы Келісімнің шарттарымен келісесіз.
            </p>

            <h3 className="font-medium text-lg">2. Деректерді өңдеу</h3>
            <p>2.1. Сервис пайдаланушы енгізген деректерді құжат генерациясы аяқталғаннан кейін сақтамайды және өңдемейді.</p>
            <p>2.2. Пайдаланушы жүктеген барлық ақпарат құжат жасалғаннан кейін автоматты түрде жойылады.</p>
            <p>2.3. Сервис деректерді үшінші тұлғаларға бермейді және оларды маркетингтік немесе басқа да мақсаттарда пайдаланбайды.</p>

            <h3 className="font-medium text-lg">3. Жауапкершілікті шектеу</h3>
            <p>3.1. Сервис әкімшілігі жасалған құжаттардың дәлдігіне, өзектілігіне және құқықтық дұрыстығына жауап бермейді.</p>
            <p>3.2. Сервис тек ақпараттық сипатқа ие және заңгерлік кеңес болып табылмайды.</p>
            <p>3.3. Пайдаланушы жасалған құжаттарды қолданбас бұрын оларды өз бетінше тексеруі керек.</p>

            <h3 className="font-medium text-lg">4. Сервисті пайдалану</h3>
            <p>4.1. Пайдаланушы Сервисті тек заңды мақсаттарда пайдалануға келіседі.</p>
            <p>4.2. Сервис заңсыз, жалған немесе алаяқтық құжаттарды жасау үшін пайдаланылмауы тиіс.</p>

            <h3 className="font-medium text-lg">5. Келісімге өзгерістер енгізу</h3>
            <p>5.1. Әкімшілік осы Келісімге пайдаланушыларды алдын ала хабардар етпестен өзгерістер енгізу құқығын өзіне қалдырады.</p>
            <p>5.2. Өзгерістер енгізілгеннен кейін Сервисті пайдалануды жалғастыру пайдаланушының жаңа шарттармен келісетінін білдіреді.</p>

            <h3 className="font-medium text-lg">6. Байланыс ақпараты</h3>
            <p>Сервис жұмысына қатысты барлық сұрақтар бойынша [01temkaz@gmail.com] мекенжайына хабарласуға болады.</p>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="agreement" 
              checked={accepted} 
              onCheckedChange={(value) => setAccepted(Boolean(value))}
            />
            <Label htmlFor="agreement">Я согласен с условиями пользовательского соглашения</Label>
          </div>
          <Button onClick={onAccept} disabled={!accepted}>Принять</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserAgreement;
