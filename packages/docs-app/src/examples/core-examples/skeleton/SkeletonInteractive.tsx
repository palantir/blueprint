import { Classes, InputGroup } from "@blueprintjs/core";

export default function SkeletonInteractive() {
    return (
        <div className="group">
            <InputGroup className={Classes.SKELETON} disabled={true} placeholder="Disabled input" />
            <a className={Classes.SKELETON} href="#" tabIndex={-1}>
                Link with tabIndex -1
            </a>
        </div>
    );
}
