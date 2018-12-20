/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ITsDocBase } from "documentalist/dist/client";
import { Entry, MenuItem, ThemeConfig } from "docz";
import React from "react";
import { IDocsData } from "./theme/common/context";
import { NavItemRenderer } from "./theme/components/sidebar/navMenu";

export interface IThemeConfig {
    docs?: IDocsData;

    /**
     * Callback invoked to determine if given nav node should *not* be
     * searchable in the navigator. Returning `true` will exclude the item from
     * the navigator search results.
     */
    navigatorExclude?: (menu: MenuItem) => boolean;

    /**
     * Elements to render on the top of the sidebar, above the search box.
     * This typically contains logo, title and navigation links.
     * Use `.docs-nav-title` on an element for proper padding relative to other sidebar elements.
     */
    renderHeader?: (title: string) => React.ReactNode;

    /**
     * An element to place above the documentation, along the top of the viewport.
     * For best results, use a `Banner` from this package.
     */
    renderBanner?: () => JSX.Element;

    /**
     * Elements to render on the bottom of the sidebar, below the nav menu.
     * This typically contains copyright information.
     */
    renderFooter?: () => React.ReactNode;

    /**
     * Callback invoked to render "View source" links in Typescript interfaces.
     * The `href` of the link will be `entry.sourceUrl`.
     * @default "View source"
     */
    renderViewSourceLinkText?: (entry: ITsDocBase) => React.ReactNode;

    /**
     * Callback invoked to render the clickable nav menu items. (Nested menu structure is handled by the library.)
     * The default implementation renders a `NavMenuItem` element, which is exported from this package.
     */
    renderNavMenuItem?: NavItemRenderer;

    /**
     * Callback invoked to render actions for a documentation page.
     * Actions appear in an element in the upper-right corner of the page.
     */
    renderPageActions?: (page: Entry) => React.ReactNode;
}

const { Provider: BlueprintDoczConfig, Consumer } = React.createContext<IThemeConfig>({});
export { BlueprintDoczConfig };

export function withConfig<P>(Type: React.ComponentType<P & IThemeConfig & { title: string }>) {
    return (props: P) => {
        function render(config: IThemeConfig) {
            return <ThemeConfig>{({ title }) => <Type title={title} {...config} {...props} />}</ThemeConfig>;
        }
        return <Consumer>{render}</Consumer>;
    };
}
