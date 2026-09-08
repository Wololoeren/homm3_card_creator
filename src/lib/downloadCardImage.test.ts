import { beforeEach, describe, expect, it, vi } from "vitest";

const toCanvas = vi.fn();
const saveAs = vi.fn();

vi.mock("html-to-image", () => ({ toCanvas: (...args: unknown[]) => toCanvas(...args) }));
vi.mock("file-saver", () => ({ saveAs: (...args: unknown[]) => saveAs(...args) }));

import { downloadCardWebp, renderCardImage } from "./downloadCardImage";
import { onToast } from "./toast";

/** A stand-in for the canvas html-to-image hands back. */
function fakeCanvas(
  blob: Blob | null = new Blob(["x"], { type: "image/webp" }),
  { width = 738, height = 1038 } = {}
) {
  return {
    width,
    height,
    toBlob: vi.fn(
      (callback: BlobCallback) => callback(blob)
    ),
  } as unknown as HTMLCanvasElement;
}

/**
 * Builds a card element nested `zooms.length` ancestors deep, optionally
 * carrying the ::before declarations the exporter has to inline.
 */
function mountCard({
  width = 236,
  height = 332,
  zooms = [] as string[],
  before,
}: {
  width?: number;
  height?: number;
  zooms?: string[];
  before?: Record<string, string>;
} = {}): HTMLElement {
  let parent = document.body;
  for (const zoom of zooms) {
    const wrapper = document.createElement("div");
    wrapper.dataset.zoom = zoom;
    parent.appendChild(wrapper);
    parent = wrapper;
  }

  const node = document.createElement("div");
  parent.appendChild(node);
  node.getBoundingClientRect = () => ({ width, height }) as DOMRect;

  // happy-dom implements neither `zoom` nor pseudo-element styles, so both are
  // served from the test's own description of the card.
  vi.spyOn(window, "getComputedStyle").mockImplementation(
    (element: Element, pseudo?: string | null) => {
      const declarations =
        pseudo && element === node ? (before ?? {}) : {};

      return {
        zoom: (element as HTMLElement).dataset?.zoom ?? "",
        getPropertyValue: (name: string) => declarations[name] ?? "",
      } as CSSStyleDeclaration;
    }
  );

  return node;
}

function collectToasts(): string[] {
  const seen: string[] = [];
  onToast((toast) => seen.push(toast.text));
  return seen;
}

describe("downloadCardWebp", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    toCanvas.mockReset().mockResolvedValue(fakeCanvas());
    saveAs.mockReset();
    document.body.innerHTML = "";
  });

  it("does nothing when there is no element to capture", async () => {
    await downloadCardWebp(null, "spell");

    expect(toCanvas).not.toHaveBeenCalled();
    expect(saveAs).not.toHaveBeenCalled();
  });

  it("saves the render under the given name with a .webp extension", async () => {
    await downloadCardWebp(mountCard(), "magic_arrow-front");

    expect(saveAs).toHaveBeenCalledTimes(1);
    expect(saveAs.mock.calls[0][1]).toBe("magic_arrow-front.webp");
  });

  it("encodes the canvas as WEBP rather than the canvas default of PNG", async () => {
    const canvas = fakeCanvas();
    toCanvas.mockResolvedValue(canvas);

    await downloadCardWebp(mountCard(), "spell");

    const [, type, quality] = vi.mocked(canvas.toBlob).mock.calls[0];
    expect(type).toBe("image/webp");
    expect(quality).toBe(0.95);
  });

  it("renders at 300dpi so the export is fit to print", async () => {
    await downloadCardWebp(mountCard(), "spell");

    // 300dpi over the browser's 96dpi.
    expect(toCanvas.mock.calls[0][1].pixelRatio).toBeCloseTo(3.125);
  });

  it("captures the card at its measured size when nothing is zoomed", async () => {
    await downloadCardWebp(mountCard({ width: 236, height: 332 }), "spell");

    const options = toCanvas.mock.calls[0][1];
    expect(options.width).toBeCloseTo(236);
    expect(options.height).toBeCloseTo(332);
  });

  it("divides out an ancestor's preview zoom so the export keeps the true size", async () => {
    const node = mountCard({ width: 283.2, height: 398.4, zooms: ["1.2"] });

    await downloadCardWebp(node, "spell");

    const options = toCanvas.mock.calls[0][1];
    expect(options.width).toBeCloseTo(236);
    expect(options.height).toBeCloseTo(332);
  });

  it("divides out zoom accumulated across several ancestors", async () => {
    const node = mountCard({ width: 472, height: 664, zooms: ["1.2", "2"] });

    await downloadCardWebp(node, "spell");

    // 1.2 * 2 = 2.4 of zoom over the card's own 236x332 box... measured at 472
    // wide, the unzoomed width is 472 / 2.4.
    expect(toCanvas.mock.calls[0][1].width).toBeCloseTo(472 / 2.4);
  });

  it("strips the preview-only zoom and flip from the captured clone", async () => {
    await downloadCardWebp(mountCard({ zooms: ["1.2"] }), "astrologer-back");

    expect(toCanvas.mock.calls[0][1].style).toEqual({
      zoom: "1",
      transform: "none",
    });
  });

  it("reports a failed render as a toast instead of throwing", async () => {
    const toasts = collectToasts();
    toCanvas.mockRejectedValue(new Error("tainted canvas"));

    await expect(
      downloadCardWebp(mountCard(), "spell")
    ).resolves.toBeUndefined();

    expect(saveAs).not.toHaveBeenCalled();
    expect(toasts.join()).toContain("tainted canvas");
  });

  it("reports a refused WEBP encode instead of saving an empty file", async () => {
    const toasts = collectToasts();
    toCanvas.mockResolvedValue(fakeCanvas(null));

    await downloadCardWebp(mountCard(), "spell");

    expect(saveAs).not.toHaveBeenCalled();
    expect(toasts.join()).toContain("could not encode a WEBP image");
  });
});

