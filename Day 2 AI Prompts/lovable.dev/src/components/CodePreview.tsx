import { cn } from '@/lib/utils';
import { Check, AlertCircle } from 'lucide-react';

interface CodePreviewProps {
  content: string;
  error?: string;
  title: string;
  maxHeight?: string;
}

export function CodePreview({ content, error, title, maxHeight = '400px' }: CodePreviewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground tracking-wide">{title}</label>
        {!error && content && (
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Check className="w-3.5 h-3.5" />
            <span>Valid</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-destructive font-semibold px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Error</span>
          </div>
        )}
      </div>
      <div
        className={cn(
          'rounded-lg border overflow-hidden transition-all duration-300',
          error 
            ? 'border-destructive/50 bg-destructive/5 shadow-[0_0_15px_hsl(var(--destructive)/0.2)]' 
            : 'border-[hsl(var(--glass-border)/0.3)] bg-[hsl(var(--glass-bg)/0.4)] backdrop-blur-sm shadow-inner'
        )}
        style={{ maxHeight }}
      >
        {error ? (
          <div className="p-4 text-sm text-destructive">
            <p className="font-semibold mb-2">Validation Error</p>
            <p className="text-xs leading-relaxed">{error}</p>
          </div>
        ) : (
          <pre className="p-4 text-xs font-mono text-foreground overflow-auto leading-relaxed" style={{ maxHeight }}>
            <code>{content || 'No content to display'}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
