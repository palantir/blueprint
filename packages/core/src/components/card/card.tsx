/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";

export type ElevationSize = 0 | 1 | 2 | 3 | 4;

export interface ICardProps extends IProps {
    /**
     * Elevation size of drop shadow that simulates card's height in the UI.
     * @default 0
     */
    elevation?: ElevationSize;

    /**
     * Whether card on hover should change mouse to a pointer
     * and the elevation shadow on the card increases by two levels.
     * @default false
     */
    interactive?: boolean;

    /**
     * If set to `true`, all of the card's children will be converted into [skeletons](#core/components/progress/skeleton).
     * @default false
     */
    loading?: boolean;

    /**
     * The callback invoked when user clicks on card.
     * Highly recommended if card is interactive.
     */
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

@PureRender
export class Card extends React.Component<ICardProps, {}> {
    public static displayName = "Blueprint.Card";

    public render() {
        return (
            <div className={this.getClassName()} onClick={this.handleClick}>
                {this.renderChildren()}
            </div>
        );
    }

    private handleClick = (e: React.MouseEvent<HTMLElement>) => {
        safeInvoke(this.props.onClick, e);
    };

    private renderChildren() {
        const { children, loading } = this.props;

        return React.Children.map(children, (child: React.ReactChild) => {
            if (!loading) {
                return child;
            }

            return this.convertToElement(child);
        });
    }

    private convertToElement(child: React.ReactChild): React.ReactElement<any> {
        if (typeof child === "string" || typeof child === "number") {
            return <p className={Classes.SKELETON}>{child}</p>;
        }

        const childrenOfChild = child.props.children;

        if (React.isValidElement(childrenOfChild)) {
            return this.cloneElement(child, {
                children: this.convertToElement(childrenOfChild),
            });
        } else if (childrenOfChild && childrenOfChild.map) {
            return this.cloneElement(child, {
                children: childrenOfChild.map(this.convertToElement.bind(this)),
            });
        }

        return this.cloneElement(child, {
            className: classNames(child.props.className, Classes.SKELETON),
        });
    }

    private cloneElement(element: React.ReactElement<any>, propsToOverwrite = {}) {
        return React.cloneElement(element, { ...element.props, ...propsToOverwrite, tabIndex: "-1" });
    }

    private getClassName() {
        const { elevation, interactive } = this.props;
        return classNames(
            Classes.CARD,
            {
                [Classes.INTERACTIVE]: interactive,
                [Classes.ELEVATION_0]: elevation === 0,
                [Classes.ELEVATION_1]: elevation === 1,
                [Classes.ELEVATION_2]: elevation === 2,
                [Classes.ELEVATION_3]: elevation === 3,
                [Classes.ELEVATION_4]: elevation === 4,
            },
            this.props.className,
        );
    }
}
