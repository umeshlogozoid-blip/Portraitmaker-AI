
export enum LineStyle {
  THICK = 'Thick Lines',
  MEDIUM = 'Medium Lines',
  THIN = 'Thin Lines',
}

export enum ContrastLevel {
  LOW = 'Low Contrast',
  MEDIUM = 'Medium Contrast',
  HIGH = 'High Contrast',
}

export enum DetailLevel {
  SIMPLE = 'Simple / Minimalist',
  BALANCED = 'Balanced',
  DETAILED = 'Detailed',
}

export enum ColorMode {
  BW = 'Black & White',
  TRIAD = '3-Color Triad',
  FULL = 'Full Color',
}

export enum FontStyle {
  SANS = 'Modern Sans',
  SERIF = 'Classic Serif',
  SCRIPT = 'Elegant Script',
  BOLD = 'Bold Impact',
  MINIMAL = 'Minimalist',
}

export interface PortraitOptions {
  lineStyle: LineStyle;
  contrastLevel: ContrastLevel;
  detailLevel: DetailLevel;
  colorMode: ColorMode;
  colors: [string, string, string];
  customText: string;
  fontStyle: FontStyle;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultImage: string | null;
}
