import { saveAs } from "file-saver";
import { showToast } from "./toast";

/**
 * Cards are laid out in millimetres, so a capture at the browser's 96dpi would
 * come out too coarse to print. Rendering at 300dpi keeps the exported art
 * usable on the same printers the PDF sheets target.
 */
const EXPORT_DPI = 300;
const CSS_DPI = 96;
const PIXEL_RATIO = EXPORT_DPI / CSS_DPI;

const WEBP_QUALITY = 0.95;

/**
 * The previews are magnified with `zoom` for legibility, which inflates the
 * measured box. Undoing the accumulated zoom keeps an export at the card's
 * true size no matter how the surrounding preview is scaled.
 */
function effectiveZoom(node: HTMLElement): number {
  let zoom = 1;

  for (
    let current: Element | null = node;
    current;
    current = current.parentElement
  ) {
    const value = Number.parseFloat(getComputedStyle(current).zoom);
    if (Number.isFinite(value) && value > 0) zoom *= value;
  }

  return zoom;
}

function toWebpBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("The browser could not encode a WEBP image."));
      },
      "image/webp",
      WEBP_QUALITY
    );
  });
}

/**
 * html-to-image copies a pseudo-element's styles into a <style> tag that its
 * resource embedding never visits, and the SVG it builds is not allowed to
 * reach the network. Any image a ::before/::after pulls from a bundled URL
 * would therefore vanish from the capture — the card borders and the level
 * badge among them — so those URLs are swapped for data URIs up front.
 */
const CAPTURED_PSEUDOS = ["::before", "::after"] as const;
const CAPTURED_URL_PROPERTIES = ["background-image", "border-image-source"];

const dataUrls = new Map<string, Promise<string>>();

function toDataUrl(url: string): Promise<string> {
  let pending = dataUrls.get(url);

  if (!pending) {
    pending = (async () => {
      const response = await fetch(url);
      const blob = await response.blob();

      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error(`Could not read ${url}`));
        reader.readAsDataURL(blob);
      });
    })();

    dataUrls.set(url, pending);
  }

  return pending;
}

async function inlineUrls(value: string): Promise<string> {
  // Fresh each call: a shared global regex would carry its lastIndex over.
  const pattern = /url\((['"]?)((?!data:)[^'")]+)\1\)/g;
  const found = [...value.matchAll(pattern)];
  if (found.length === 0) return value;

  const inlined = await Promise.all(found.map((match) => toDataUrl(match[2])));

  let next = 0;
  return value.replace(pattern, () => `url("${inlined[next++]}")`);
}

let markerCount = 0;

/**
 * Overrides the pseudo-element images under `root` with data URIs, and returns
 * the undo so the page is left exactly as it was found.
 */
async function inlinePseudoImages(root: HTMLElement): Promise<() => void> {
  const marked: HTMLElement[] = [];
  const rules: string[] = [];

  for (const element of [root, ...root.querySelectorAll<HTMLElement>("*")]) {
    for (const pseudo of CAPTURED_PSEUDOS) {
      const style = getComputedStyle(element, pseudo);
      const content = style.getPropertyValue("content");
      if (content === "" || content === "none") continue;

      const declarations: string[] = [];

      for (const property of CAPTURED_URL_PROPERTIES) {
        const value = style.getPropertyValue(property);
        if (!value) continue;

        const inlined = await inlineUrls(value);
        // `!important` because the rule this overrides is more specific.
        if (inlined !== value) {
          declarations.push(`${property}: ${inlined} !important;`);
        }
      }

      if (declarations.length === 0) continue;

      const marker = `card-export-${(markerCount += 1)}`;
      element.classList.add(marker);
      marked.push(element);
      rules.push(`.${marker}${pseudo}{${declarations.join("")}}`);
    }
  }

  if (rules.length === 0) return () => {};

  const sheet = document.createElement("style");
  sheet.textContent = rules.join("");
  document.head.appendChild(sheet);

  return () => {
    sheet.remove();
    for (const element of marked) {
      element.classList.forEach((name) => {
        if (name.startsWith("card-export-")) element.classList.remove(name);
      });
    }
  };
}

/** Renders a card element at export resolution. */
async function renderCardCanvas(node: HTMLElement): Promise<HTMLCanvasElement> {
  // Pulled in on demand so the renderer stays out of the initial bundle.
  const { toCanvas } = await import("html-to-image");

  const zoom = effectiveZoom(node);
  const { width, height } = node.getBoundingClientRect();
  const restorePseudoImages = await inlinePseudoImages(node);

  try {
    return await toCanvas(node, {
      width: width / zoom,
      height: height / zoom,
      pixelRatio: PIXEL_RATIO,
      // Both are preview-only: the zoom lives on an ancestor and would double
      // the scaling we just divided out, and the flip is how a landscape back
      // is shown, not how it should be saved.
      style: { zoom: "1", transform: "none" },
    });
  } finally {
    restorePseudoImages();
  }
}

/** Renders a card element to a WEBP file and hands it to the user. */
export async function downloadCardWebp(
  node: HTMLElement | null,
  filename: string
): Promise<void> {
  if (!node) return;

  try {
    saveAs(await toWebpBlob(await renderCardCanvas(node)), `${filename}.webp`);
  } catch (error) {
    showToast(
      error instanceof Error
        ? `Could not export the card: ${error.message}`
        : "Could not export the card."
    );
  }
}

/** A rendered card, ready to be shown at the size it would be saved at. */
export type CardImage = {
  url: string;
  /** Pixel size of the render, which is what a download would carry. */
  width: number;
  height: number;
};

/**
 * Renders exactly what `downloadCardWebp` would save, but hands back an object
 * URL for showing it instead of a file. The caller owns the URL and has to
 * revoke it once the image is off screen.
 */
export async function renderCardImage(
  node: HTMLElement | null
): Promise<CardImage | null> {
  if (!node) return null;

  try {
    const canvas = await renderCardCanvas(node);
    const blob = await toWebpBlob(canvas);

    return {
      url: URL.createObjectURL(blob),
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    showToast(
      error instanceof Error
        ? `Could not render the card: ${error.message}`
        : "Could not render the card."
    );

    return null;
  }
}
