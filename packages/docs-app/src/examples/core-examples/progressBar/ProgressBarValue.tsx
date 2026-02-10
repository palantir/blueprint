import { ProgressBar } from "@blueprintjs/core";

export default function ProgressBarValue() {
    return (
        <div className="group" style={{ width: "100%" }}>
            <ProgressBar value={0.25} />
            <ProgressBar value={0.5} />
            <ProgressBar value={0.75} />
            <ProgressBar value={1} />
        </div>
    );
}
