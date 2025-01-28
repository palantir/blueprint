/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import * as React from "react";

import { Button, Classes, Collapse, FormGroup, InputGroup } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

export const CollapseBasicExample: React.FC<ExampleProps> = props => {
    const [isOpen, setIsOpen] = React.useState(false);
    const code = dedent`
        function CollapseExample() {
            const [isOpen, setIsOpen] = React.useState(false);

            return (
                <div>
                    <Button intent="primary" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? "Hide Details" : "Show Details"}
                    </Button>
                    <Collapse isOpen={isOpen}>
                        <p>
                            This is an example of collapsible content. It could include detailed explanations, extra
                            information, or supporting text for the primary content on the page. When expanded, the content is
                            fully visible and takes up space in the document layout. When collapsed, it smoothly slides out of
                            view.
                        </p>
                    </Collapse>
                    <p className={Classes.TEXT_MUTED}>
                        This is content below the collapse. It remains in the document flow and adjusts its position as the
                        collapse opens and closes.
                    </p>
                </div>
            );
        }`;

    return (
        <CodeExample code={code} {...props}>
            <Button intent="primary" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "Hide Details" : "Show Details"}
            </Button>
            <Collapse isOpen={isOpen}>
                <p>
                    This is an example of collapsible content. It could include detailed explanations, extra
                    information, or supporting text for the primary content on the page. When expanded, the content is
                    fully visible and takes up space in the document layout. When collapsed, it smoothly slides out of
                    view.
                </p>
            </Collapse>
            <p className={Classes.TEXT_MUTED}>
                This is content below the collapse. It remains in the document flow and adjusts its position as the
                collapse opens and closes.
            </p>
        </CodeExample>
    );
};

export const CollapseMountedExample: React.FC<ExampleProps> = props => {
    const [isOpen, setIsOpen] = React.useState(false);
    const code = dedent`
        function CollapseMountedExample() {
            const [isOpen, setIsOpen] = React.useState(false);

            return (
                <div>
                    <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Hide Form" : "Show Form"}</Button>
                    <Collapse isOpen={isOpen} keepChildrenMounted={true}>
                        <p>
                            This form content stays mounted in the DOM, even when collapsed. This means that any input fields,
                            text areas, or components inside the collapse will maintain their state between toggles.
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
        }`;

    return (
        <CodeExample code={code} {...props}>
            <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Hide Form" : "Show Form"}</Button>
            <Collapse isOpen={isOpen} keepChildrenMounted={true}>
                <p>
                    This form content stays mounted in the DOM, even when collapsed. This means that any input fields,
                    text areas, or components inside the collapse will maintain their state between toggles.
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
        </CodeExample>
    );
};
