import { Classes, Link } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";

export default function LinkColor() {
    return (
        <Flex gap={2}>
            <Link href="https://blueprintjs.com">Primary</Link>
            <Link href="https://blueprintjs.com" color="success">
                Success
            </Link>
            <Link href="https://blueprintjs.com" color="warning">
                Warning
            </Link>
            <Link href="https://blueprintjs.com" color="danger">
                Danger
            </Link>
            <span className={Classes.TEXT_MUTED}>
                <Link href="https://blueprintjs.com" color="inherit">
                    Inherit
                </Link>
            </span>
        </Flex>
    );
}
