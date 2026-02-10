import { Button, Classes, InputGroup } from "@blueprintjs/core";

export default function SkeletonInteractive() {
    return (
        <div className="group">
            <Button className={Classes.SKELETON} disabled={true}>
                Disabled button
            </Button>
            <InputGroup className={Classes.SKELETON} disabled={true} placeholder="Disabled input" />
            <a className={Classes.SKELETON} href="#" tabIndex={-1}>
                Link with tabIndex -1
            </a>
        </div>
    );
}
