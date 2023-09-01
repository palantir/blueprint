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

import { ItemRenderer, Select } from "@blueprintjs/select";
import { CaretDown } from "@blueprintjs/icons";
import { Button, MenuItem } from "@blueprintjs/core";

export type CommonLocale = "de" | "en-US" | "es" | "fr" | "hi" | "it" | "zh-CN";
export const COMMON_LOCALES: CommonLocale[] = ["de", "en-US", "es", "fr", "hi", "it", "zh-CN"];
const LOCALE_CODE_TO_NAME: Record<CommonLocale, string> = {
    de: "German",
    "en-US": "English (US)",
    es: "Spanish",
    fr: "French",
    hi: "Hindi",
    it: "Italian",
    "zh-CN": "Chinese (China)",
};

export interface LocaleSelectProps {
    value: CommonLocale;
    onChange: (newValue: CommonLocale) => void;
}

export const LocaleSelect: React.FC<LocaleSelectProps> = (props) => {
    const renderLocaleItem: ItemRenderer<CommonLocale> = React.useCallback((locale, { handleClick, handleFocus, modifiers, ref }) => {
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
    }, [props.value]);

    return (
        <Select<CommonLocale>
            items={COMMON_LOCALES}
            itemRenderer={renderLocaleItem}
            onItemSelect={props.onChange}
            popoverProps={{ minimal: true, placement: "bottom-end" }}
        >
            <Button alignText="left" fill={true} rightIcon={<CaretDown />} text={props.value} />
        </Select>
    );
}
