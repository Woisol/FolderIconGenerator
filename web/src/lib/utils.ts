import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let _debounceTimeout: number | null = null
export function debounce(func: Function, wait: number) {
  if (_debounceTimeout) clearTimeout(_debounceTimeout)
  _debounceTimeout = setTimeout(func, wait)
}
// export type Color = {
//   r: number;
//   g: number;
//   b: number;
//   a: number;
// }
// export function hexToRgba(hex: string): Color {
//   // 移除开头的 #
//   hex = hex.replace(/^#/, '');

//   // 检查是否为8位16进制颜色
//   if (hex.length !== 8) {
//     throw new Error('Invalid hex color format. Expected 8-digit hex color (e.g., #RRGGBBAA)');
//   }

//   // 解析每个通道的值
//   const r = parseInt(hex.slice(0, 2), 16);
//   const g = parseInt(hex.slice(2, 4), 16);
//   const b = parseInt(hex.slice(4, 6), 16);
//   const a = parseInt(hex.slice(6, 8), 16) / 255;

//   return { r, g, b, a };
// }
// export function rgbaToHex(rgba: Color): string {
//   // 匹配 rgba(r, g, b, a) 格式
//   // const rgbaRegex = /^#$/;
//   // const match = rgba.match(rgbaRegex);

//   // if (!match) {
//   //   throw new Error('Invalid rgba color format. Expected rgba(r, g, b, a)');
//   // }

//   // 解析每个通道的值

//   // 将 alpha 通道转换为 0-255 的范围
//   const aHex = Math.round(rgba.a * 255).toString(16).padStart(2, '0');

//   // 组合成 8 位 16 进制颜色字符串
//   return `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}${aHex}`;
// }
