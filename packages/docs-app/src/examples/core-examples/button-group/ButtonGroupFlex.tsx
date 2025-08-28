import { Button, ButtonGroup } from "@blueprintjs/core";

export default function ButtonGroupFlex() {
    return (
        <div className="stack">
            <ButtonGroup fill={true}>
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
            </ButtonGroup>
            <ButtonGroup fill={true}>
                <Button fill={true} intent="primary">
                    Select one
                </Button>
                <Button icon="caret-down" intent="primary" aria-label="More" />
            </ButtonGroup>
        </div>
    );
}
