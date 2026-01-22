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

import type { Tag } from "@documentalist/client";
import * as React from "react";
import { useCallback, useState } from "react";

import { AnchorButton, Button, ButtonGroup, Spinner } from "@blueprintjs/core";
import { Fullscreen } from "@blueprintjs/icons";

export interface StorybookTagRendererConfig {
    /**
     * Base URL for the Storybook instance.
     * In development, this is typically http://localhost:6006
     * In production, this could be a deployed Storybook URL.
     */
    baseUrl: string;
}

/**
 * Renderer for the @storybook tag, which embeds a Storybook story in an iframe.
 *
 * Usage in markdown:
 *   @storybook core-callout--basic
 *   @storybook core-callout--basic,core-callout--with-intent,core-callout--compact
 *
 * The value should be the story ID (visible in the Storybook URL as ?path=/story/{storyId}).
 * Multiple story IDs can be comma-separated to create a tabbed interface.
 */
export class StorybookTagRenderer {
    constructor(private config: StorybookTagRendererConfig) {}

    public render: React.FC<Tag> = ({ value }) => {
        if (value == null || value.trim() === "") {
            return <div className="docs-storybook-error">Error: @storybook tag requires a story ID value.</div>;
        }

        const storyIds = value.split(",").map(id => id.trim());

        return <StorybookEmbed storyIds={storyIds} baseUrl={this.config.baseUrl} />;
    };
}

interface StorybookEmbedProps {
    storyIds: string[];
    baseUrl: string;
}

function StorybookEmbed({ storyIds, baseUrl }: StorybookEmbedProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const activeStoryId = storyIds[activeIndex];
    // Use viewMode=docs to show the story with the controls panel
    const storyUrl = `${baseUrl}/iframe.html?id=${encodeURIComponent(activeStoryId)}&viewMode=docs`;
    const fullStorybookUrl = `${baseUrl}/?path=/story/${encodeURIComponent(activeStoryId)}`;

    const handleLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);
    }, []);

    const handleStoryChange = useCallback((index: number) => {
        setActiveIndex(index);
        setIsLoading(true);
        setHasError(false);
    }, []);

    // Extract display name from story ID (e.g., "core-callout--with-intent" -> "With Intent")
    const getDisplayName = (storyId: string) => {
        const parts = storyId.split("--");
        const name = parts[parts.length - 1];
        return name
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    if (hasError) {
        return (
            <div className="docs-storybook-error">
                <p>
                    Failed to load Storybook story: <code>{activeStoryId}</code>
                </p>
                <p>
                    Make sure Storybook is running at <code>{baseUrl}</code>
                </p>
            </div>
        );
    }

    return (
        <div className="docs-storybook-frame">
            {storyIds.length > 1 && (
                <div className="docs-storybook-tabs">
                    <ButtonGroup>
                        {storyIds.map((storyId, index) => (
                            <Button
                                key={storyId}
                                text={getDisplayName(storyId)}
                                active={index === activeIndex}
                                onClick={() => handleStoryChange(index)}
                            />
                        ))}
                    </ButtonGroup>
                </div>
            )}
            {isLoading && (
                <div className="docs-storybook-loading">
                    <Spinner size={24} />
                    <span>Loading Storybook...</span>
                </div>
            )}
            <iframe
                key={activeStoryId}
                className="docs-storybook-iframe"
                src={storyUrl}
                title={`Storybook: ${activeStoryId}`}
                onLoad={handleLoad}
                onError={handleError}
                style={{ display: isLoading ? "none" : "block" }}
            />
            <div className="docs-storybook-toolbar">
                <AnchorButton
                    icon={<Fullscreen />}
                    href={fullStorybookUrl}
                    target="_blank"
                    text="Open in Storybook"
                    variant="minimal"
                />
            </div>
        </div>
    );
}
