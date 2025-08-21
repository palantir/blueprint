import { Button, ButtonGroup } from "@blueprintjs/core";

export default function ButtonGroupVariant() {
    return (
        <div className="stack">
            <ButtonGroup variant="outlined">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
            </ButtonGroup>
            <ButtonGroup variant="minimal">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
            </ButtonGroup>
        </div>
    );
}
