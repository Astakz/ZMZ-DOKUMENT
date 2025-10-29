
import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import StepIndicator from '@/components/StepIndicator';
import FileUpload from '@/components/FileUpload';
import DataForm from '@/components/DataForm';
import DocumentPreview from '@/components/DocumentPreview';
import UserAgreement from '@/components/UserAgreement';
import SupportProject from '@/components/SupportProject';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart } from 'lucide-react';

const STEPS = ['Загрузка файла', 'Проверка данных', 'Готовый документ'];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [showAgreementFooter, setShowAgreementFooter] = useState(true);

  // Check if agreement was previously accepted
  useEffect(() => {
    const accepted = localStorage.getItem('agreementAccepted');
    if (accepted === 'true') {
      setAgreementAccepted(true);
      setShowAgreementFooter(false);
    }
  }, []);

  const handleFileProcessed = (data: PDFData) => {
    setPdfData(data);
    setCurrentStep(1);
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
  };

  const handleFormSubmit = (data: PDFData) => {
    setPdfData(data);
    setCurrentStep(2);
  };

  const handleBackToUpload = () => {
    setCurrentStep(0);
  };

  const handleBackToForm = () => {
    setCurrentStep(1);
  };

  const handleAgreementAccept = () => {
    localStorage.setItem('agreementAccepted', 'true');
    setShowAgreementFooter(false);
    setAgreementOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      
      {/* Support Project Button */}
      <div className="absolute top-6 right-6">
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => setSupportOpen(true)}
        >
          <Heart className="h-4 w-4 text-red-500" />
          Поддержка проекта 😊
        </Button>
      </div>
      
      <main className="flex-grow container mx-auto py-8">
        {!isProcessing && (
          <StepIndicator currentStep={currentStep} steps={STEPS} />
        )}
        
        <div className="relative min-h-[500px] mt-8">
          {currentStep === 0 && (
            <FileUpload 
              onFileProcessed={handleFileProcessed} 
              onProcessingStart={handleProcessingStart}
            />
          )}
          
          {currentStep === 1 && pdfData && (
            <DataForm 
              initialData={pdfData}
              onSubmit={handleFormSubmit}
              onBack={handleBackToUpload}
            />
          )}
          
          {currentStep === 2 && pdfData && (
            <DocumentPreview 
              data={pdfData}
              onBack={handleBackToForm}
            />
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="text-sm text-muted-foreground mb-2">
            © {new Date().getFullYear()} Генератор возражений. Все права защищены.
          </div>
          
          {showAgreementFooter && (
            <div className="flex items-center justify-center mt-4 space-x-2">
              <Checkbox 
                id="footer-agreement" 
                checked={agreementAccepted} 
                onCheckedChange={(value) => setAgreementAccepted(Boolean(value))}
              />
              <div className="flex items-center space-x-1">
                <span className="text-sm">Я согласен с</span>
                <button 
                  onClick={() => setAgreementOpen(true)} 
                  className="text-sm text-primary underline hover:text-primary/80"
                >
                  пользовательским соглашением
                </button>
              </div>
            </div>
          )}
          
          {!showAgreementFooter && (
            <button 
              onClick={() => setAgreementOpen(true)} 
              className="text-xs text-muted-foreground hover:underline"
            >
              Пользовательское соглашение
            </button>
          )}
        </div>
      </footer>

      {/* User Agreement Dialog */}
      <UserAgreement 
        open={agreementOpen}
        onOpenChange={setAgreementOpen}
        onAccept={handleAgreementAccept}
        accepted={agreementAccepted}
        setAccepted={setAgreementAccepted}
      />

      {/* Support Project Dialog */}
      <SupportProject
        open={supportOpen}
        onOpenChange={setSupportOpen}
      />
    </div>
  );
};

export default Index;
