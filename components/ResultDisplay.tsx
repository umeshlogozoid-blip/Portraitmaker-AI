import React, { useState } from 'react';
import { Download, Share2, Loader2, AlertCircle, ChevronDown, Check } from 'lucide-react';

interface ResultDisplayProps {
  isGenerating: boolean;
  resultImage: string | null;
  error: string | null;
}

type FileFormat = 'png' | 'jpg' | 'svg';

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isGenerating, resultImage, error }) => {
  const [format, setFormat] = useState<FileFormat>('png');
  const [isConverting, setIsConverting] = useState(false);

  const triggerDownload = (url: string, ext: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `portrait-maker-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    if (!resultImage) return;

    // Direct download for PNG (default)
    if (format === 'png') {
      triggerDownload(`data:image/png;base64,${resultImage}`, 'png');
      return;
    }

    setIsConverting(true);

    try {
      const img = new Image();
      img.src = `data:image/png;base64,${resultImage}`;
      await img.decode();

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      if (format === 'jpg') {
        // JPG needs a white background as it doesn't support transparency
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        triggerDownload(dataUrl, 'jpg');
      } 
      else if (format === 'svg') {
        // Draw image to canvas to get ImageData
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        
        // Use ImageTracer to convert to SVG
        // @ts-ignore
        if (typeof window.ImageTracer !== 'undefined') {
          // @ts-ignore
          const svgStr = window.ImageTracer.imagedataToSVG(imageData, {
             ltres: 1, 
             qtres: 1, 
             pathomit: 8, 
             colorsampling: 2, // Deterministic
             numberofcolors: 16, // Enough to capture the palette + antialiasing
             mincolorratio: 0.0, 
             colorquantcycles: 3, 
             scale: 1, 
             simplify: 0, 
             roundcoords: 1, // Round coords to 1 decimal place
             lcpr: 0, 
             qcpr: 0, 
             desc: false, 
             viewbox: true, 
             blurradius: 0, 
             blurdelta: 20 
          });

          const blob = new Blob([svgStr], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          triggerDownload(url, 'svg');
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else {
          alert("SVG converter library failed to load. Please try again.");
        }
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Failed to process the image for download.");
    } finally {
      setIsConverting(false);
    }
  };

  if (error) {
    return (
        <div className="w-full h-full min-h-[300px] bg-red-900/10 border border-red-900/30 rounded-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-200 mb-2">Generation Failed</h3>
            <p className="text-red-400/80 text-sm max-w-xs">{error}</p>
        </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="w-full h-full min-h-[300px] bg-neutral-900 rounded-xl border border-neutral-800 flex flex-col items-center justify-center p-6 text-center animate-pulse">
        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Crafting your portrait...</h3>
        <p className="text-neutral-500 text-sm">Analyzing features & vectorizing shapes</p>
      </div>
    );
  }

  if (!resultImage) {
    return (
      <div className="w-full h-full min-h-[300px] bg-neutral-900/30 rounded-xl border border-dashed border-neutral-800 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mb-4 text-neutral-700">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
        </div>
        <p className="text-neutral-600 font-medium">No result yet</p>
        <p className="text-neutral-700 text-sm mt-1">Upload a photo and hit Generate</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col animate-in zoom-in-95 duration-500">
      <div className="relative flex-1 bg-white rounded-t-xl overflow-hidden flex items-center justify-center group">
         {/* Transparency checkerboard background for context */}
         <div className="absolute inset-0 opacity-10"
              style={{
                  backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`,
                  backgroundSize: `20px 20px`,
                  backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`
              }}
         ></div>
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${resultImage}`}
          alt="Generated Portrait"
          className="relative z-10 max-w-full max-h-[500px] object-contain shadow-2xl"
        />
        
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white z-20">
            Preview
        </div>
      </div>

      <div className="bg-neutral-800 rounded-b-xl p-4 flex gap-3">
        {/* Format Selector */}
        <div className="relative min-w-[100px]">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as FileFormat)}
            className="w-full h-full appearance-none bg-neutral-700 hover:bg-neutral-600 text-white pl-4 pr-8 rounded-lg outline-none focus:ring-2 focus:ring-white transition-all cursor-pointer font-medium"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="svg">SVG</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-neutral-400" />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isConverting}
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 disabled:bg-neutral-400 text-black py-3 rounded-lg font-semibold transition-colors"
        >
          {isConverting ? (
             <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
             <Download className="w-5 h-5" />
          )}
          {isConverting ? 'Converting...' : `Download ${format.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;