describe("renderCardImage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    toCanvas.mockReset().mockResolvedValue(fakeCanvas());
    document.body.innerHTML = "";
  });

  it("has nothing to render when there is no element", async () => {
    await expect(renderCardImage(null)).resolves.toBeNull();
    expect(toCanvas).not.toHaveBeenCalled();
  });

  it("reports the render's pixel size, which is what a download carries", async () => {
    toCanvas.mockResolvedValue(fakeCanvas(undefined, { width: 738, height: 1038 }));

    const image = await renderCardImage(mountCard());

    expect(image).toMatchObject({ width: 738, height: 1038 });
  });

  it("hands back an object URL for the encoded blob rather than saving a file", async () => {
    const blob = new Blob(["webp"], { type: "image/webp" });
    toCanvas.mockResolvedValue(fakeCanvas(blob));
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:card");

    const image = await renderCardImage(mountCard());

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(image?.url).toBe("blob:card");
    expect(saveAs).not.toHaveBeenCalled();
  });

  it("captures exactly what a download would, so the two cannot drift", async () => {
    await downloadCardWebp(mountCard({ zooms: ["1.2"] }), "spell");
    const download = toCanvas.mock.calls[0][1];

    toCanvas.mockClear();
    await renderCardImage(mountCard({ zooms: ["1.2"] }));

    expect(toCanvas.mock.calls[0][1]).toEqual(download);
  });

  it("answers with nothing, and says why, when the render fails", async () => {
    const toasts = collectToasts();
    toCanvas.mockRejectedValue(new Error("tainted canvas"));

    await expect(renderCardImage(mountCard())).resolves.toBeNull();
    expect(toasts.join()).toContain("tainted canvas");
  });
});

describe("downloadCardWebp and pseudo-element images", () => {
  /**
   * html-to-image cannot reach the network from the SVG it builds, so an image
   * a ::before pulls from a bundled URL has to be inlined before the capture.
   */
  const bundledBorder = 'url("http://localhost/_next/static/border.png")';

  let fetched: string[];

  beforeEach(() => {
    vi.restoreAllMocks();
    toCanvas.mockReset().mockResolvedValue(fakeCanvas());
    saveAs.mockReset();
    document.body.innerHTML = "";
    document.head.innerHTML = "";

    fetched = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        fetched.push(url);
        return { blob: async () => new Blob(["png"], { type: "image/png" }) };
      })
    );
  });

  it("hands the capture a data URI in place of a bundled pseudo-element image", async () => {
    let ruleAtCaptureTime = "";
    toCanvas.mockImplementation(async () => {
      ruleAtCaptureTime = document.head.innerHTML;
      return fakeCanvas();
    });

    await downloadCardWebp(
      mountCard({
        before: { content: '""', "border-image-source": bundledBorder },
      }),
      "hero_name-1"
    );

    expect(fetched).toEqual(["http://localhost/_next/static/border.png"]);
    expect(ruleAtCaptureTime).toContain("border-image-source");
    expect(ruleAtCaptureTime).toContain("data:image/png;base64,");
    // The rule it overrides is the more specific one.
    expect(ruleAtCaptureTime).toContain("!important");
  });

  it("puts the page back exactly as it found it", async () => {
    const node = mountCard({
      before: {
        content: '""',
        "background-image": 'url("http://localhost/_next/static/badge.png")',
      },
    });

    await downloadCardWebp(node, "hero_name-1");

    expect(node.className).toBe("");
    expect(document.head.innerHTML).not.toContain("card-export-");
  });

  it("cleans up even when the capture fails", async () => {
    toCanvas.mockRejectedValue(new Error("render failed"));
    const node = mountCard({
      before: {
        content: '""',
        "background-image": 'url("http://localhost/_next/static/cleanup.png")',
      },
    });

    await downloadCardWebp(node, "hero_name-1");

    expect(node.className).toBe("");
    expect(document.head.innerHTML).not.toContain("card-export-");
  });

  it("leaves a self-contained data URI alone rather than refetching it", async () => {
    const node = mountCard({
      before: {
        content: '""',
        "border-image-source": 'url("data:image/webp;base64,AAAA")',
      },
    });

    await downloadCardWebp(node, "air_magic-front");

    expect(fetched).toEqual([]);
    expect(node.className).toBe("");
  });

  it("ignores an element that draws no pseudo-element at all", async () => {
    await downloadCardWebp(mountCard({ before: { content: "none" } }), "spell");

    expect(fetched).toEqual([]);
    expect(toCanvas).toHaveBeenCalledTimes(1);
  });
});
