/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Classes from "../../common/classes";
import { IProps, removeNonHTMLProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";

export interface IPortalProps extends IProps, React.HTMLProps<HTMLDivElement> {
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
}

/**
 * This component detaches its contents and re-attaches them to document.body.
 * Use it when you need to circumvent DOM z-stacking (for dialogs, popovers, etc.).
 * Any class names passed to this element will be propagated to the new container element on document.body.
 */
export class Portal extends React.Component<IPortalProps, {}> {
    public displayName = "Blueprint.Portal";
    private targetElement: HTMLElement;

    public render() {
        return null as JSX.Element;
    }

    public componentDidMount() {
        const targetElement = document.createElement("div");
        targetElement.classList.add(Classes.PORTAL);
        document.body.appendChild(targetElement);
        this.targetElement = targetElement;
        this.componentDidUpdate();
    }

    public componentDidUpdate() {
        // use special render function to preserve React context, in case children need it
        ReactDOM.unstable_renderSubtreeIntoContainer(
            /* parentComponent */ this,
            <div {...removeNonHTMLProps(this.props)} ref={this.props.containerRef}>
                {this.props.children}
            </div>,
            this.targetElement,
            () => safeInvoke(this.props.onChildrenMount)
        );
    }

    public componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.targetElement);
        this.targetElement.remove();
    }
}
