import { Divider } from "@blueprintjs/core";

export default function DividerWithText() {
    return (
        <div>
            Content above
            <Divider>OR</Divider>
            Content below
            <Divider>Section Break</Divider>
            More content
        </div>
    );
}
