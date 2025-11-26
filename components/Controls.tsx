import React from 'react';
import { LineStyle, ContrastLevel, DetailLevel, PortraitOptions } from '../types';
import { Settings, Sliders, Zap, Palette } from 'lucide-react';

interface ControlsProps {
  options: PortraitOptions;
  setOptions: React.Dispatch<React.SetStateAction<PortraitOptions>>;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ options, setOptions, disabled }) => {
  const handleChange = (key: keyof PortraitOptions, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...options.colors] as [string, string, string];
    newColors[index] = value;
    setOptions((prev) => ({ ...prev, colors: newColors }));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2 text-white/90">
        <Settings className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Style Settings</h3>
      </div>

      {/* Line Style */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-400 flex items-center gap-2">
          <Sliders className="w-4 h-4" /> Line Weight
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(LineStyle).map((style) => (
            <button
              key={style}
              onClick={() => handleChange('lineStyle', style)}
              disabled={disabled}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                options.lineStyle === style
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-800 text-neutral-400 border-transparent hover:bg-neutral-700'
              }`}
            >
              {style.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Contrast Level */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-400 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Contrast
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(ContrastLevel).map((level) => (
            <button
              key={level}
              onClick={() => handleChange('contrastLevel', level)}
              disabled={disabled}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                options.contrastLevel === level
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-800 text-neutral-400 border-transparent hover:bg-neutral-700'
              }`}
            >
              {level.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Level */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-400 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Detail Level
        </label>
        <select
          value={options.detailLevel}
          onChange={(e) => handleChange('detailLevel', e.target.value)}
          disabled={disabled}
          className="w-full bg-neutral-800 text-white text-sm rounded-lg p-3 border border-neutral-700 focus:ring-2 focus:ring-white focus:outline-none transition-all"
        >
          {Object.values(DetailLevel).map((detail) => (
            <option key={detail} value={detail}>
              {detail}
            </option>
          ))}
        </select>
      </div>

      {/* Color Palette Settings */}
      <div className="space-y-3 pt-2 border-t border-neutral-800">
        <label className="text-sm text-neutral-400 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Color Palette
        </label>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => handleChange('useColor', false)}
              disabled={disabled}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                !options.useColor
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-800 text-neutral-400 border-transparent hover:bg-neutral-700'
              }`}
            >
              Black & White
            </button>
            <button
              onClick={() => handleChange('useColor', true)}
              disabled={disabled}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                options.useColor
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-800 text-neutral-400 border-transparent hover:bg-neutral-700'
              }`}
            >
              Custom 3 Colors
            </button>
        </div>

        {options.useColor && (
          <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-1">
                <input
                  type="color"
                  value={options.colors[index]}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  disabled={disabled}
                  className="w-full h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <div className="text-[10px] text-center text-neutral-500 font-mono uppercase">
                  {options.colors[index]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Controls;