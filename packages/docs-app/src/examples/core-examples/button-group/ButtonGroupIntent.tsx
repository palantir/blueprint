import { Button, ButtonGroup } from "@blueprintjs/core";

export default function ButtonGroupIntent() {
    return (
        <ButtonGroup>
            <Button intent="success">One</Button>
            <Button intent="primary">Two</Button>
            <Button intent="warning">Three</Button>
            <Button intent="danger">Four</Button>
        </ButtonGroup>
    );
}
