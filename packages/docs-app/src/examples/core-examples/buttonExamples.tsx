/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

export const ButtonBasicExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core';

export default function App() {
    return (
        <Button text="Click Me" />
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonIntentExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core';

export default function App() {
    return (
        <>
            <Button text="Primary" intent="primary" />
            <Button text="Success" intent="success" />
            <Button text="Warning" intent="warning" />
            <Button text="Danger" intent="danger" />
        </>
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonMinimalExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core';

export default function App() {
    return (
        <>
            <Button text="Minimal" minimal={true} />
            <Button text="Primary" minimal={true} intent="primary" />
            <Button text="Disabled" minimal={true} disabled={true} />
        </>
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonOutlinedExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core';

export default function App() {
    return (
        <>
            <Button text="Outlined" outlined={true} />
            <Button text="Primary" outlined={true} intent="primary" />
            <Button text="Disabled" minimal={true} disabled={true} />
        </>
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonSizeExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core';

export default function App() {
    return (
        <>
            <Button text="Small" small={true} />
            <Button text="Default" />
            <Button text="Large" large={true} />
        </>
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonFillExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core'

export default function App() {
    return (
        <Button text="Full Width Button" fill={true} />
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonAlignTextExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core';

export default function App() {
    return (
        <>
            <Button text="Left Aligned" alignText="left" icon="align-left" rightIcon="caret-down" />
            <Button text="Center Aligned" alignText="center" icon="align-center" rightIcon="caret-down" />
            <Button text="Right Aligned" alignText="right" icon="align-right" rightIcon="caret-down" />
        </>
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonEllipsizeTextExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core';

export default function App() {
    return (
        <Button text="This is a very long button label that will be truncated" ellipsizeText={true} />
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonIconWithTextExample: React.FC<ExampleProps> = props => {
    const code = `import { Button, Icon } from '@blueprintjs/core';

export default function App() {
    return (
        <>
            <Button icon="refresh" intent="danger" text="Reset" />
            <Button icon="user" rightIcon="caret-down" text="Profile settings" />
            <Button rightIcon="arrow-right" intent="success" text="Next step" />
            <Button>
                <Icon icon="document" /> Upload... <Icon icon="small-cross" />
            </Button>
        </>
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonIconExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core';

export default function App() {
    return (
        <>
            <Button icon="edit" aria-label="edit" />
            <Button icon="share" outlined={true} aria-label="share" />
            <Button icon="filter" intent="primary" minimal={true} aria-label="filter" />
            <Button icon="add" intent="success" aria-label="add" />
            <Button icon="trash" disabled={true} intent="danger" aria-label="delete" />
        </>
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonStatesExample: React.FC<ExampleProps> = props => {
    const code = `import { Button } from '@blueprintjs/core';

export default function App() {
    return (
        <>
            <Button text="Default" />
            <Button text="Active" active={true} />
            <Button text="Disabled" disabled={true} />
            <Button text="Loading..." loading={true} />
        </>
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonAnchorButtonExample: React.FC<ExampleProps> = props => {
    const code = `import { AnchorButton } from '@blueprintjs/core';

export default function App() {
    return (
        <AnchorButton href="https://blueprintjs.com" rightIcon="share" text="Link" />
    );
}`;
    return <CodeExample code={code} {...props} />;
};

export const ButtonDisabledButtonTooltipExample: React.FC<ExampleProps> = props => {
    const code = `import { AnchorButton, Tooltip } from '@blueprintjs/core';

export default function App() {
    return (
        <Tooltip content="This button is disabled">
            <AnchorButton text="Disabled" disabled={true} />
        </Tooltip>
    );
}`;
    return <CodeExample code={code} {...props} />;
};
