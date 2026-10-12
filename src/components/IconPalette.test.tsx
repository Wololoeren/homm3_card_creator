import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";

// The real map pulls in the SVG artwork, which this has nothing to say about.
vi.mock("@/lib/textToComponent", () => ({
  iconMap: {
    ":gold:": <i data-testid="gold" />,
    ":spell:": <i data-testid="spell" />,
    ":or:": <i data-testid="or" />,
  },
}));

import IconPalette from "./IconPalette";

const field = (id: string) =>
  document.getElementById(id) as HTMLTextAreaElement;
const gold = () => screen.getByRole("button", { name: "Insert :gold:" });

/** Two fields sharing one palette, wired up the way a card form wires them. */
function Form({ first = "one", second = "two" } = {}) {
  const [a, setA] = useState(first);
  const [b, setB] = useState(second);

  return (
    <>
      <textarea id="a" value={a} onChange={(e) => setA(e.target.value)} />
      <textarea id="b" value={b} onChange={(e) => setB(e.target.value)} />
      <IconPalette
        targets={[
          { id: "a", value: a, setValue: setA },
          { id: "b", value: b, setValue: setB },
        ]}
      />
    </>
  );
}

/** A press that leaves the field focused, the way the palette arranges it. */
const press = () => {
  fireEvent.mouseDown(gold());
  fireEvent.click(gold());
};

/** Puts the caret where a click in the field would. */
const caretAt = (id: string, at: number) => {
  field(id).focus();
  field(id).setSelectionRange(at, at);
};

describe("IconPalette", () => {
  it("types the token onto the end of the first field before any is used", () => {
    render(<Form />);

    press();

    expect(field("a")).toHaveValue("one:gold:");
    expect(field("b")).toHaveValue("two");
  });

  it("keeps typing at the caret it left behind", () => {
    render(<Form />);

    // The first press has no caret to go by and lands at the end; the caret it
    // leaves there is what the second one follows.
    press();
    press();

    expect(field("a")).toHaveValue("one:gold::gold:");
  });

  it("types at the caret of the field last worked in", () => {
    render(<Form />);

    caretAt("b", 1);
    press();

    expect(field("b")).toHaveValue("t:gold:wo");
    expect(field("a")).toHaveValue("one");
  });

  it("leaves the caret after what it typed, ready for the next one", () => {
    render(<Form />);

    caretAt("a", 0);
    press();
    press();

    expect(field("a")).toHaveValue(":gold::gold:one");
    expect(field("a").selectionStart).toBe(12);
  });

  it("replaces a selection rather than typing around it", () => {
    render(<Form first="keep this" />);

    caretAt("a", 5);
    field("a").setSelectionRange(5, 9);
    press();

    expect(field("a")).toHaveValue("keep :gold:");
  });

  it("falls back to the first field when the last one is gone", () => {
    const { rerender } = render(<Form />);

    caretAt("b", 0);
    rerender(
      <>
        <textarea id="a" defaultValue="one" />
        <IconPalette
          targets={[{ id: "a", value: "one", setValue: () => {} }]}
        />
      </>,
    );

    expect(gold()).toBeInTheDocument();
    press();
    // Nothing threw and the surviving field is the one that took the icon.
    expect(field("a")).toBeInTheDocument();
  });

  it("types a whole spell table from one button", () => {
    render(<Form />);

    fireEvent.click(
      screen.getByRole("button", { name: "Insert a power table with an icon" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Insert a power table with text" }),
    );

    expect(field("a")).toHaveValue(
      "one:spell{{1;2;3};{1;2;3};{:damage:}}:" +
        ":spell{{1;2;3};{effect 1;effect 2;effect 3}}:",
    );
  });

  it("types a battle table that names its own left-hand icon", () => {
    render(<Form />);

    fireEvent.click(
      screen.getByRole("button", { name: "Insert a event-battle table" }),
    );

    expect(field("a")).toHaveValue(
      "one:scale{{:event_battle:};{1;2;3};{effect 1;effect 2;effect 3}}:",
    );
  });

  it("types a unit stat row", () => {
    render(<Form />);

    fireEvent.click(
      screen.getByRole("button", { name: "Insert a unit stat row" }),
    );

    expect(field("a")).toHaveValue("one:stats{0;0;0;0}:");
  });

  it("leaves :or: off the glyphs, for the divider that replaces it", () => {
    render(<Form />);

    expect(
      screen.queryByRole("button", { name: "Insert :or:" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Insert a divider" }));
    expect(field("a")).toHaveValue("one:divide{OR}:");
  });

  it("types a table with an icon on each side", () => {
    render(<Form />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Insert a table with icons on both sides",
      }),
    );

    expect(field("a")).toHaveValue(
      "one:scale{{:gold:};{1;2;3};{1;2;3};{:valuable:}}:",
    );
  });

  const bold = () =>
    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
  const select = (id: string, start: number, end: number) => {
    field(id).focus();
    field(id).setSelectionRange(start, end);
  };

  it("bolds the selection and keeps it selected", () => {
    render(<Form first="a big hit" />);

    select("a", 2, 5);
    bold();

    expect(field("a")).toHaveValue("a **big** hit");
    expect(field("a").selectionStart).toBe(4);
    expect(field("a").selectionEnd).toBe(7);
  });

  it("types a bold placeholder, selected to type over, with nothing selected", () => {
    render(<Form first="" />);

    select("a", 0, 0);
    bold();

    expect(field("a")).toHaveValue("**Bold**");
    expect(field("a").selectionStart).toBe(2);
    expect(field("a").selectionEnd).toBe(6);
  });

  const heading = () =>
    fireEvent.click(screen.getByRole("button", { name: "Heading" }));

  it("puts a heading on a line of its own", () => {
    render(<Form first="before after" />);

    select("a", 7, 7);
    heading();

    expect(field("a")).toHaveValue("before \n# Heading\nafter");
  });

  it("turns the selected line into a heading without doubling newlines", () => {
    render(<Form first={"one\nTitle\ntwo"} />);

    select("a", 4, 9);
    heading();

    expect(field("a")).toHaveValue("one\n# Title\ntwo");
  });
});
