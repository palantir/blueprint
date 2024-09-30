/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import React from "react";

import { Classes, DISPLAYNAME_PREFIX } from "../../common";

import type { BoxProps } from "./boxProps";
import { buildStyles } from "./buildStyles";

export const Box = <T extends React.ElementType = "div">({ as, className, ...props }: BoxProps<T>) => {
    const Component = as ?? "div";
    const { generatedClassNames, passThroughProps } = React.useMemo(() => buildStyles(props), [props]);
    return <Component {...passThroughProps} className={classNames(Classes.BOX, className, generatedClassNames)} />;
};

Box.displayName = `${DISPLAYNAME_PREFIX}.Box`;
