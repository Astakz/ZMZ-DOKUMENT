import * as pdfjsLib from 'pdfjs-dist';

// Инициализация библиотеки PDF.js с корректным путем к воркеру
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractDataFromPdf = async (file: File): Promise<PDFData | null> => {
  try {
    // Преобразуем File в ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Загружаем PDF с помощью PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Извлекаем текст из всех страниц
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + ' ';
    }
    
    console.log('Извлеченный текст из PDF:', fullText);
    
    // Извлекаем данные из текста с помощью регулярных выражений
    const extractedData: PDFData = {
      notaryName: extractNotaryName(fullText),
      licenseNumber: extractLicenseNumber(fullText),
      licenseDate: extractLicenseDate(fullText),
      debtorName: extractDebtorName(fullText),
      debtorIIN: extractDebtorIIN(fullText),
      email: extractEmail(fullText),
      phoneNumber: extractPhoneNumber(fullText),
      executiveInscriptionNumber: extractExecutiveInscriptionNumber(fullText),
      executiveInscriptionDate: extractExecutiveInscriptionDate(fullText),
      organizationName: extractOrganizationName(fullText),
      debtAmount: extractDebtAmount(fullText),
      debtAmountInWords: extractDebtAmountInWords(fullText),
      expensesAmount: extractExpensesAmount(fullText),
      expensesAmountInWords: extractExpensesAmountInWords(fullText),
      totalAmount: extractTotalAmount(fullText),
      totalAmountInWords: extractTotalAmountInWords(fullText),
    };
    
    console.log('Извлеченные данные:', extractedData);
    
    // Если важные поля не извлечены, вернем null
    if (!extractedData.notaryName && !extractedData.debtorName && !extractedData.executiveInscriptionNumber) {
      console.warn('Не удалось извлечь критические данные из PDF');
      return null;
    }
    
    return extractedData;
  } catch (error) {
    console.error('Ошибка при извлечении данных из PDF:', error);
    return null;
  }
};

// Вспомогательные функции для извлечения данных с помощью регулярных выражений
function extractNotaryName(text: string): string {
  // Ищем имя нотариуса после "Я,"
  const notaryRegex = /Я,\s+([А-ЯЁ][А-ЯЁ\s]+(?:\s+[А-ЯЁ][а-яё]+){1,2})/i;
  const match = text.match(notaryRegex);
  return match ? match[1].trim() : '';
}

function extractLicenseNumber(text: string): string {
  // Ищем информацию о лицензии после "государственная лицензия"
  const licenseRegex = /государственная\s+лицензия\s+[№]?\s*(\d[\d\-]*\d)(?:\s+от\s+([0-9.]+))?/i;
  const match = text.match(licenseRegex);
  return match ? match[1].trim() : '';
}

