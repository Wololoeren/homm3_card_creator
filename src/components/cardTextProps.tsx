import { TextToComponentProps } from "@/lib/textToComponent";
import SpellEffect from "./SpellEffect";
import UnitStats from "./UnitStats";

/**
 * How every card draws the structured tokens in its text. Shared so a power
 * table or a stat row typed into any card's effect is drawn, rather than
 * left as an error for the cards that happened not to wire one up.
 */
export const cardTextProps: TextToComponentProps = {
  renderSpell: (props) => <SpellEffect {...props} />,
  renderUnitStats: (props) => <UnitStats {...props} />,
};
