
import { toast as sonnerToast } from "sonner";

// Create a wrapper around sonner toast to provide consistent toast usage
export const useToast = () => {
  const toast = {
    success: (message: string, options?: any) => sonnerToast.success(message, options),
    error: (message: string, options?: any) => sonnerToast.error(message, options),
    info: (message: string, options?: any) => sonnerToast.info(message, options),
    warning: (message: string, options?: any) => sonnerToast.warning(message, options),
    custom: (jsx: React.ReactNode, options?: any) => sonnerToast(jsx, options),
  };

  return toast;
};
