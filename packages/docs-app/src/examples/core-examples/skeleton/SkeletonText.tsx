import { Classes } from "@blueprintjs/core";

export default function SkeletonText() {
    return (
        <div>
            <p className={Classes.SKELETON}>A short line of text.</p>
            <p className={Classes.SKELETON}>
                A longer line of text that demonstrates how the skeleton animation adapts to the width of the content it
                is covering.
            </p>
            <p className={Classes.SKELETON}>Medium length text content.</p>
        </div>
    );
}
