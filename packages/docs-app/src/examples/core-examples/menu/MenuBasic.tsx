import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";

export default function MenuBasic() {
    return (
        <Menu>
            <MenuItem icon="new-text-box" text="New text box" />
            <MenuItem icon="new-object" text="New object" />
            <MenuItem icon="new-link" text="New link" />
            <MenuDivider />
            <MenuItem text="Settings..." icon="cog" intent="primary">
                <MenuItem icon="tick" text="Save on edit" />
                <MenuItem icon="blank" text="Compile on edit" />
            </MenuItem>
        </Menu>
    );
}
