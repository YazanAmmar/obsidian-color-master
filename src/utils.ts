import { App, DataAdapter } from "obsidian";
import type { Profile } from "./types";

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

/**
 * Generic check to see if a plugin is installed AND enabled.
 * @param app The Obsidian App instance.
 * @param pluginIds An ID or array of IDs to check.
 */
export function isPluginEnabled(
  app: App,
  pluginIds: string | string[]
): boolean {
  const pluginManager = (app as any).plugins;
  const idsToCheck = Array.isArray(pluginIds) ? pluginIds : [pluginIds];

  // Check ONLY running plugins (plugins[id] is only populated if installed AND enabled)
  return idsToCheck.some((id) => pluginManager.plugins[id]);
}

/**
 * Specific check for the Iconize plugin.
 * @param app The Obsidian App instance.
 */
export function isIconizeEnabled(app: App): boolean {
  const iconizeIDs = ["obsidian-icon-folder", "iconize"];
  return isPluginEnabled(app, iconizeIDs);
}

// Debounce function to limit how often a function can run
// (e.g., for search bars or undo history)
export function debounce(fn: (...args: any[]) => void, ms = 200) {
  let t: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Helper to find an available file path (e.g., 'image-2.png')
 * @param adapter - The Obsidian DataAdapter (from app.vault.adapter)
 * @param path - The desired file path
 */
export async function findNextAvailablePath(
  adapter: DataAdapter,
  path: string
): Promise<string> {
  // If original path doesn't exist, use it directly.
  if (!(await adapter.exists(path))) {
    return path;
  }

  // Split path into directory, base filename, and extension
  const pathParts = path.split("/");
  const fullFileName = pathParts.pop();
  if (!fullFileName) return path;

  const dir = pathParts.join("/");
  // Check if file has an extension
  const fileNameParts = fullFileName.split(".");
  const ext = fileNameParts.length > 1 ? fileNameParts.pop() : "";
  const baseName = fileNameParts.join(".");

  let counter = 2;
  let newPath = ext
    ? `${dir}/${baseName}-${counter}.${ext}`
    : `${dir}/${baseName}-${counter}`;

  while (await adapter.exists(newPath)) {
    counter++;
    newPath = ext
      ? `${dir}/${baseName}-${counter}.${ext}`
      : `${dir}/${baseName}-${counter}`;
  }
  return newPath;
}

/**
 * Converts an image to JPG if the active profile settings require it.
 * @param activeProfile - The currently active profile object
 * @param arrayBuffer - The original image data.
 * @param fileName - The original file name.
 * @returns A promise resolving to the (potentially converted) image data and new file name.
 */
export async function maybeConvertToJpg(
  activeProfile: Profile | undefined,
  arrayBuffer: ArrayBuffer,
  fileName: string
): Promise<{ arrayBuffer: ArrayBuffer; fileName: string }> {
  // 1. Check if conversion is needed
  const fileExt = fileName.split(".").pop()?.toLowerCase();
  const isAlreadyJpg = fileExt === "jpg" || fileExt === "jpeg";
  const supportedToConvert = ["png", "webp", "bmp"].includes(fileExt || "");

  if (
    !activeProfile ||
    !activeProfile.convertImagesToJpg ||
    isAlreadyJpg ||
    !supportedToConvert
  ) {
    // No conversion needed, return original data
    return { arrayBuffer, fileName };
  }

  console.log(`Color Master: Converting ${fileName} to JPG...`);

  // 2. Start conversion process using Canvas
  return new Promise((resolve, reject) => {
    const blob = new Blob([arrayBuffer]);
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Failed to get canvas context"));
      }

      // 3. Fill background with white (JPG doesn't support transparency)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 4. Draw the original image onto the canvas
      ctx.drawImage(image, 0, 0);
      URL.revokeObjectURL(url); // Clean up memory

      // 5. Get quality setting
      const quality = (activeProfile.jpgQuality || 85) / 100.0; // Convert 1-100 scale to 0.0-1.0

      // 6. Convert canvas to JPG Blob
      canvas.toBlob(
        async (jpgBlob) => {
          if (!jpgBlob) {
            return reject(new Error("Failed to create JPG blob"));
          }

          // 7. Get ArrayBuffer from new JPG Blob
          const newArrayBuffer = await jpgBlob.arrayBuffer();
          const newFileName =
            fileName.substring(0, fileName.lastIndexOf(".")) + ".jpg";

          console.log(
            `Color Master: Conversion complete. New size: ${newArrayBuffer.byteLength} bytes`
          );
          resolve({ arrayBuffer: newArrayBuffer, fileName: newFileName });
        },
        "image/jpeg",
        quality
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion"));
    };

    image.src = url;
  });
}
