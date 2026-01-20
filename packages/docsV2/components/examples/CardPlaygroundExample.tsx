"use client";

import { useCallback, useState } from "react";

import { Button, Card, Classes, Elevation, FormGroup, H5, Slider, Switch } from "@blueprintjs/core";

const MAX_ELEVATION = 4;

function handleBooleanChange(handler: (value: boolean) => void) {
    return (event: React.FormEvent<HTMLInputElement>) => handler(event.currentTarget.checked);
}

export function CardPlaygroundExample() {
    const [compact, setCompact] = useState(false);
    const [elevation, setElevation] = useState<Elevation>(Elevation.ZERO);
    const [interactive, setInteractive] = useState(false);
    const [selected, setSelected] = useState(false);

    const handleElevationChange = useCallback((value: number) => setElevation(value as Elevation), []);

    return (
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
            <Card compact={compact} elevation={elevation} interactive={interactive} selected={selected}>
                <H5>Analytical applications</H5>
                <p>
                    User interfaces that enable people to interact smoothly with data, ask better questions, and make
                    better decisions.
                </p>
                <Button text="Explore products" className={Classes.BUTTON} />
            </Card>
            <div style={{ minWidth: 200 }}>
                <H5>Props</H5>
                <Switch checked={interactive} label="Interactive" onChange={handleBooleanChange(setInteractive)} />
                <Switch
                    checked={interactive && selected}
                    disabled={!interactive}
                    label="Selected"
                    onChange={handleBooleanChange(setSelected)}
                />
                <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
                <FormGroup label="Elevation">
                    <Slider
                        handleHtmlProps={{ "aria-label": "card elevation" }}
                        max={MAX_ELEVATION}
                        onChange={handleElevationChange}
                        showTrackFill={false}
                        value={elevation}
                    />
                </FormGroup>
            </div>
        </div>
    );
}
