
import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PortraitOptions, LineStyle, ContrastLevel, DetailLevel, ColorMode, FontStyle, GenerationState } from './types';
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
    colorMode: ColorMode.BW,
    colors: ['#EF4444', '#3B82F6', '#EAB308'], // Default Red, Blue, Yellow
    customText: '',
    fontStyle: FontStyle.SANS,
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
          <div className="flex items-center gap-6">
            <span className="text-xs text-neutral-500 uppercase tracking-widest hidden md:block">Studio Edition</span>
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-white transition-colors border border-neutral-800 px-3 py-1 rounded-full bg-neutral-900/50"
            >
              Gemini Powered
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-5 space-y-8">
            
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-semibold text-neutral-200">1. Upload Photo</h2>
                <span className="text-xs text-neutral-500">Portrait or Selfie works best</span>
              </div>
              <div className="aspect-[4/3] w-full">
                <ImageUploader 
                  onImageSelect={setSelectedImageBase64} 
                  selectedImage={selectedImageBase64}
                  disabled={generationState.isGenerating}
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-neutral-200">2. Configure Artist</h2>
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
                  : 'bg-white text-black hover:bg-neutral-200 hover:scale-[1.01] shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95'
              }`}
            >
              {generationState.isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <>
                  Render Portrait <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            <p className="text-center text-[10px] text-neutral-600 px-8 leading-relaxed">
               The AI process takes ~10 seconds. Results are optimized for high-contrast vector outputs and digital merchandise.
            </p>

          </div>

          {/* Right Column: Preview/Result */}
          <div className="lg:col-span-7">
             <div className="sticky top-28 space-y-4">
                <h2 className="text-xl font-semibold text-neutral-200">The Canvas</h2>
                <div className="aspect-[3/4] lg:aspect-square w-full">
                   <ResultDisplay 
                      isGenerating={generationState.isGenerating}
                      resultImage={generationState.resultImage}
                      error={generationState.error}
                   />
                </div>
                
                {generationState.resultImage && (
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
                        <Sparkles className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          <strong>Pro Tip:</strong> Use the <strong>SVG</strong> download option to scale this design to any size without losing quality. Perfect for high-res printing or logo work.
                        </p>
                    </div>
                )}
             </div>
          </div>

        </div>
      </main>
      
      <footer className="border-t border-neutral-900 mt-20 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-neutral-700 text-sm">
           &copy; {new Date().getFullYear()} PortraitMaker AI Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
