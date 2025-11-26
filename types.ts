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

export interface PortraitOptions {
  lineStyle: LineStyle;
  contrastLevel: ContrastLevel;
  detailLevel: DetailLevel;
  useColor: boolean;
  colors: [string, string, string]; // Fixed 3 colors
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultImage: string | null; // Base64 or URL
}