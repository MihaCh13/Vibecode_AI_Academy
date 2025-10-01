import { FileJson, FileSpreadsheet, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileFormat } from '@/lib/converters';

interface FormatSelectorProps {
  selected: FileFormat;
  onSelect: (format: FileFormat) => void;
  label: string;
}

const formats: { value: FileFormat; label: string; icon: any }[] = [
  { value: 'json', label: 'JSON', icon: FileJson },
  { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
  { value: 'xml', label: 'XML', icon: FileCode },
];

export function FormatSelector({ selected, onSelect, label }: FormatSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground tracking-wide">{label}</label>
      <div className="grid grid-cols-3 gap-3">
        {formats.map((format) => {
          const Icon = format.icon;
          const isSelected = selected === format.value;
          
          return (
            <button
              key={format.value}
              onClick={() => onSelect(format.value)}
              className={cn(
                'flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 group',
                'hover:scale-[1.05] active:scale-[0.98]',
                isSelected
                  ? 'border-primary bg-gradient-to-br from-[hsl(var(--gradient-accent-start)/0.15)] to-[hsl(var(--gradient-accent-end)/0.15)] shadow-lg glow-effect'
                  : 'border-border bg-[hsl(var(--glass-bg)/0.5)] backdrop-blur-sm hover:border-primary/50 hover:shadow-md'
              )}
              aria-label={`Select ${format.label} format`}
            >
              <Icon className={cn(
                'w-6 h-6 transition-all duration-300', 
                isSelected ? 'text-primary animate-float' : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'
              )} />
              <span className={cn(
                'text-sm font-semibold tracking-wide', 
                isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
              )}>
                {format.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
