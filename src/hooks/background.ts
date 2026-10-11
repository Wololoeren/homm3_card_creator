import {
  generateBackground,
  renderBorderWithShadow,
  renderSilverBorderWithShadow,
} from "@/lib/colorTransformation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

function useCssUrl(
  generator: (color: string) => Promise<string>,
  color: string,
) {
  const [cssUrl, setCssUrl] = useState("none");
  const [debouncedColor] = useDebounceValue(color, 1000); // 1s debounce

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // The generators cache by colour, so this URL is shared with every other
      // card using the same colour: it must outlive this component and is
      // never revoked here.
      const url = await generator(debouncedColor);
      if (!cancelled) setCssUrl(`url(${url})`);
    })();

    return () => {
      cancelled = true;
    };
  }, [generator, debouncedColor]);

  return cssUrl;
}

export function useBackground(color: string) {
  return useCssUrl(generateBackground, color);
}

export function useBorder(color: string, silver = false) {
  return useCssUrl(
    silver ? renderSilverBorderWithShadow : renderBorderWithShadow,
    color,
  );
}
