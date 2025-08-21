/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

import {
    AnchorButton,
    Button,
    type ButtonVariant,
    Code,
    Divider,
    H5,
    Intent,
    type Size,
    Switch,
    TextAlignment,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { IntentSelect } from "./common/intentSelect";
import { SizeSelect } from "./common/sizeSelect";
import { TextAlignmentSelect } from "./common/textAlignmentSelect";
import { VariantSelect } from "./common/variantSelect";

export const ButtonPlaygroundExample: React.FC<ExampleProps> = props => {
    const [active, setActive] = useState(false);
    const [alignText, setAlignText] = useState<TextAlignment>(TextAlignment.CENTER);
    const [disabled, setDisabled] = useState(false);
    const [ellipsizeText, setEllipsizeText] = useState(false);
    const [fill, setFill] = useState(false);
    const [iconOnly, setIconOnly] = useState(false);
    const [intent, setIntent] = useState<Intent>(Intent.NONE);
    const [loading, setLoading] = useState(false);
    const [longText, setLongText] = useState(false);
    const [size, setSize] = useState<Size>("medium");
    const [variant, setVariant] = useState<ButtonVariant>("solid");
    const [wiggling, setWiggling] = useState(false);

    const wiggleTimeoutId = useRef<number>();

    useEffect(() => {
        return () => window.clearTimeout(wiggleTimeoutId.current);
    }, []);

    const beginWiggling = useCallback(() => {
        window.clearTimeout(wiggleTimeoutId.current);
        setWiggling(true);
        wiggleTimeoutId.current = window.setTimeout(() => setWiggling(false), 300);
    }, []);

    const wiggleButtonText = iconOnly
        ? undefined
        : longText
          ? "Click to trigger a whimsical wiggling animation"
          : "Click to wiggle";

    const duplicateButtonText = iconOnly
        ? undefined
        : longText
          ? "Duplicate this web page in a new browser tab"
          : "Duplicate this page";

    const options = (
        <>
            <H5>Props</H5>
            <Switch label="Active" checked={active} onChange={handleBooleanChange(setActive)} />
            <Switch
                label="Disabled"
                checked={disabled}
                onChange={handleBooleanChange(setDisabled)}
            />
            <Switch label="Loading" checked={loading} onChange={handleBooleanChange(setLoading)} />
            <Switch label="Fill" checked={fill} onChange={handleBooleanChange(setFill)} />
            <PropCodeTooltip snippet={`ellipsizeText={${ellipsizeText.toString()}}`}>
                <Switch
                    label="Ellipsize long text"
                    checked={ellipsizeText}
                    onChange={handleBooleanChange(setEllipsizeText)}
                />
            </PropCodeTooltip>
            <Divider />
            <VariantSelect onChange={setVariant} variant={variant} />
            <IntentSelect intent={intent} onChange={setIntent} />
            <TextAlignmentSelect align={alignText} onChange={setAlignText} />
            <SizeSelect onChange={setSize} size={size} />
            <H5>Example</H5>
            <Switch
                label="Icons only"
                checked={iconOnly}
                onChange={handleBooleanChange(setIconOnly)}
            />
            <Switch
                label="Long text"
                checked={longText}
                onChange={handleBooleanChange(setLongText)}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <div className={classNames({ "docs-flex-column": fill })}>
                <p>
                    <Code>Button</Code>
                </p>
                <Button
                    active={active}
                    alignText={alignText}
                    className={classNames({ "docs-wiggle": wiggling })}
                    disabled={disabled}
                    ellipsizeText={ellipsizeText}
                    fill={fill}
                    icon={IconNames.REFRESH}
                    intent={intent}
                    loading={loading}
                    onClick={beginWiggling}
                    size={size}
                    text={wiggleButtonText}
                    variant={variant}
                />
            </div>
            <div className={classNames({ "docs-flex-column": fill })}>
                <p>
                    <Code>AnchorButton</Code>
                </p>
                <AnchorButton
                    active={active}
                    alignText={alignText}
                    disabled={disabled}
                    ellipsizeText={ellipsizeText}
                    endIcon={IconNames.SHARE}
                    fill={fill}
                    href="#core/components/buttons"
                    icon={IconNames.DUPLICATE}
                    intent={intent}
                    loading={loading}
                    size={size}
                    target="_blank"
                    text={duplicateButtonText}
                    variant={variant}
                />
            </div>
        </Example>
    );
};
