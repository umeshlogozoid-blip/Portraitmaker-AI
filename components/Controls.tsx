
import React from 'react';
import { LineStyle, ContrastLevel, DetailLevel, PortraitOptions, ColorMode, FontStyle } from '../types';
import { Settings, Sliders, Zap, Palette, Type, Type as FontIcon } from 'lucide-react';

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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const words = e.target.value.split(/\s+/).filter(w => w.length > 0);
    if (words.length <= 10) {
      handleChange('customText', e.target.value);
    }
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

      {/* Color Mode Selection */}
      <div className="space-y-3 pt-2 border-t border-neutral-800">
        <label className="text-sm text-neutral-400 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Color Mode
        </label>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
            {Object.values(ColorMode).map((mode) => (
              <button
                key={mode}
                onClick={() => handleChange('colorMode', mode)}
                disabled={disabled}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 border ${
                  options.colorMode === mode
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-800 text-neutral-400 border-transparent hover:bg-neutral-700'
                }`}
              >
                {mode}
              </button>
            ))}
        </div>

        {options.colorMode === ColorMode.TRIAD && (
          <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-1">
                <input
                  type="color"
                  value={options.colors[index]}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  disabled={disabled}
                  className="w-full h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <div className="text-[9px] text-center text-neutral-500 font-mono uppercase">
                  {options.colors[index]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text Settings */}
      <div className="space-y-4 pt-2 border-t border-neutral-800">
        <div className="flex justify-between items-center">
          <label className="text-sm text-neutral-400 flex items-center gap-2">
            <Type className="w-4 h-4" /> Add Text
          </label>
          <span className="text-[10px] text-neutral-600">Max 10 words</span>
        </div>
        
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Type your caption here..."
            value={options.customText}
            onChange={handleTextChange}
            disabled={disabled}
            className="w-full bg-neutral-800 text-white text-sm rounded-lg p-3 border border-neutral-700 focus:ring-2 focus:ring-white focus:outline-none transition-all placeholder:text-neutral-600"
          />

          {options.customText && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <label className="text-xs text-neutral-500 flex items-center gap-2">
                <FontIcon className="w-3 h-3" /> Font Style
              </label>
              <select
                value={options.fontStyle}
                onChange={(e) => handleChange('fontStyle', e.target.value)}
                disabled={disabled}
                className="w-full bg-neutral-800 text-white text-xs rounded-lg p-2 border border-neutral-700 focus:ring-2 focus:ring-white focus:outline-none transition-all"
              >
                {Object.values(FontStyle).map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Detail & Contrast - Grouped */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
        <div className="space-y-2">
          <label className="text-xs text-neutral-400">Detail</label>
          <select
            value={options.detailLevel}
            onChange={(e) => handleChange('detailLevel', e.target.value)}
            disabled={disabled}
            className="w-full bg-neutral-800 text-white text-[11px] rounded-lg p-2 border border-neutral-700"
          >
            {Object.values(DetailLevel).map((d) => <option key={d} value={d}>{d.split(' ')[0]}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-neutral-400">Contrast</label>
          <select
            value={options.contrastLevel}
            onChange={(e) => handleChange('contrastLevel', e.target.value)}
            disabled={disabled}
            className="w-full bg-neutral-800 text-white text-[11px] rounded-lg p-2 border border-neutral-700"
          >
            {Object.values(ContrastLevel).map((c) => <option key={c} value={c}>{c.split(' ')[0]}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Controls;
