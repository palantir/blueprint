import { IKssExample, IKssModifier } from "documentalist/dist/plugins";
import * as React from "react";
import { ModifierTable } from "../components/modifierTable";

const MODIFIER_PLACEHOLDER = /\{\{([\.\:]?)modifier\}\}/g;
const DEFAULT_MODIFIER: IKssModifier = {
    documentation: "Default",
    name: "default",
};

export const CssExample: React.SFC<IKssExample> = ({ markup, markupHtml, modifiers, reference }) => (
    <div>
        {modifiers.length > 0 ? <ModifierTable modifiers={modifiers} /> : undefined}
        <div className="kss-example-wrapper" data-reference={reference}>
            {renderMarkupForModifier(markup, DEFAULT_MODIFIER)}
            {modifiers.map((mod) => renderMarkupForModifier(markup, mod))}
        </div>
        <div className="kss-markup" dangerouslySetInnerHTML={{ __html: markupHtml }} />
    </div>
);

function renderMarkupForModifier(markup: string, modifier: IKssModifier) {
    const { name } = modifier;
    const html = markup.replace(MODIFIER_PLACEHOLDER, (_, prefix) => {
        if (prefix && name.charAt(0) === prefix) {
            return name.slice(1);
        } else if (!prefix) {
            return name;
        } else {
            return "";
        }
    });
    return (
        <div className="kss-example" data-modifier={modifier.name} key={modifier.name}>
            <code>{modifier.name}</code>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}
