/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { Button, MenuItem } from "@blueprintjs/core";
import { CaretDown } from "@blueprintjs/icons";
import { type ItemRenderer, Select, type SelectPopoverProps } from "@blueprintjs/select";

export type CommonDateFnsLocale = "de" | "en-US" | "es" | "fr" | "hi" | "it" | "zh-CN";
export const COMMON_DATE_FNS_LOCALES: CommonDateFnsLocale[] = ["de", "en-US", "es", "fr", "hi", "it", "zh-CN"];
const LOCALE_CODE_TO_NAME: Record<CommonDateFnsLocale, string> = {
    de: "German",
    "en-US": "English (US)",
    es: "Spanish",
    fr: "French",
    hi: "Hindi",
    it: "Italian",
    "zh-CN": "Chinese (China)",
};

export interface DateFnsLocaleSelectProps {
    value: CommonDateFnsLocale;
    onChange: (newValue: CommonDateFnsLocale) => void;
    popoverProps?: SelectPopoverProps["popoverProps"];
}

export const DateFnsLocaleSelect: React.FC<DateFnsLocaleSelectProps> = props => {
    const renderLocaleItem: ItemRenderer<CommonDateFnsLocale> = React.useCallback(
        (locale, { handleClick, handleFocus, modifiers, ref }) => {
            const { matchesPredicate, ...menuItemModifiers } = modifiers;
            if (!matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    {...menuItemModifiers}
                    key={locale}
                    onClick={handleClick}
                    onFocus={handleFocus}
                    ref={ref}
                    roleStructure="listoption"
                    selected={locale === props.value}
                    text={locale}
                    label={LOCALE_CODE_TO_NAME[locale]}
                />
            );
        },
        [props.value],
    );

    return (
        <Select<CommonDateFnsLocale>
            items={COMMON_DATE_FNS_LOCALES}
            itemRenderer={renderLocaleItem}
            onItemSelect={props.onChange}
            popoverProps={{ minimal: true, placement: "bottom-end", ...props.popoverProps }}
        >
            <Button alignText="left" fill={true} rightIcon={<CaretDown />} text={props.value} />
        </Select>
    );
};
