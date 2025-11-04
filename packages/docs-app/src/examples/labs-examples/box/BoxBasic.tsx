import { Colors } from "@blueprintjs/core";
import { Box } from "@blueprintjs/labs";

const boxStyle: React.CSSProperties = {
    backgroundColor: Colors.BLUE3 + "1A",
    borderColor: Colors.BLUE3,
    borderRadius: 2,
    borderStyle: "dashed",
    borderWidth: 1,
};

export default function BoxBasic() {
    return (
        <Box marginX={3} padding={5} style={boxStyle}>
            Content
        </Box>
    );
}
