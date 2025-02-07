export interface ImageConfigVO {
  icoFileNames: string[];
  svgFileNames: string[];
}

export interface CompositionImageDTO {
  icoFileName: string;
  svgFileName: string;
  svgSize: number;
  svgX: number;
  svgY: number;
  text?: string;
  textSize?: number;
  textX?: number;
  textY?: number;
  outputFileName: string;
}