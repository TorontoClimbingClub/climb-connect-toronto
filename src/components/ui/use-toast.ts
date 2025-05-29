
import { useToast, toast } from "@/hooks/use-toast";

// Create a wrapper that suppresses error toasts
const suppressedToast = (...args: Parameters<typeof toast>) => {
  const [options] = args;
  
  // Check if this is an error toast and suppress it
  const isErrorToast = options?.variant === 'destructive' || 
                      (typeof options?.title === 'string' && options.title.toLowerCase().includes('error')) ||
                      (typeof options?.description === 'string' && options.description.toLowerCase().includes('error')) ||
                      (typeof options?.description === 'string' && options.description.toLowerCase().includes('access')) ||
                      (typeof options?.description === 'string' && options.description.toLowerCase().includes('denied'));
  
  if (isErrorToast) {
    console.log('🔇 UI Toast suppressed:', options);
    return {
      id: Date.now().toString(),
      dismiss: () => {},
      update: () => {},
    };
  }
  
  return toast(...args);
};

export { useToast, suppressedToast as toast };
