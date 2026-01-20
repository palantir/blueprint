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
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { themes } from "prism-react-renderer";
import { LiveEditor, LiveError, LiveProvider } from "react-live";

import {
    Button,
    Card,
    CardList,
    Classes,
    Code,
    H5,
    Section,
    SectionCard,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { ChevronRight } from "@blueprintjs/icons";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

const DEFAULT_INGREDIENTS = ["Basil", "Olive oil", "Kosher salt", "Garlic", "Pine nuts"];

const generateCode = (
    bordered: boolean,
    compact: boolean,
    interactive: boolean,
    ingredients: string[],
) =>
    `<CardList bordered={${bordered}} compact={${compact}} style={{ maxWidth: 300 }}>
  {${JSON.stringify(ingredients)}.map(ingredient => (
    <Card interactive={${interactive}} key={ingredient}>
      <span>{ingredient}</span>
      <ChevronRight className={Classes.TEXT_MUTED} />
    </Card>
  ))}
</CardList>`;

const parseCode = (code: string) => {
    const borderedMatch = code.match(/bordered=\{(true|false)\}/);
    const compactMatch = code.match(/compact=\{(true|false)\}/);
    const interactiveMatch = code.match(/interactive=\{(true|false)\}/);
    // Parse ingredients array: matches ["item1", "item2", ...]
    const ingredientsMatch = code.match(/\{(\[.*?\])\.map/);
    let ingredients = DEFAULT_INGREDIENTS;
    if (ingredientsMatch) {
        try {
            ingredients = JSON.parse(ingredientsMatch[1]);
        } catch {
            // Keep default if parsing fails
        }
    }
    return {
        bordered: borderedMatch ? borderedMatch[1] === "true" : true,
        compact: compactMatch ? compactMatch[1] === "true" : false,
        interactive: interactiveMatch ? interactiveMatch[1] === "true" : true,
        ingredients,
    };
};

const liveScope = {
    CardList,
    Card,
    Button,
    Section,
    SectionCard,
    Classes,
    ChevronRight,
};

export const CardListPlaygroundExample: React.FC<ExampleProps> = props => {
    const [bordered, setBordered] = useState(true);
    const [compact, setCompact] = useState(false);
    const [interactive, setInteractive] = useState(true);
    const [padded, setPadded] = useState(false);
    const [useScrollableContainer, setUseScrollableContainer] = useState(false);
    const [useSectionContainer, setUseSectionContainer] = useState(false);
    const [ingredients, setIngredients] = useState(DEFAULT_INGREDIENTS);

    // Live editor state
    const [editorCode, setEditorCode] = useState(() =>
        generateCode(bordered, compact, interactive, ingredients),
    );
    const isUpdatingFromToggle = useRef(false);

    // Debounced sync: code -> state (including ingredients)
    const debouncedSyncFromCode = useMemo(
        () =>
            debounce((code: string) => {
                if (isUpdatingFromToggle.current) return;
                const parsed = parseCode(code);
                if (parsed.bordered !== bordered) setBordered(parsed.bordered);
                if (parsed.compact !== compact) setCompact(parsed.compact);
                if (parsed.interactive !== interactive) setInteractive(parsed.interactive);
                // Compare ingredients arrays
                if (JSON.stringify(parsed.ingredients) !== JSON.stringify(ingredients)) {
                    setIngredients(parsed.ingredients);
                }
            }, 400),
        [bordered, compact, interactive, ingredients],
    );

    // Sync: toggles -> code (only for boolean props, not ingredients)
    useEffect(() => {
        isUpdatingFromToggle.current = true;
        setEditorCode(generateCode(bordered, compact, interactive, ingredients));
        // Reset flag after a tick to allow future code edits
        requestAnimationFrame(() => {
            isUpdatingFromToggle.current = false;
        });
    }, [bordered, compact, interactive, ingredients]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => debouncedSyncFromCode.cancel();
    }, [debouncedSyncFromCode]);

    const handleCodeChange = useCallback(
        (newCode: string) => {
            setEditorCode(newCode);
            debouncedSyncFromCode(newCode);
        },
        [debouncedSyncFromCode],
    );

    const options = (
        <>
            <H5>CardList Props</H5>
            <PropCodeTooltip
                disabled={!useSectionContainer}
                content={
                    <span>
                        This example overrides <Code>isBordered</Code> when using a{" "}
                        <Code>Section</Code> container
                    </span>
                }
            >
                <Switch
                    checked={bordered || useSectionContainer}
                    disabled={useSectionContainer}
                    label="Bordered"
                    onChange={handleBooleanChange(setBordered)}
                />
            </PropCodeTooltip>
            <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
            <H5>Card Props</H5>
            <Switch
                checked={interactive}
                label="Interactive"
                onChange={handleBooleanChange(setInteractive)}
            />
            <H5>Layout</H5>
            <Switch
                checked={useSectionContainer}
                labelElement={
                    <span>
                        Use <Code>Section</Code> container
                    </span>
                }
                onChange={handleBooleanChange(setUseSectionContainer)}
            />
            <H5 className={classNames({ [Classes.TEXT_MUTED]: !useSectionContainer })}>
                SectionCard
            </H5>
            <Switch
                disabled={!useSectionContainer}
                checked={padded}
                label="Use padding"
                onChange={handleBooleanChange(setPadded)}
            />
            <Switch
                disabled={!useSectionContainer}
                checked={useScrollableContainer}
                label="Use scrollable container"
                onChange={handleBooleanChange(setUseScrollableContainer)}
            />
        </>
    );

    const list = (
        <CardList bordered={bordered} compact={compact}>
            {ingredients.map(ingredient => (
                <Card interactive={interactive} key={ingredient}>
                    <span>{ingredient}</span>
                    {interactive ? (
                        <ChevronRight className={Classes.TEXT_MUTED} />
                    ) : (
                        <Button
                            intent="primary"
                            size={compact ? "small" : undefined}
                            text="Add"
                            variant="minimal"
                        />
                    )}
                </Card>
            ))}
        </CardList>
    );

    const sectionCardClasses = classNames("docs-section-card", {
        "docs-section-card-limited-height": useScrollableContainer,
    });

    return (
        <>
            {/* Live Editor Section */}
            <div style={{ marginBottom: 20 }}>
                <H5>Live Code Editor</H5>
                <LiveProvider code={editorCode} scope={liveScope} theme={themes.nightOwl}>
                    <LiveEditor
                        onChange={handleCodeChange}
                        style={{
                            fontFamily: "monospace",
                            fontSize: 14,
                            borderRadius: 4,
                        }}
                    />
                    <LiveError style={{ color: "red", marginTop: 10 }} />
                </LiveProvider>
            </div>

            {/* Existing Playground */}
            <Example options={options} {...props}>
                <div>
                    {useSectionContainer ? (
                        <Section title="Traditional pesto" subtitle="Ingredients" compact={compact}>
                            <SectionCard className={sectionCardClasses} padded={padded}>
                                {list}
                            </SectionCard>
                        </Section>
                    ) : (
                        list
                    )}
                </div>
            </Example>
        </>
    );
};
