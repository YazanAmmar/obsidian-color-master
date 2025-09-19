export function flattenVars(varsObject: { [key: string]: any }): {
  [key: string]: string;
} {
  let flatVars: { [key: string]: string } = {};
  for (const category in varsObject) {
    flatVars = { ...flatVars, ...varsObject[category] };
  }
  return flatVars;
}

export function getLuminance(hex: string): number {
  const rgb = parseInt(hex.startsWith("#") ? hex.substring(1) : hex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function getAccessibilityRating(ratio: number) {
  const score = ratio.toFixed(2);
  if (ratio >= 7) {
    return { text: "AAA", score, cls: "cm-accessibility-pass" };
  }
  if (ratio >= 4.5) {
    return { text: "AA", score, cls: "cm-accessibility-pass" };
  }
  if (ratio >= 3) {
    return { text: "AA Large", score, cls: "cm-accessibility-warn" };
  }
  return { text: "Fail", score, cls: "cm-accessibility-fail" };
}
