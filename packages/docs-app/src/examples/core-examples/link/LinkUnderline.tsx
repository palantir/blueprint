import { Link } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";

export default function LinkUnderline() {
    return (
        <Flex gap={2}>
            <Link href="https://blueprintjs.com" underline="always">
                Always
            </Link>
            <Link href="https://blueprintjs.com" underline="hover">
                Hover
            </Link>
            <Link href="https://blueprintjs.com" underline="none">
                None
            </Link>
        </Flex>
    );
}
