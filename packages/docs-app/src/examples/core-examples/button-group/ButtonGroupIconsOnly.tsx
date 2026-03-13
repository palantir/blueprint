import { useCallback, useState } from "react";

import { Button, ButtonGroup } from "@blueprintjs/core";

export default function ButtonGroupIconsOnly() {
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [strikethrough, setStrikethrough] = useState(false);

    const handleBold = useCallback(() => setBold(prev => !prev), []);
    const handleItalic = useCallback(() => setItalic(prev => !prev), []);
    const handleUnderline = useCallback(() => setUnderline(prev => !prev), []);
    const handleStrikethrough = useCallback(() => setStrikethrough(prev => !prev), []);

    return (
        <ButtonGroup role="group" aria-label="Text style">
            <Button
                icon="bold"
                aria-label="Bold"
                aria-pressed={bold}
                active={bold}
                onClick={handleBold}
            />
            <Button
                icon="italic"
                aria-label="Italic"
                aria-pressed={italic}
                active={italic}
                onClick={handleItalic}
            />
            <Button
                icon="underline"
                aria-label="Underline"
                aria-pressed={underline}
                active={underline}
                onClick={handleUnderline}
            />
            <Button
                icon="strikethrough"
                aria-label="Strikethrough"
                aria-pressed={strikethrough}
                active={strikethrough}
                onClick={handleStrikethrough}
            />
        </ButtonGroup>
    );
}
