/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import {
    Alignment,
    AnchorButton,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Switch,
} from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

import blueprintLogo from "../assets/blueprint-logo.png";

interface NavigationProps {
    darkTheme: boolean;
    onToggleDarkTheme: () => void;
}

export const Navigation = ({ darkTheme, onToggleDarkTheme }: NavigationProps) => {
    return (
        <Navbar className={Classes.DARK}>
            <NavbarGroup align={Alignment.START}>
                <Flex asChild={true} alignItems="center" gap={2}>
                    <NavbarHeading>
                        <img alt="Blueprint logo" height={20} src={blueprintLogo} width={20} />
                        <span>Icon Playground</span>
                    </NavbarHeading>
                </Flex>
            </NavbarGroup>
            <NavbarGroup align={Alignment.END}>
                <NavbarDivider />
                <AnchorButton
                    endIcon="share"
                    href="http://blueprintjs.com/docs"
                    target="_blank"
                    text="Docs"
                    variant="minimal"
                />
                <AnchorButton
                    endIcon="code"
                    href="http://github.com/palantir/blueprint"
                    target="_blank"
                    text="Github"
                    variant="minimal"
                />
                <NavbarDivider />
                <Box asChild={true} marginBottom={0}>
                    <Switch
                        checked={darkTheme}
                        className="dark-theme-switch"
                        label="Dark theme"
                        onChange={onToggleDarkTheme}
                    />
                </Box>
            </NavbarGroup>
        </Navbar>
    );
};
