/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview This is the next version of <Portal>, reimplemented as a function component.
 *
 * It supports both the newer React context API and the legacy context API. Support for the legacy context API
 * will be removed in Blueprint v6.0.
 *
 * Portal2 is not currently used anywhere in Blueprint. We had to revert the change which updated the standard
 * <Portal> to use this implementation because of subtle breaks caused by interactions with the (long-deprecated)
 * react-hot-loader library. To be safe, we've left Portal as a class component for now, and will promote this Portal2
 * implementation to be the standard Portal in Blueprint v5.0.
 *
 * @see https://github.com/palantir/blueprint/issues/5511
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Classes from "../../common/classes";
import { ValidationMap } from "../../common/context";
import * as Errors from "../../common/errors";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";
import { PortalContext } from "../../context/portal/portalProvider";
import { usePrevious } from "../../hooks/usePrevious";
import type { PortalLegacyContext } from "./portal";

export interface Portal2Props extends Props {
    /** Contents to send through the portal. */
    children: React.ReactNode;

    /**
     * Callback invoked when the children of this `Portal` have been added to the DOM.
     */
    onChildrenMount?: () => void;

    /**
     * The HTML element that children will be mounted to.
     *
     * @default document.body
     */
    container?: HTMLElement;
}

const REACT_CONTEXT_TYPES: ValidationMap<PortalLegacyContext> = {
    blueprintPortalClassName: (obj: PortalLegacyContext, key: keyof PortalLegacyContext) => {
        if (obj[key] != null && typeof obj[key] !== "string") {
            return new Error(Errors.PORTAL_CONTEXT_CLASS_NAME_STRING);
        }
        return undefined;
    },
};

/**
 * This component detaches its contents and re-attaches them to document.body.
 * Use it when you need to circumvent DOM z-stacking (for dialogs, popovers, etc.).
 * Any class names passed to this element will be propagated to the new container element on document.body.
 */
export function Portal2(props: Portal2Props, legacyContext: PortalLegacyContext = {}) {
    const context = React.useContext(PortalContext);

    const [hasMounted, setHasMounted] = React.useState(false);
    const [portalElement, setPortalElement] = React.useState<HTMLElement>();

    const createContainerElement = React.useCallback(() => {
        const container = document.createElement("div");
        container.classList.add(Classes.PORTAL);
        maybeAddClass(container.classList, props.className); // directly added to this portal element
        maybeAddClass(container.classList, context.portalClassName); // added via PortalProvider context

        const { blueprintPortalClassName } = legacyContext;
        if (blueprintPortalClassName != null && blueprintPortalClassName !== "") {
            console.error(Errors.PORTAL_LEGACY_CONTEXT_API);
            maybeAddClass(container.classList, blueprintPortalClassName); // added via legacy context
        }

        return container;
    }, [props.className, context.portalClassName]);

    // create the container element & attach it to the DOM
    React.useEffect(() => {
        if (props.container == null) {
            return;
        }
        const newPortalElement = createContainerElement();
        props.container.appendChild(newPortalElement);
        setPortalElement(newPortalElement);
        setHasMounted(true);

        return () => {
            newPortalElement.remove();
            setHasMounted(false);
            setPortalElement(undefined);
        };
    }, [props.container, createContainerElement]);

    // wait until next successful render to invoke onChildrenMount callback
    React.useEffect(() => {
        if (hasMounted) {
            props.onChildrenMount?.();
        }
    }, [hasMounted, props.onChildrenMount]);

    // update className prop on portal DOM element when props change
    const prevClassName = usePrevious(props.className);
    React.useEffect(() => {
        if (portalElement != null) {
            maybeRemoveClass(portalElement.classList, prevClassName);
            maybeAddClass(portalElement.classList, props.className);
        }
    }, [props.className]);

    // Only render `children` once this component has mounted in a browser environment, so they are
    // immediately attached to the DOM tree and can do DOM things like measuring or `autoFocus`.
    // See long comment on componentDidMount in https://reactjs.org/docs/portals.html#event-bubbling-through-portals
    if (typeof document === "undefined" || !hasMounted || portalElement == null) {
        return null;
    } else {
        return ReactDOM.createPortal(props.children, portalElement);
    }
}
Portal2.defaultProps = {
    container: typeof document !== "undefined" ? document.body : undefined,
};
Portal2.displayName = `${DISPLAYNAME_PREFIX}.Portal2`;
Portal2.contextTypes = REACT_CONTEXT_TYPES;

function maybeRemoveClass(classList: DOMTokenList, className?: string) {
    if (className != null && className !== "") {
        classList.remove(...className.split(" "));
    }
}

function maybeAddClass(classList: DOMTokenList, className?: string) {
    if (className != null && className !== "") {
        classList.add(...className.split(" "));
    }
}
