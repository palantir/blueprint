import { Menu, MenuItem } from "@blueprintjs/core";

export default function MenuSubmenu() {
    return (
        <Menu>
            <MenuItem text="Submenu">
                <MenuItem text="Child one" />
                <MenuItem text="Child two" />
                <MenuItem text="Child three" />
            </MenuItem>
        </Menu>
    );
}
