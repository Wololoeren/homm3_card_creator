import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import SendToPdfButton from "./SendToPdfButton";
import { onPdfCard, type QueuedCard } from "@/lib/pdfQueue";

const button = () => screen.getByRole("button");

/** Drives the timer the "Added" label runs on. */
const wait = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("SendToPdfButton", () => {
  let sent: QueuedCard[];
  let unsubscribe: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    sent = [];
    unsubscribe = onPdfCard((card) => sent.push(card));
  });

  afterEach(() => {
    unsubscribe();
    vi.useRealTimers();
  });

  // fireEvent rather than userEvent: the latter waits on timers of its own,
  // which the fake clock these tests need would leave hanging.
  const press = () => fireEvent.click(button());

  it("sends the card it was given", () => {
    render(
      <SendToPdfButton
        cardKey="spell"
        name="Bless"
        payload={{ name: "Bless" }}
      />,
    );

    press();

    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      key: "spell",
      name: "Bless",
      payload: { name: "Bless" },
    });
  });

  it("reports the card was added, then offers to send again", () => {
    render(<SendToPdfButton cardKey="spell" name="Bless" payload={{}} />);
    expect(button()).toHaveTextContent("Send to PDF");

    press();
    expect(button()).toHaveTextContent("Added");

    wait(2000);
    expect(button()).toHaveTextContent("Send to PDF");
  });

  it("restarts the report when pressed again", () => {
    render(<SendToPdfButton cardKey="spell" name="Bless" payload={{}} />);

    press();
    wait(1500);
    press();

    // The first press's two seconds are up, but the second press's are not.
    wait(1000);
    expect(button()).toHaveTextContent("Added");

    wait(1000);
    expect(button()).toHaveTextContent("Send to PDF");
    expect(sent).toHaveLength(2);
  });
});
