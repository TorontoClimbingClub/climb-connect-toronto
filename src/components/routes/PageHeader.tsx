
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export const PageHeader = ({ title, subtitle, onBack }: PageHeaderProps) => {
  // Replace "Beta Boards" with "BetaBoards" in the title
  const displayTitle = title === 'Beta Boards' ? 'BetaBoards' : title;
  
  return (
    <div className="flex items-center gap-3 mb-6">
      <button 
        onClick={onBack}
        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
      >
        <ArrowLeft className="h-5 w-5 text-[#E55A2B]" />
      </button>
      <div>
        <h1 className="text-2xl font-bold text-[#E55A2B]">{displayTitle}</h1>
        <p className="text-stone-600">{subtitle}</p>
      </div>
    </div>
  );
};
