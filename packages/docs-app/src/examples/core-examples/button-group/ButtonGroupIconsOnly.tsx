import { Button, ButtonGroup } from "@blueprintjs/core";

export default function ButtonGroupIconsOnly() {
    return (
        <ButtonGroup>
            <Button icon="bold" aria-label="Bold" />
            <Button icon="italic" aria-label="Italic" />
            <Button icon="underline" aria-label="Underline" />
        </ButtonGroup>
    );
}
