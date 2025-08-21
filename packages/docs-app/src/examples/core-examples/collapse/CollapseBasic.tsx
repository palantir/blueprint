import { useState } from "react";

import { Button, Classes, Collapse } from "@blueprintjs/core";

export default function CollapseBasic() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="stack center">
            <Button intent="primary" onClick={() => setIsOpen(prev => !prev)}>
                {isOpen ? "Hide Details" : "Show Details"}
            </Button>
            <Collapse isOpen={isOpen}>
                <p>
                    This is an example of collapsible content. It could include detailed
                    explanations, extra information, or supporting text for the primary content on
                    the page. When expanded, the content is fully visible and takes up space in the
                    document layout. When collapsed, it smoothly slides out of view.
                </p>
            </Collapse>
            <p className={Classes.TEXT_MUTED}>
                This is content below the collapse. It remains in the document flow and adjusts its
                position as the collapse opens and closes.
            </p>
        </div>
    );
}
