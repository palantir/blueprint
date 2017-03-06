import * as React from "react";

import { IPageData } from "documentalist/dist/client";

export type TagRenderer = (value: string, key: React.Key, page: IPageData) => JSX.Element | undefined;

export interface IPageProps {
    page: IPageData;
    tagRenderers: { [tag: string]: TagRenderer };
}

export const Page: React.SFC<IPageProps> = ({ tagRenderers, page }) => {
    const pageContents = page.contents.map((node, i) => {
        if (typeof node === "string") {
            return <div className="docs-section" dangerouslySetInnerHTML={{ __html: node }} key={i} />;
        }

        // try rendering the tag,
        try {
            const renderer = tagRenderers[node.tag];
            if (renderer === undefined) {
                throw new Error(`Unknown @tag: ${node.tag}`);
            }
            return renderer(node.value, i, page);
        } catch (ex) {
            console.error(ex.message);
            return <h3><code>{ex.message}</code></h3>
        }
    });
    return <div className="docs-page">{pageContents}</div>;
};
