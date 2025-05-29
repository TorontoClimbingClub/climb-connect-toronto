
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// Override the toast function to suppress error toasts
const toast = (...args: Parameters<typeof sonnerToast>) => {
  const message = args[0];
  
  // Check if this is an error message and suppress it
  if (typeof message === 'string') {
    const isErrorMessage = message.toLowerCase().includes('error') ||
                          message.toLowerCase().includes('access') ||
                          message.toLowerCase().includes('denied') ||
                          message.toLowerCase().includes('fail');
    
    if (isErrorMessage) {
      console.log('🔇 Sonner toast suppressed:', message);
      return;
    }
  }
  
  return sonnerToast(...args);
};

export { Toaster, toast }
