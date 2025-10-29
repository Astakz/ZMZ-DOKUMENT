
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, ChevronLeft, FileText } from 'lucide-react';
import { toast } from '@/components/ui/custom-toast';
import { generatePDF } from '@/lib/documentGenerator';

interface DocumentPreviewProps {
  data: PDFData;
  onBack: () => void;
}

const formatDate = () => {
  const date = new Date();
  return date.toLocaleDateString('ru-RU');
};

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data, onBack }) => {
  const documentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    try {
      if (documentRef.current) {
        await generatePDF(documentRef.current, data.debtorName);
        toast.success('Документ успешно скачан');
      }
    } catch (error) {
      console.error('Error generating PDF', error);
      toast.error('Ошибка при скачивании документа');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 animate-slide-in-right">
      <Card className="p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Предварительный просмотр</h2>
          <Button 
            onClick={handleDownload}
            className="transition-all hover:scale-105"
          >
            <Download className="mr-2 h-4 w-4" /> 
            Скачать PDF
          </Button>
        </div>
        
        <div className="overflow-auto">
          <div ref={documentRef} className="document-page shadow-md">
            <div className="document-content text-sm">
              <div className="text-center font-medium text-lg mb-8">ВОЗРАЖЕНИЕ</div>
              <div className="text-center mb-8">на исполнительную надпись нотариуса №{data.executiveInscriptionNumber} от {data.executiveInscriptionDate}</div>
              
              <div className="text-right mb-8">
                <p><strong>Нотариусу</strong></p>
                <p>{data.notaryName}</p>
                {data.licenseNumber && 
                  <p>государственная лицензия №{data.licenseNumber}</p>
                }
                <p className="mt-4"><strong>от:</strong> {data.debtorName}</p>
                {data.debtorIIN && <p><strong>ИИН:</strong> {data.debtorIIN}</p>}
                {data.email && <p><strong>Эл. Почта:</strong> {data.email}</p>}
                {data.phoneNumber && <p><strong>Номер телефона:</strong> {data.phoneNumber}</p>}
              </div>
              
              <p className="mb-4">
                {data.executiveInscriptionDate} мной была получена исполнительная надпись №{data.executiveInscriptionNumber}.
              </p>
              
              <p className="mb-4">
                При изучении исполнительной надписи мной было выяснено, что Вами указана сумма задолженности в пользу {data.organizationName} в размере {data.debtAmount}
                {data.debtAmountInWords && ` (${data.debtAmountInWords})`}.
              </p>
              
              {data.expensesAmount && (
                <p className="mb-4">
                  Кроме того, подлежат взысканию в пользу указанного юридического лица
                  расходы совершению исполнительной надписи в {data.expensesAmount}
                  {data.expensesAmountInWords && ` (${data.expensesAmountInWords})`}.
                </p>
              )}
              
              {data.totalAmount && (
                <p className="mb-4">
                  Общая сумма, подлежащая взысканию, составляет {data.totalAmount}
                  {data.totalAmountInWords && ` (${data.totalAmountInWords})`}.
                </p>
              )}
              
              <p className="mb-4">С исполнительной надписью я не согласен (-на) по следующим основаниям:</p>
              
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>
                  <strong>Сумма задолженности спорная</strong>. В соответствии с п.2 ст. 92-1 Закона РК «О нотариате» взыскание возможно только по бесспорным требованиям. В данном случае сумма задолженности не является бесспорной. Также мной не была получена досудебная претензия, и я не признавал (-а) неисполнение обязательства.
                </li>
                <li>
                  <strong>Нарушение закона</strong>. Согласно п.3 ст. 92-1 Закона РК «О нотариате», на основании исполнительной надписи не подлежат взысканию неустойки (пени) и проценты. Однако в данном случае сумма взыскания включает проценты и пени, что нарушает закон.
                </li>
              </ol>
              
              <p className="mb-2">На основании вышеизложенного,</p>
              
              <p className="font-medium mb-4">ПРОШУ ВАС:</p>
              
              <p className="mb-6">
                Отменить исполнительную надпись №{data.executiveInscriptionNumber} от {data.executiveInscriptionDate} о взыскании задолженности в пользу {data.organizationName} в сумме {data.totalAmount || data.debtAmount}
                {data.totalAmountInWords ? ` (${data.totalAmountInWords})` : data.debtAmountInWords ? ` (${data.debtAmountInWords})` : ''}.
              </p>
              
              {data.email && (
                <p className="mb-6">
                  Постановление об отмене исполнительной надписи прошу направить на эл. почту: {data.email}.
                </p>
              )}
              
              <div className="mt-10">
                <p>С уважением,</p>
                <p>{data.debtorName}</p>
                <p>{formatDate()}</p>
                
                {data.signature ? (
                  <div className="mt-2 mb-2">
                    <img 
                      src={data.signature} 
                      alt="Подпись" 
                      className="max-h-20 object-contain"
                    />
                  </div>
                ) : (
                  <p className="mt-4">_________________</p>
                )}
                
                <p className="text-xs text-muted-foreground">(Подпись)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="transition-all hover:bg-muted"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Вернуться к редактированию
          </Button>
          
          <Button 
            onClick={handleDownload}
            className="transition-all hover:scale-105"
          >
            <FileText className="mr-2 h-4 w-4" /> 
            Скачать документ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DocumentPreview;
