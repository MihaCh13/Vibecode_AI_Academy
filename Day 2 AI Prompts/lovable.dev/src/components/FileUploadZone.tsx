import { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

export function FileUploadZone({ onFileSelect, accept = '.json,.csv,.xml', disabled = false }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8 transition-all duration-300',
        isDragging
          ? 'border-primary bg-gradient-to-br from-[hsl(var(--gradient-accent-start)/0.1)] to-[hsl(var(--gradient-accent-end)/0.1)] scale-[1.02] shadow-xl'
          : 'border-border hover:border-primary/50 hover:bg-accent/5 hover:shadow-lg bg-[hsl(var(--glass-bg)/0.5)] backdrop-blur-sm',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload file"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={cn(
          "p-4 rounded-full transition-all duration-300",
          isDragging 
            ? "bg-gradient-to-br from-[hsl(var(--gradient-accent-start)/0.2)] to-[hsl(var(--gradient-accent-end)/0.2)] animate-glow-pulse" 
            : "bg-primary/10"
        )}>
          <Upload className={cn(
            "w-8 h-8 transition-all duration-300",
            isDragging ? "text-primary animate-float" : "text-primary"
          )} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            Drop your file here or <span className="gradient-text font-bold">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Supports JSON, CSV, and XML files</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <FileText className="w-4 h-4" />
          <span>Max file size: 10MB</span>
        </div>
      </div>
    </div>
  );
}
