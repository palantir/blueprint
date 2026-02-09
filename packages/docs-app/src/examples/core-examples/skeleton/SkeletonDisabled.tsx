import { Classes } from "@blueprintjs/core";

export default function SkeletonDisabled() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button type="button" className={`${Classes.SKELETON}`} disabled={true}>
                Disabled button
            </button>
            <input className={Classes.SKELETON} tabIndex={-1} placeholder="Input with tabIndex -1" />
            <a className={Classes.SKELETON} href="#" tabIndex={-1}>
                Anchor with tabIndex -1
            </a>
        </div>
    );
}
