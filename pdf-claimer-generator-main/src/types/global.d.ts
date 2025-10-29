
interface PDFData {
  notaryName: string;
  licenseNumber: string;
  debtorName: string;
  debtorIIN: string;
  email: string;
  phoneNumber: string;
  executiveInscriptionNumber: string;
  executiveInscriptionDate: string;
  organizationName: string;
  debtAmount: string;
  debtAmountInWords: string;
  expensesAmount: string;
  expensesAmountInWords: string;
  totalAmount: string;
  totalAmountInWords: string;
  signature?: string; // Base64 encoded signature image
  [key: string]: string | undefined;
}
