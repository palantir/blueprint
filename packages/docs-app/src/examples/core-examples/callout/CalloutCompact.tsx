import { Callout } from "@blueprintjs/core";

export default function CalloutCompact() {
    return (
        <div className="stack" style={{ width: "100%" }}>
            <Callout>This is a Callout with default padding.</Callout>
            <Callout compact={true}>This Callout is more compact.</Callout>
        </div>
    );
}
