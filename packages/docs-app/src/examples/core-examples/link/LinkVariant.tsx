import { Link } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";

export default function LinkVariant() {
    return (
        <Flex gap={2}>
            <Link href="https://blueprintjs.com" variant="underline">
                Underline
            </Link>
            <Link href="https://blueprintjs.com" variant="plain">
                Plain
            </Link>
        </Flex>
    );
}
