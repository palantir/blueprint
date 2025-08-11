import { Callout } from "@blueprintjs/core";

export default function CalloutIcon() {
    return (
        <div className="stack" style={{ width: "100%" }}>
            <Callout icon="clean" intent="primary">
                This is a Callout with a custom icon.
            </Callout>
            <Callout icon={false} intent="primary">
                This is a Callout with no icon.
            </Callout>
        </div>
    );
}
