import { ProgressBar } from "@blueprintjs/core";

export default function ProgressBarIntent() {
    return (
        <div className="group" style={{ width: "100%" }}>
            <ProgressBar value={0.7} intent="primary" />
            <ProgressBar value={0.7} intent="success" />
            <ProgressBar value={0.7} intent="warning" />
            <ProgressBar value={0.7} intent="danger" />
        </div>
    );
}
