import { ProgressBar } from "@blueprintjs/core";

export default function ProgressBarAnimate() {
    return (
        <div className="group" style={{ width: "100%" }}>
            <ProgressBar value={0.7} />
            <ProgressBar value={0.7} animate={false} />
        </div>
    );
}
