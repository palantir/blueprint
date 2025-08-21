import { useState } from "react";

import { Button, Collapse, FormGroup, InputGroup } from "@blueprintjs/core";

export default function CollapseMounted() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="stack center">
            <Button onClick={() => setIsOpen(prev => !prev)}>
                {isOpen ? "Hide Form" : "Show Form"}
            </Button>
            <Collapse isOpen={isOpen} keepChildrenMounted={true}>
                <p>
                    This form content stays mounted in the DOM, even when collapsed. This means that
                    any input fields, text areas, or components inside the collapse will maintain
                    their state between toggles.
                </p>
                <form onSubmit={event => event.preventDefault()}>
                    <FormGroup label="Name" labelFor="name">
                        <InputGroup id="name" placeholder="Enter your name" />
                    </FormGroup>
                    <Button intent="primary" type="submit">
                        Submit
                    </Button>
                </form>
            </Collapse>
        </div>
    );
}
