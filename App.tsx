import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PortraitOptions, LineStyle, ContrastLevel, DetailLevel, GenerationState } from './types';
import Controls from './components/Controls';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { generatePortrait } from './services/geminiService';

const App: React.FC = () => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  
  const [options, setOptions] = useState<PortraitOptions>({
    lineStyle: LineStyle.MEDIUM,
    contrastLevel: ContrastLevel.HIGH,
    detailLevel: DetailLevel.BALANCED,
    useColor: false,
    colors: ['#ef4444', '#3b82f6', '#eab308'], // Default Red, Blue, Yellow
  });

  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    resultImage: null,
  });

  const handleGenerate = async () => {
    if (!selectedImageBase64) return;

    setGenerationState({
      isGenerating: true,
      error: null,
      resultImage: null,
    });

    try {
      const result = await generatePortrait(selectedImageBase64, options);
      setGenerationState({
        isGenerating: false,
        error: null,
        resultImage: result,
      });
    } catch (err: any) {
      setGenerationState({
        isGenerating: false,
        error: err.message || "An unexpected error occurred.",
        resultImage: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform -rotate-6">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">PortraitMaker AI</h1>
          </div>
          <a
            href="https://github.com/google/generative-ai-js"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-500 hover:text-white transition-colors hidden sm:block"
          >
            Powered by Gemini
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-5 space-y-8">
            
            <section>
              <h2 className="text-xl font-semibold mb-4 text-neutral-200">1. Upload Photo</h2>
              <div className="aspect-[4/3] w-full">
                <ImageUploader 
                  onImageSelect={setSelectedImageBase64} 
                  selectedImage={selectedImageBase64}
                  disabled={generationState.isGenerating}
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-neutral-200">2. Customize Style</h2>
              <Controls 
                options={options} 
                setOptions={setOptions} 
                disabled={generationState.isGenerating}
              />
            </section>

            <button
              onClick={handleGenerate}
              disabled={!selectedImageBase64 || generationState.isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                !selectedImageBase64 || generationState.isGenerating
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-neutral-200 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              }`}
            >
              {generationState.isGenerating ? (
                'Processing...'
              ) : (
                <>
                  Generate Portrait <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-neutral-600">
               Uses Gemini 2.5 Flash Image Model. Results are AI-generated.
            </p>

          </div>

          {/* Right Column: Preview/Result */}
          <div className="lg:col-span-7">
             <div className="sticky top-28 space-y-4">
                <h2 className="text-xl font-semibold text-neutral-200">Result</h2>
                <div className="aspect-[3/4] lg:aspect-square w-full">
                   <ResultDisplay 
                      isGenerating={generationState.isGenerating}
                      resultImage={generationState.resultImage}
                      error={generationState.error}
                   />
                </div>
                
                {generationState.resultImage && (
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-sm text-neutral-400">
                        <p><strong>Tip:</strong> The output is a raster PNG. For professional printing, you can use a vectorizer tool (like Adobe Illustrator's Image Trace) to convert this high-contrast PNG into a true SVG path.</p>
                    </div>
                )}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;