function extractLicenseDate(text: string): string {
  // Ищем дату лицензии после номера лицензии
  const licenseDateRegex = /государственная\s+лицензия\s+[№]?\s*\d[\d\-]*\d\s+от\s+([0-9.]+)/i;
  const match = text.match(licenseDateRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '';
}

function extractDebtorName(text: string): string {
  // Ищем ФИО должника после "взыскать" и "с"
  const debtorRegex = /взыскать\s+(?:по\s+настоящему\s+документу\s+)?с\s+([А-ЯЁ][А-ЯЁ\s]+(?:\s+[А-ЯЁ][а-яё]+){1,2})/i;
  const match = text.match(debtorRegex);
  return match ? match[1].trim() : '';
}

function extractDebtorIIN(text: string): string {
  // Ищем ИИН - 12-значный номер, часто после слова "ИИН"
  const iinRegex = /(?:ИИН|иин):?\s*(\d{12})/i;
  const match = text.match(iinRegex);
  
  // Если не нашли по шаблону, ищем просто 12 цифр подряд
  if (!match) {
    const digitOnlyRegex = /\b(\d{12})\b/;
    const digitMatch = text.match(digitOnlyRegex);
    return digitMatch ? digitMatch[1].trim() : '';
  }
  
  return match ? match[1].trim() : '';
}

function extractEmail(text: string): string {
  // Ищем email адрес
  const emailRegex = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/;
  const match = text.match(emailRegex);
  return match ? match[1].trim() : '';
}

function extractPhoneNumber(text: string): string {
  // Ищем номер телефона в различных форматах, но не счет в банке
  const phoneRegex = /(?<!\bИИК\s*|\bKZ)(?:\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/i;
  const match = text.match(phoneRegex);
  return match ? match[0].trim() : '';
}

function extractExecutiveInscriptionNumber(text: string): string {
  // Ищем номер исполнительной надписи после "Зарегистрировано в реестре за"
  const inscriptionPatterns = [
    /Зарегистрировано\s+в\s+реестре\s+за\s+[№]?\s*([A-ZА-ЯЁ0-9\-\/]+)/i,
    /реестр(?:а|у|е)[\s\:].*?(?:за|№)[\s\:]?([A-ZА-ЯЁ0-9\-\/]+)/i,
    /(?:исполнительн(?:ая|ой)\s+надпись|№)\s+(?:№|номер)?\s*([A-ZА-ЯЁ0-9\-\/]+)/i
  ];
  
  for (const pattern of inscriptionPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function extractExecutiveInscriptionDate(text: string): string {
  // Сначала ищем дату в контексте даты создания документа
  const createDateRegex = /Дата\s+создания\s+[«"]?(\d{1,2}[»"]?\s+[а-яё]+\s+\d{4})/i;
  let match = text.match(createDateRegex);
  if (match) {
    return convertToDateFormat(match[1]);
  }
  
  // Ищем дату после номера лицензии
  const licenseDateRegex = /государственная\s+лицензия\s+[№]?\s*\d[\d\-]*\d\s+от\s+([0-9.]+)/i;
  match = text.match(licenseDateRegex);
  if (match) {
    return match[1].trim();
  }
  
  // Если не нашли, ищем другие даты в формате ДД.ММ.ГГГГ
  const dateRegex = /\b(\d{2}\.\d{2}\.20\d{2})\b/;
  match = text.match(dateRegex);
  return match ? match[1].trim() : '';
}

// Вспомогательная функция для конвертации текстовой даты в формат ДД.ММ.ГГГГ
function convertToDateFormat(textDate: string): string {
  textDate = textDate.replace(/[«»"]/g, '').trim();
  const parts = textDate.split(/\s+/);
  if (parts.length === 3) {
    let day = parts[0].padStart(2, '0');
    
    const monthMap: Record<string, string> = {
      'января': '01', 'февраля': '02', 'марта': '03', 'апреля': '04',
      'мая': '05', 'июня': '06', 'июля': '07', 'августа': '08',
      'сентября': '09', 'октября': '10', 'ноября': '11', 'декабря': '12'
    };
    
    const month = monthMap[parts[1].toLowerCase()] || '';
    const year = parts[2];
    
    if (month && year) {
      return `${day}.${month}.${year}`;
    }
  }
  return textDate;
}

function extractOrganizationName(text: string): string {
  // Ищем название организации после "в пользу"
  const orgPatterns = [
    /в\s+пользу\s+([«"]?[А-ЯЁ][^,.]+?(?:"|»|"\s|\s[А-ЯЁ][^,.]+))/i,
    /в\s+пользу\s+([«"]?[А-ЯЁ][а-яёА-ЯЁ\s\-"«»]+?(?:"|»|\())/i
  ];
  
  for (const pattern of orgPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Очищаем от лишних кавычек
      return match[1].replace(/[«»"]/g, '').trim();
    }
  }
  
  // Ищем "Товарищество с ограниченной ответственностью" и следующее за ним название в кавычках
  const tooPattern = /Товарищество\s+с\s+ограниченной\s+ответственностью\s+[«"]([^«»"]+)[»"]/i;
  const tooMatch = text.match(tooPattern);
  
  if (tooMatch) {
    return `ТОО "${tooMatch[1].trim()}"`;
  }
  
  return '';
}

function extractDebtAmount(text: string): string {
  // Ищем сумму задолженности разными способами
  const amountPatterns = [
    /задолженность\s+в\s+сумме\s+(\d[\d\s,.]+)(?:\s*тенге|\s*₸)/i,
    /составляет\s+(\d[\d\s,.]+)(?:\s*тенге|\s*₸)/i,
    /(\d[\d\s,.]+)(?:\s*тенге|\s*₸)/i
  ];
  
  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = match[1].replace(/\s+/g, '').trim();
      return `${amount} тенге`;
    }
  }
  
  return '';
}

function extractDebtAmountInWords(text: string): string {
  // Ищем сумму задолженности прописью в скобках
  const inWordsPattern = /\d[\d\s,.]+\s*(?:тенге|\s*₸)\s*\(([^()]+)\)/i;
  const match = text.match(inWordsPattern);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return '';
}

function extractExpensesAmount(text: string): string {
  // Ищем расходы по совершению исполнительной надписи
  const expensesPatterns = [
    /расходы\s+(?:по\s+)?совершени[юя]\s+исполнительной\s+надписи\s+в\s+(?:сумме\s+)?(\d[\d\s,.]+)(?:\s*тенге|\s*₸)/i,
    /расходы\s+(?:по\s+)?совершени[юя]\s+исполнительной\s+надписи\s+в\s+(?:размере\s+)?(\d[\d\s,.]+)(?:\s*тенге|\s*₸)/i
  ];
  
  for (const pattern of expensesPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = match[1].replace(/\s+/g, '').trim();
      return `${amount} тенге`;
    }
  }
  
  return '';
}

function extractExpensesAmountInWords(text: string): string {
  // Ищем сумму расходов прописью
  const inWordsPattern = /расходы\s+(?:по\s+)?совершени[юя]\s+исполнительной\s+надписи\s+в\s+(?:размере\s+)?\d[\d\s,.]+\s*(?:тенге|\s*₸)\s*\(([^()]+)\)/i;
  const match = text.match(inWordsPattern);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return '';
}

function extractTotalAmount(text: string): string {
  // Ищем общую сумму, подлежащую взысканию
  const totalPattern = /Общая\s+сумма[\s,]+подлежащая\s+взысканию[\s,]+составляет\s+(\d[\d\s,.]+)(?:\s*тенге|\s*₸)/i;
  const match = text.match(totalPattern);
  
  if (match && match[1]) {
    const amount = match[1].replace(/\s+/g, '').trim();
    return `${amount} тенге`;
  }
  
  return '';
}

function extractTotalAmountInWords(text: string): string {
  // Ищем общую сумму прописью в скобках
  const inWordsPattern = /Общая\s+сумма[\s,]+подлежащая\s+взысканию[\s,]+составляет\s+\d[\d\s,.]+\s*(?:тенге|\s*₸)\s*\(([^()]+)\)/i;
  const match = text.match(inWordsPattern);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return '';
}
