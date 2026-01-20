"use client";

import { Button, Card, Classes, H5 } from "@blueprintjs/core";

export interface CardStoryProps {
    /** Controls shadow depth (0-4) */
    elevation?: 0 | 1 | 2 | 3 | 4;
    /** Makes the card respond to hover/click */
    interactive?: boolean;
    /** Indicates selection state */
    selected?: boolean;
    /** Reduces visual padding */
    compact?: boolean;
}

export function CardStory({ elevation = 0, interactive, selected, compact }: CardStoryProps) {
    return (
        <div style={{ padding: 10 }}>
            <Card elevation={elevation} interactive={interactive} selected={selected} compact={compact}>
                <H5>Analytical applications</H5>
                <p>
                    User interfaces that enable people to interact smoothly with data, ask better questions,
                    and make better decisions.
                </p>
                <Button text="Explore products" className={Classes.BUTTON} />
            </Card>
        </div>
    );
}
