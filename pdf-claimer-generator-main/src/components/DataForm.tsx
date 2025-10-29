import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import SignatureCanvas from './SignatureCanvas';

interface DataFormProps {
  initialData: PDFData;
  onSubmit: (data: PDFData) => void;
  onBack: () => void;
}

const DataForm: React.FC<DataFormProps> = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<PDFData>(initialData);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form when data changes
  useEffect(() => {
    const requiredFields: (keyof PDFData)[] = [
      'notaryName', 
      'debtorName',
      'executiveInscriptionNumber',
      'executiveInscriptionDate',
      'organizationName',
      'debtAmount',
      'signature',
    ];
    
    const isValid = requiredFields.every(field => {
      if (field === 'signature') {
        return formData[field] !== undefined && formData[field] !== '';
      }
      return formData[field] && formData[field].trim() !== '';
    });
    
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSignatureChange = (signatureData: string) => {
    setFormData(prev => ({
      ...prev,
      signature: signatureData
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 animate-slide-in-right">
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-medium mb-6 text-center">Проверьте извлеченные данные</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="notaryName">ФИО нотариуса <span className="text-destructive">*</span></Label>
              <Input
                id="notaryName"
                name="notaryName"
                value={formData.notaryName}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Номер лицензии нотариуса</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseDate">Дата лицензии</Label>
              <Input
                id="licenseDate"
                name="licenseDate"
                value={formData.licenseDate}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="debtorName">ФИО должника <span className="text-destructive">*</span></Label>
              <Input
                id="debtorName"
                name="debtorName"
                value={formData.debtorName}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="debtorIIN">ИИН должника</Label>
              <Input
                id="debtorIIN"
                name="debtorIIN"
                value={formData.debtorIIN}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
                maxLength={12}
                pattern="[0-9]{12}"
                title="ИИН должен содержать 12 цифр"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Электронная почта</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Номер телефона</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="executiveInscriptionNumber">Номер исполнительной надписи <span className="text-destructive">*</span></Label>
              <Input
                id="executiveInscriptionNumber"
                name="executiveInscriptionNumber"
                value={formData.executiveInscriptionNumber}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="executiveInscriptionDate">Дата исполнительной надписи <span className="text-destructive">*</span></Label>
              <Input
                id="executiveInscriptionDate"
                name="executiveInscriptionDate"
                value={formData.executiveInscriptionDate}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organizationName">Название организации <span className="text-destructive">*</span></Label>
              <Input
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="debtAmount">Сумма задолженности <span className="text-destructive">*</span></Label>
              <Input
                id="debtAmount"
                name="debtAmount"
                value={formData.debtAmount}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="debtAmountInWords">Сумма задолженности прописью</Label>
              <Input
                id="debtAmountInWords"
                name="debtAmountInWords"
                value={formData.debtAmountInWords}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expensesAmount">Сумма расходов</Label>
              <Input
                id="expensesAmount"
                name="expensesAmount"
                value={formData.expensesAmount}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expensesAmountInWords">Сумма расходов прописью</Label>
              <Input
                id="expensesAmountInWords"
                name="expensesAmountInWords"
                value={formData.expensesAmountInWords}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Общая сумма</Label>
              <Input
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalAmountInWords">Общая сумма прописью</Label>
              <Input
                id="totalAmountInWords"
                name="totalAmountInWords"
                value={formData.totalAmountInWords}
                onChange={handleChange}
                className="transition-all border-muted focus:border-primary"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="signature">Подпись <span className="text-destructive">*</span></Label>
            <SignatureCanvas 
              onChange={handleSignatureChange}
              initialValue={formData.signature}
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="transition-all hover:bg-muted"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            
            <Button 
              type="submit" 
              disabled={!isFormValid}
              className="transition-all hover:scale-105"
            >
              Сгенерировать документ
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DataForm;
