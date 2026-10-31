import { Classes, H3, H5 } from "@blueprintjs/core";

export default function SkeletonText() {
    return (
        <div>
            <H3 className={Classes.SKELETON}>Large heading placeholder</H3>
            <H5 className={Classes.SKELETON}>Smaller heading placeholder</H5>
            <p className={Classes.SKELETON}>
                This paragraph contains placeholder text that defines the width and height of the
                skeleton. The more text provided, the larger the skeleton area.
            </p>
            <p className={Classes.SKELETON}>Short text.</p>
        </div>
    );
}
