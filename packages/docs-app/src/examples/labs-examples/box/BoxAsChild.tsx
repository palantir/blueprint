import { H4 } from "@blueprintjs/core";
import { Box } from "@blueprintjs/labs";

export default function BoxAsChild() {
    return (
        <Box asChild={true} marginYEnd={0}>
            <H4>This heading has no margin.</H4>
        </Box>
    );
}
