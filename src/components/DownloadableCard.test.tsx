import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const downloadCardWebp = vi.fn();
const renderCardImage = vi.fn();
vi.mock("@/lib/downloadCardImage", () => ({
  downloadCardWebp: (...args: unknown[]) => downloadCardWebp(...args),
  renderCardImage: (...args: unknown[]) => renderCardImage(...args),
}));

import DownloadableCard from "./DownloadableCard";
import styles from "./DownloadableCard.module.css";
import { onToast } from "@/lib/toast";

const button = () => screen.getByRole("button", { name: /^Download/ });
const preview = () => screen.getByRole("button", { name: /^View/ });

/** What a 62.5x87.9mm card comes out as at the exporter's 300dpi. */
const rendered = { url: "blob:card", width: 738, height: 1038 };

describe("DownloadableCard", () => {
  beforeEach(() => {
    downloadCardWebp.mockReset().mockResolvedValue(undefined);
    renderCardImage.mockReset().mockResolvedValue(rendered);
  });

  it("shows the card it wraps", () => {
    render(
      <DownloadableCard filename="spell-front">
        <p>Magic Arrow</p>
      </DownloadableCard>
    );

    expect(screen.getByText("Magic Arrow")).toBeInTheDocument();
  });

  it("names the download in its label so the button is reachable without sight", () => {
    render(
      <DownloadableCard filename="magic_arrow-front">
        <p />
      </DownloadableCard>
    );

    expect(button()).toHaveAccessibleName("Download magic_arrow-front as WEBP");
    expect(button()).toHaveAttribute("title", "Download magic_arrow-front.webp");
  });

  it("exports the wrapped card under the given filename when clicked", async () => {
    render(
      <DownloadableCard filename="magic_arrow-front">
        <p>Magic Arrow</p>
      </DownloadableCard>
    );

    await userEvent.click(button());

    expect(downloadCardWebp).toHaveBeenCalledTimes(1);
    const [node, filename] = downloadCardWebp.mock.calls[0];
    expect(filename).toBe("magic_arrow-front");
    expect(node).toContainElement(screen.getByText("Magic Arrow"));
  });

  it("keeps the button out of the element that gets captured", async () => {
    render(
      <DownloadableCard filename="spell-front">
        <p>Magic Arrow</p>
      </DownloadableCard>
    );

    await userEvent.click(button());

    const [node] = downloadCardWebp.mock.calls[0];
    expect(node.querySelector("button")).toBeNull();
  });

  it("blocks a second export until the first one finishes", async () => {
    let finish: () => void = () => {};
    downloadCardWebp.mockReturnValue(
      new Promise<void>((resolve) => {
        finish = resolve;
      })
    );

    render(
      <DownloadableCard filename="spell-front">
        <p />
      </DownloadableCard>
    );

    await userEvent.click(button());
    expect(button()).toBeDisabled();

    finish();
    await waitFor(() => expect(button()).toBeEnabled());
  });

  it("recovers, and says so, when an export blows up unexpectedly", async () => {
    const toasts: string[] = [];
    onToast((toast) => toasts.push(toast.text));
    downloadCardWebp.mockRejectedValue(new Error("render failed"));

    render(
      <DownloadableCard filename="spell-front">
        <p />
      </DownloadableCard>
    );

    await userEvent.click(button());

    await waitFor(() => expect(button()).toBeEnabled());
    expect(toasts).toContain("render failed");
  });

  it("shows a landscape back upside down, matching the printed sheet", () => {
    const { container } = render(
      <DownloadableCard filename="astrologer-back" flipped>
        <p>Back</p>
      </DownloadableCard>
    );

    expect(container.querySelector(`.${styles.flipped}`)).toContainElement(
      screen.getByText("Back")
    );
  });

  it("leaves an upright card unflipped", () => {
    const { container } = render(
      <DownloadableCard filename="astrologer-front">
        <p>Front</p>
      </DownloadableCard>
    );

    expect(container.querySelector(`.${styles.flipped}`)).toBeNull();
  });
});

describe("DownloadableCard zooming", () => {
  beforeEach(() => {
    downloadCardWebp.mockReset().mockResolvedValue(undefined);
    renderCardImage.mockReset().mockResolvedValue(rendered);
  });

  const zoom = async (filename = "spell-front") => {
    render(
      <DownloadableCard filename={filename}>
        <p>Magic Arrow</p>
      </DownloadableCard>
    );

    await userEvent.click(preview());
    return await screen.findByRole("img");
  };

  it("opens the card full size when the preview is clicked", async () => {
    const image = await zoom();

    expect(image).toHaveAttribute("src", rendered.url);
    expect(renderCardImage).toHaveBeenCalledTimes(1);
    expect(renderCardImage.mock.calls[0][0]).toContainElement(
      screen.getByText("Magic Arrow")
    );
  });

  it("shows the image at the pixel size a download would carry", async () => {
    const image = await zoom();

    // The caps that keep it inside the window are the stylesheet's job; the
    // element only has to ask for the render's true size.
    expect(image).toHaveAttribute("width", String(rendered.width));
    expect(image).toHaveAttribute("height", String(rendered.height));
  });

  it("renders the card rather than the preview, so the zoom matches the file", async () => {
    await zoom();

    const [node] = renderCardImage.mock.calls[0];
    expect(node.querySelector("button")).toBeNull();
  });

  it("closes on a click anywhere over the image", async () => {
    const image = await zoom();

    await userEvent.click(image);

    expect(screen.queryByRole("img")).toBeNull();
  });

  it("closes on a click on the backdrop around the image", async () => {
    const image = await zoom();

    await userEvent.click(image.parentElement as HTMLElement);

    expect(screen.queryByRole("img")).toBeNull();
  });

  it("closes on Escape", async () => {
    await zoom();

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("img")).toBeNull();
  });

  it("opens from the keyboard, so the zoom is not mouse-only", async () => {
    render(
      <DownloadableCard filename="spell-front">
        <p />
      </DownloadableCard>
    );

    preview().focus();
    await userEvent.keyboard("{Enter}");

    expect(await screen.findByRole("img")).toBeInTheDocument();
  });

  it("releases the object URL once the image is closed", async () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL");

    const image = await zoom();
    expect(revoke).not.toHaveBeenCalled();

    await userEvent.click(image);

    expect(revoke).toHaveBeenCalledWith(rendered.url);
  });

  it("ignores further clicks while the render is still running", async () => {
    let finish: (image: typeof rendered) => void = () => {};
    renderCardImage.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      })
    );

    render(
      <DownloadableCard filename="spell-front">
        <p />
      </DownloadableCard>
    );

    await userEvent.click(preview());
    await userEvent.click(preview());
    expect(renderCardImage).toHaveBeenCalledTimes(1);

    finish(rendered);
    expect(await screen.findByRole("img")).toBeInTheDocument();
  });

  it("stays closed, saying nothing of its own, when the render fails", async () => {
    // renderCardImage reports the failure itself and answers with null.
    renderCardImage.mockResolvedValue(null);

    render(
      <DownloadableCard filename="spell-front">
        <p />
      </DownloadableCard>
    );

    await userEvent.click(preview());

    expect(screen.queryByRole("img")).toBeNull();
  });

  it("does not export the card when the preview is only zoomed", async () => {
    await zoom();

    expect(downloadCardWebp).not.toHaveBeenCalled();
  });

  it("does not zoom the card when the download button is clicked", async () => {
    render(
      <DownloadableCard filename="spell-front">
        <p />
      </DownloadableCard>
    );

    await userEvent.click(button());

    expect(renderCardImage).not.toHaveBeenCalled();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
