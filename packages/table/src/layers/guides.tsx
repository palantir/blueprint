/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { IProps, Utils as CoreUtils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import * as Classes from "../common/classes";

export interface IGuideLayerProps extends IProps {
    /**
     *  The left-offset location of the vertical guides
     */
    verticalGuides?: number[];

    /**
     *  The top-offset location of the horizontal guides
     */
    horizontalGuides?: number[];
}

export class GuideLayer extends React.Component<IGuideLayerProps, {}> {
    public shouldComponentUpdate(nextProps: IGuideLayerProps) {
        if (this.props.className !== nextProps.className) {
            return true;
        }
        // shallow-comparing guide arrays leads to tons of unnecessary re-renders, so we check the
        // array contents explicitly.
        return (
            !CoreUtils.arraysEqual(this.props.verticalGuides, nextProps.verticalGuides) ||
            !CoreUtils.arraysEqual(this.props.horizontalGuides, nextProps.horizontalGuides)
        );
    }

    public render() {
        const { verticalGuides, horizontalGuides, className } = this.props;
        const verticals = verticalGuides == null ? undefined : verticalGuides.map(this.renderVerticalGuide);
        const horizontals = horizontalGuides == null ? undefined : horizontalGuides.map(this.renderHorizontalGuide);
        return (
            <div className={classNames(className, Classes.TABLE_OVERLAY_LAYER)}>
                {verticals}
                {horizontals}
            </div>
        );
    }

    private renderVerticalGuide = (offset: number, index: number) => {
        const style: React.CSSProperties = {
            left: `${offset}px`,
        };
        const className = classNames(Classes.TABLE_OVERLAY, Classes.TABLE_VERTICAL_GUIDE, {
            [`${Classes.TABLE_VERTICAL_GUIDE}-flush-left`]: offset === 0,
        });
        return <div className={className} key={index} style={style} />;
    };

    private renderHorizontalGuide = (offset: number, index: number) => {
        const style: React.CSSProperties = {
            top: `${offset}px`,
        };
        const className = classNames(Classes.TABLE_OVERLAY, Classes.TABLE_HORIZONTAL_GUIDE, {
            [`${Classes.TABLE_HORIZONTAL_GUIDE}-flush-top`]: offset === 0,
        });
        return <div className={className} key={index} style={style} />;
    };
}
