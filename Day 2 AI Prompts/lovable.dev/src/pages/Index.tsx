import { useState, useCallback } from 'react';
import { ArrowRight, Download, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadZone } from '@/components/FileUploadZone';
import { FormatSelector } from '@/components/FormatSelector';
import { CodePreview } from '@/components/CodePreview';
import { useToast } from '@/hooks/use-toast';
import { convertFile, type FileFormat } from '@/lib/converters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { toast } = useToast();
  const [inputFormat, setInputFormat] = useState<FileFormat>('json');
  const [outputFormat, setOutputFormat] = useState<FileFormat>('csv');
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState('');
  const [error, setError] = useState<string>();
  const [inputTab, setInputTab] = useState<'upload' | 'text'>('upload');

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        // Detect format from file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension === 'json' || extension === 'csv' || extension === 'xml') {
          setInputFormat(extension as FileFormat);
        }

        const text = await file.text();
        setInputContent(text);
        setError(undefined);

        toast({
          title: 'File loaded',
          description: `${file.name} loaded successfully`,
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to read file',
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  const handleConvert = useCallback(() => {
    if (!inputContent.trim()) {
      setError('Please provide input content');
      return;
    }

    const result = convertFile(inputContent, inputFormat, outputFormat);

    if (result.error) {
      setError(result.error.message);
      setOutputContent('');
      toast({
        title: 'Conversion failed',
        description: result.error.message,
        variant: 'destructive',
      });
    } else if (result.result) {
      setOutputContent(result.result);
      setError(undefined);
      toast({
        title: 'Success!',
        description: `Converted from ${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()}`,
      });
    }
  }, [inputContent, inputFormat, outputFormat, toast]);

  const handleDownload = useCallback(() => {
    if (!outputContent) return;

    const blob = new Blob([outputContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: `File saved as converted.${outputFormat}`,
    });
  }, [outputContent, outputFormat, toast]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-[hsl(var(--gradient-accent-start)/0.15)] to-[hsl(var(--gradient-accent-end)/0.15)] border border-[hsl(var(--gradient-accent-start)/0.3)] backdrop-blur-sm text-primary text-sm font-semibold shadow-lg animate-float">
            <Sparkles className="w-4 h-4 animate-glow-pulse" />
            <span>Premium File Converter</span>
          </div>
          <h1 className="text-6xl font-bold mb-4 gradient-text tracking-tight">
            File Format Converter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Convert between JSON, CSV, and XML formats instantly. Professional-grade conversion with validation and
            real-time preview.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="card-premium p-6 space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Input</h2>
            </div>

            <FormatSelector
              selected={inputFormat}
              onSelect={setInputFormat}
              label="Input Format"
            />

            <Tabs value={inputTab} onValueChange={(v) => setInputTab(v as 'upload' | 'text')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="text">Paste Text</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-4">
                <FileUploadZone onFileSelect={handleFileSelect} />
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <Textarea
                  placeholder={`Paste your ${inputFormat.toUpperCase()} content here...`}
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  className="min-h-[200px] font-mono text-sm input-premium"
                />
              </TabsContent>
            </Tabs>

            {inputContent && (
              <CodePreview
                content={inputContent}
                title="Input Preview"
                maxHeight="200px"
              />
            )}
          </div>

          {/* Output Section */}
          <div className="card-premium p-6 space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Output</h2>
            </div>

            <FormatSelector
              selected={outputFormat}
              onSelect={setOutputFormat}
              label="Output Format"
            />

            <div className="space-y-4">
              <Button
                onClick={handleConvert}
                disabled={!inputContent}
                className="w-full btn-premium glow-effect font-semibold"
                variant="premium"
                size="lg"
              >
                <span>Convert Now</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {outputContent && (
                <>
                  <CodePreview
                    content={outputContent}
                    error={error}
                    title="Conversion Result"
                    maxHeight="300px"
                  />

                  <Button
                    onClick={handleDownload}
                    className="w-full btn-premium glow-effect font-semibold"
                    variant="accent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {outputFormat.toUpperCase()}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
          {[
            {
              title: 'Real-time Validation',
              description: 'Instant feedback on file validity with clear error messages',
            },
            {
              title: 'Drag & Drop',
              description: 'Simple file upload with drag and drop support',
            },
            {
              title: 'Secure & Private',
              description: 'All conversions happen in your browser, no server uploads',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="card-premium p-6 text-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
            >
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
