/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { IProps } from "../../common/props";

export interface IPortalProps extends IProps, React.HTMLAttributes<HTMLDivElement> {
    /**
     * A React `ref` handler callback for the detached container root element.
     * As this component renders its contents into a separate container, the result of the `ref`
     * prop is not backed by a DOM node. Hence this callback is necessary to get the real DOM node.
     */
    containerRef?: (ref: HTMLDivElement) => void;

   /**
    * Callback invoked when the children of this `Portal` have been added to the DOM.
    */
    onChildrenMount?: () => void;

    /**
     * CSS class name to add to the detached container root element.
     * This prop is complementary to the `blueprintPortalClassName` context property:
     * both can be used at the same time.
     */
    portalClassName?: string;
}

export interface IPortalContext {
    /** Additional class to add to portal element */
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
export class Portal extends React.Component<IPortalProps, {}> {
    public static displayName = "Blueprint.Portal";
    public static contextTypes = REACT_CONTEXT_TYPES;
    public context: IPortalContext;

    private targetElement: HTMLElement;

    public render() {
        return null as JSX.Element;
    }

    public componentDidMount() {
        const targetElement = document.createElement("div");
        maybeAddClasses(targetElement,
            Classes.PORTAL, this.props.portalClassName, this.context.blueprintPortalClassName);

        document.body.appendChild(targetElement);
        this.targetElement = targetElement;
        this.componentDidUpdate();
    }

    public componentDidUpdate() {
        // NOTE: children is included in htmlProps
        const { containerRef, onChildrenMount, portalClassName, ...htmlProps } = this.props;
        // use special render function to preserve React context, in case children need it
        ReactDOM.unstable_renderSubtreeIntoContainer(
            /* parentComponent */ this,
            <div {...htmlProps} ref={containerRef} />,
            this.targetElement,
            onChildrenMount,
        );
    }

    public componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.targetElement);
        this.targetElement.remove();
    }
}

function maybeAddClasses(element: Element, ...classes: Array<string | undefined>) {
    element.classList.add(...classes.filter((cls) => cls != null));
}
