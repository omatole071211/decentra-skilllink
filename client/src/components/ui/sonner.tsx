import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Check, Info, AlertTriangle, AlertCircle } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      icons={{
        success: (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#c6f36b] text-[#17221e] shadow-xs">
            <Check size={15} strokeWidth={2.5} />
          </div>
        ),
        info: (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#dbeaf5] text-[#2c536d] shadow-xs">
            <Info size={15} strokeWidth={2.5} />
          </div>
        ),
        warning: (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#fdedc9] text-[#7a5710] shadow-xs">
            <AlertTriangle size={15} strokeWidth={2.5} />
          </div>
        ),
        error: (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#fde2dd] text-[#b95142] shadow-xs">
            <AlertCircle size={15} strokeWidth={2.5} />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans rounded-2xl bg-[#fffdf8] text-[#17221e] border border-[#d9ddd1] shadow-[0_16px_40px_rgba(23,34,30,0.16)] p-4",
          title: "font-bold text-sm text-[#17221e] tracking-tight",
          description: "text-xs text-[#526359] mt-0.5 leading-relaxed font-normal",
          actionButton: "bg-[#17221e] text-[#f6f3ec] rounded-full text-xs font-semibold px-3 py-1",
          cancelButton: "bg-[#eeece5] text-[#536159] rounded-full text-xs px-3 py-1",
          closeButton: "border-[#d9ddd1] text-[#718078] hover:text-[#17221e] bg-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
