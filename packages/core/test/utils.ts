/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * 
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ReactWrapper } from "enzyme";
import { Portal } from "../src";

export function findInPortal(overlay: ReactWrapper, selector: string) {
    // React 16: createPortal preserves React tree so simple find works.
    const element = overlay.find(Portal).find(selector);
    if (element.exists()) {
        return element;
    }

    // React 15: unstable_renderSubtree does not preserve tree so we must create new wrapper.
    const portal = overlay.find(Portal).instance();
    const portalChildren = new ReactWrapper(portal.props.children as JSX.Element[]);
    if (portalChildren.is(selector)) {
        return portalChildren;
    }
    return portalChildren.find(selector);
}
