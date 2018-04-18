/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { HTMLDivProps, IProps } from "../../common/props";

export interface IPortalProps extends IProps, HTMLDivProps {
    /**
     * Callback invoked when the children of this `Portal` have been added to the DOM.
     */
    onChildrenMount?: () => void;
}

export interface IPortalState {
    hasMounted: boolean;
}

export interface IPortalContext {
    /** Additional CSS classes to add to all `Portal` elements in this React context. */
    blueprintPortalClassName?: string;
}

const REACT_CONTEXT_TYPES: React.ValidationMap<IPortalContext> = {
    blueprintPortalClassName: (obj: IPortalContext, key: keyof IPortalContext) => {
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
export class Portal extends React.Component<IPortalProps, IPortalState> {
    public static displayName = "Blueprint2.Portal";
    public static contextTypes = REACT_CONTEXT_TYPES;

    public context: IPortalContext;
    public state: IPortalState = { hasMounted: false };

    private portalElement: HTMLElement;

    public render() {
        // Only render `children` once this component has mounted in a browser environment, so they are
        // immediately attached to the DOM tree and can do DOM things like measuring or `autoFocus`.
        // See long comment on componentDidMount in https://reactjs.org/docs/portals.html#event-bubbling-through-portals
        if (typeof document === "undefined" || !this.state.hasMounted) {
            return null;
        } else {
            return ReactDOM.createPortal(this.props.children, this.portalElement);
        }
    }

    public componentDidMount() {
        this.portalElement = this.createContainerElement();
        document.body.appendChild(this.portalElement);
        this.setState({ hasMounted: true }, this.props.onChildrenMount);
    }

    public componentDidUpdate(prevProps: IPortalProps) {
        // update className prop on portal DOM element
        if (this.portalElement != null && prevProps.className !== this.props.className) {
            this.portalElement.classList.remove(prevProps.className);
            maybeAddClass(this.portalElement.classList, this.props.className);
        }
    }

    public componentWillUnmount() {
        if (this.portalElement != null) {
            this.portalElement.remove();
        }
    }

    private createContainerElement() {
        const container = document.createElement("div");
        container.classList.add(Classes.PORTAL);
        maybeAddClass(container.classList, this.props.className);
        if (this.context != null) {
            maybeAddClass(container.classList, this.context.blueprintPortalClassName);
        }
        return container;
    }
}

function maybeAddClass(classList: DOMTokenList, className?: string) {
    if (className != null && className !== "") {
        classList.add(...className.split(" "));
    }
}
