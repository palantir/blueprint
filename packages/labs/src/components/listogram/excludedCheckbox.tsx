/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import classNames from "classnames";
import * as React from "react";

import { Checkbox, type CheckboxProps, Icon, Tag } from "@blueprintjs/core";

import { LISTOGRAM_ITEM_EXCLUDED, LISTOGRAM_ITEM_EXCLUDED_CHECKBOX } from "./listogramClasses";

type IExcludedCheckboxProps = Pick<
    CheckboxProps,
    "checked" | "className" | "disabled" | "indeterminate" | "label"
> & {
    onClick?: React.MouseEventHandler<HTMLElement>;
};

/** When selected, renders a checkbox with a cross (instead of a tick). */
export class ExcludedCheckbox extends React.Component<IExcludedCheckboxProps> {
    public render() {
        const { checked, className, disabled, indeterminate, label, onClick } = this.props;

        if (checked || indeterminate) {
            // N.B. our Listogram and MultiListogram components don't actually use this label prop
            // (they construct their own JSX for the label name), but we support it here for consistency
            // with the <Checkbox> component. This CSS class just applies a text strikethrough.
            const maybeLabel =
                label === undefined ? undefined : <span className={LISTOGRAM_ITEM_EXCLUDED}>{label}</span>;

            return (
                <>
                    <Tag
                        className={classNames(LISTOGRAM_ITEM_EXCLUDED_CHECKBOX, className)}
                        minimal={disabled}
                        onClick={disabled ? undefined : onClick}
                    >
                        <Icon icon={checked ? "cross" : "minus"} size={10} />
                    </Tag>
                    {maybeLabel}
                </>
            );
        }

        return <Checkbox {...this.props} />;
    }
}
