/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import React from "react";
import ReactDOM from "react-dom";

import * as Classes from "../../common/classes";
import { ValidationMap } from "../../common/context";
import * as Errors from "../../common/errors";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";

export interface PortalProps extends Props {
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

export interface PortalState {
    hasMounted: boolean;
}

export interface PortalContext {
    /** Additional CSS classes to add to all `Portal` elements in this React context. */
    blueprintPortalClassName?: string;
}

const REACT_CONTEXT_TYPES: ValidationMap<PortalContext> = {
    blueprintPortalClassName: (obj: PortalContext, key: keyof PortalContext) => {
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
export class Portal extends React.Component<PortalProps, PortalState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Portal`;

    public static contextTypes = REACT_CONTEXT_TYPES;

    public static defaultProps: PortalProps = {
        container: typeof document !== "undefined" ? document.body : undefined,
    };

    public context: PortalContext = {};

    public state: PortalState = { hasMounted: false };

    private portalElement: HTMLElement | null = null;

    public render() {
        // Only render `children` once this component has mounted in a browser environment, so they are
        // immediately attached to the DOM tree and can do DOM things like measuring or `autoFocus`.
        // See long comment on componentDidMount in https://reactjs.org/docs/portals.html#event-bubbling-through-portals
        if (typeof document === "undefined" || !this.state.hasMounted || this.portalElement === null) {
            return null;
        } else {
            return ReactDOM.createPortal(this.props.children, this.portalElement);
        }
    }

    public componentDidMount() {
        if (!this.props.container) {
            return;
        }
        this.portalElement = this.createContainerElement();
        this.props.container.appendChild(this.portalElement);
        /* eslint-disable-next-line react/no-did-mount-set-state */
        this.setState({ hasMounted: true }, this.props.onChildrenMount);
    }

    public componentDidUpdate(prevProps: PortalProps) {
        // update className prop on portal DOM element
        if (this.portalElement != null && prevProps.className !== this.props.className) {
            if (prevProps.className !== undefined) {
                this.portalElement.classList.remove(prevProps.className);
            }
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
