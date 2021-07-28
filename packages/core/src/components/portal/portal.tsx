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

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Classes from "../../common/classes";
import { ValidationMap } from "../../common/context";
import * as Errors from "../../common/errors";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";
import { isFunction } from "../../common/utils";

/** Detect if `React.createPortal()` API method does not exist. */
const cannotCreatePortal = !isFunction(ReactDOM.createPortal);

export type PortalProps = IPortalProps;
export interface IPortalProps extends Props {
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

export interface IPortalState {
    hasMounted: boolean;
}

export interface IPortalContext {
    /** Additional CSS classes to add to all `Portal` elements in this React context. */
    blueprintPortalClassName?: string;
}

const REACT_CONTEXT_TYPES: ValidationMap<IPortalContext> = {
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
    public static displayName = `${DISPLAYNAME_PREFIX}.Portal`;

    public static contextTypes = REACT_CONTEXT_TYPES;

    public static defaultProps: IPortalProps = {
        container: typeof document !== "undefined" ? document.body : undefined,
    };

    public context: IPortalContext = {};

    public state: IPortalState = { hasMounted: false };

    private portalElement: HTMLElement | null = null;

    public render() {
        // Only render `children` once this component has mounted in a browser environment, so they are
        // immediately attached to the DOM tree and can do DOM things like measuring or `autoFocus`.
        // See long comment on componentDidMount in https://reactjs.org/docs/portals.html#event-bubbling-through-portals
        if (
            cannotCreatePortal ||
            typeof document === "undefined" ||
            !this.state.hasMounted ||
            this.portalElement === null
        ) {
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
        if (cannotCreatePortal) {
            this.unstableRenderNoPortal();
        }
    }

    public componentDidUpdate(prevProps: IPortalProps) {
        // update className prop on portal DOM element
        if (this.portalElement != null && prevProps.className !== this.props.className) {
            maybeRemoveClass(this.portalElement.classList, prevProps.className);
            maybeAddClass(this.portalElement.classList, this.props.className);
        }

        if (cannotCreatePortal) {
            this.unstableRenderNoPortal();
        }
    }

    public componentWillUnmount() {
        if (this.portalElement != null) {
            if (cannotCreatePortal) {
                ReactDOM.unmountComponentAtNode(this.portalElement);
            }
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

    private unstableRenderNoPortal() {
        if (this.portalElement === null) {
            return;
        }
        ReactDOM.unstable_renderSubtreeIntoContainer(
            /* parentComponent */ this,
            <div>{this.props.children}</div>,
            this.portalElement,
        );
    }
}

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
