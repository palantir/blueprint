import { AnchorButton, Tooltip } from "@blueprintjs/core";

export default function ButtonDisabledButtonTooltip() {
    return (
        <Tooltip content="This button is disabled">
            <AnchorButton disabled={true}>Disabled</AnchorButton>
        </Tooltip>
    );
}
