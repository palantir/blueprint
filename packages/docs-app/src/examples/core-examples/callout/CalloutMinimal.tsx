import { Callout } from "@blueprintjs/core";

export default function CalloutMinimal() {
    return (
        <div className="stack" style={{ width: "100%" }}>
            <Callout minimal={true} title="Minimal Callout">
                A minimal Callout with default colors.
            </Callout>
            <Callout minimal={true} intent="primary" title="Minimal Primary">
                A minimal Callout with primary intent.
            </Callout>
        </div>
    );
}
