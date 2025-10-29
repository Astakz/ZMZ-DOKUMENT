
import React, { useState, useRef, DragEvent } from 'react';
import { toast } from '@/components/ui/custom-toast';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { extractDataFromPdf } from '@/lib/pdfProcessor';

interface FileUploadProps {
  onFileProcessed: (data: PDFData) => void;
  onProcessingStart: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, onProcessingStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check if the file is a PDF
    if (file.type !== 'application/pdf') {
      toast.error('Пожалуйста, загрузите файл в формате PDF');
      return;
    }

    setFile(file);
    processPdf(file);
  };

  const processPdf = async (file: File) => {
    setIsProcessing(true);
    onProcessingStart();
    
    try {
      // Реальное извлечение данных из PDF с помощью библиотеки pdf-parse
      const extractedData = await extractDataFromPdf(file);
      
      if (extractedData) {
        onFileProcessed(extractedData);
        toast.success('Данные успешно извлечены из PDF');
      } else {
        toast.error('Не удалось извлечь данные из PDF. Пожалуйста, заполните форму вручную.');
        // Still move to the form with empty data in case of error
        onFileProcessed({
          notaryName: "",
          licenseNumber: "",
          licenseDate: "",
          debtorName: "",
          debtorIIN: "",
          email: "",
          phoneNumber: "",
          executiveInscriptionNumber: "",
          executiveInscriptionDate: "",
          organizationName: "",
          debtAmount: "",
          debtAmountInWords: "",
          expensesAmount: "",
          expensesAmountInWords: "",
          totalAmount: "",
          totalAmountInWords: ""
        });
      }
    } catch (error) {
      console.error('Error processing PDF', error);
      toast.error('Не удалось извлечь данные из PDF. Пожалуйста, заполните форму вручную.');
      // Still move to the form with empty data in case of error
      onFileProcessed({
        notaryName: "",
        licenseNumber: "",
        licenseDate: "",
        debtorName: "",
        debtorIIN: "",
        email: "",
        phoneNumber: "",
        executiveInscriptionNumber: "",
        executiveInscriptionDate: "",
        organizationName: "",
        debtAmount: "",
        debtAmountInWords: "",
        expensesAmount: "",
        expensesAmountInWords: "",
        totalAmount: "",
        totalAmountInWords: ""
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-scale-in">
      <div 
        className={`file-upload-zone ${isDragging ? 'dragging' : ''} flex flex-col items-center justify-center min-h-[300px]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Обработка файла...</h3>
            <p className="text-muted-foreground text-sm">Извлекаем данные из документа</p>
          </div>
        ) : file ? (
          <div className="text-center">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Файл загружен</h3>
            <p className="text-muted-foreground mb-4">{file.name}</p>
            <Button 
              onClick={() => setFile(null)} 
              variant="outline"
              className="mt-2"
            >
              Выбрать другой файл
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-muted-foreground mb-4 animate-bounce-subtle" />
            <h3 className="text-lg font-medium mb-2">Загрузите PDF файл</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Перетащите исполнительную надпись нотариуса в формате PDF или нажмите на кнопку ниже
            </p>
            <Button 
              onClick={handleButtonClick}
              className="transition-all hover:scale-105"
            >
              Выбрать файл
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
