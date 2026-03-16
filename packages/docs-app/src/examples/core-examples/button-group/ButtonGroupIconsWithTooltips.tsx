import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";

export default function ButtonGroupIconsWithTooltips() {
    return (
        <ButtonGroup>
            <Tooltip content="Save" placement="bottom">
                <Button icon="floppy-disk" aria-label="Save" />
            </Tooltip>
            <Tooltip content="Export as PDF" placement="bottom">
                <Button icon="export" aria-label="Export as PDF" />
            </Tooltip>
            <Tooltip content="Archive" placement="bottom">
                <Button icon="archive" aria-label="Archive" />
            </Tooltip>
        </ButtonGroup>
    );
}
