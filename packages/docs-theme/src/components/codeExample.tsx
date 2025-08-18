/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { getParameters } from "codesandbox/lib/api/define";
import { useCallback, useState } from "react";

import { Button, Classes, Pre, Tooltip } from "@blueprintjs/core";

import { useTheme } from "../common";
import { DOCS_CODE_BLOCK } from "../common/classes";
import { analyzeCode, getHtml, getIndex, getpackageJson, getStyles, getTsconfig } from "../common/sandbox";

export interface CodeExampleProps {
    children?: React.ReactNode;
    className?: string;
    id: string;
    previewCode: string;
    sourceCode: string;
}

export const CodeExample: React.FC<CodeExampleProps> = props => {
    const { children, className, id, previewCode, sourceCode, ...rest } = props;
    const classes = classNames("docs-code-example-frame", className);

    const [isMinimized, setIsMinimized] = useState(true);

    const toggleMinimized = useCallback(() => {
        setIsMinimized((prev: boolean) => !prev);
    }, []);

    return (
        <div className={classes} data-example-id={id} {...rest}>
            <div className="docs-code-example">{children}</div>
            <div className="docs-code-example-toolbar">
                <CodeSandboxButton id={id} sourceCode={sourceCode} />
                <CodeMinimizeButton isMinimized={isMinimized} onClick={toggleMinimized} />
                <CopyToClipboardButton text={isMinimized ? previewCode : sourceCode} />
            </div>
            <div>
                <Pre className={DOCS_CODE_BLOCK} aria-hidden={!isMinimized} data-lang="typescript">
                    {previewCode.trimEnd()}
                </Pre>
                <Pre className={DOCS_CODE_BLOCK} aria-hidden={isMinimized} data-lang="typescript">
                    {sourceCode.trimEnd()}
                </Pre>
            </div>
        </div>
    );
};

function CodeSandboxButton({ id, sourceCode }: { id: string; sourceCode: string }) {
    const { isDarkTheme } = useTheme();
    const { dependencies, stylesheets } = analyzeCode(sourceCode);
    const packageJson = getpackageJson(dependencies);
    const indexJs = getIndex(stylesheets, isDarkTheme);

    const parameters = getParameters({
        files: {
            "package.json": {
                content: packageJson,
                isBinary: false,
            },
            "public/index.html": {
                content: getHtml({ title: `${id} - Blueprint` }),
                isBinary: false,
            },
            "src/Demo.tsx": {
                content: sourceCode,
                isBinary: false,
            },
            "src/index.tsx": {
                content: indexJs,
                isBinary: false,
            },
            "src/styles.scss": {
                content: getStyles(),
                isBinary: false,
            },
            "tsconfig.json": {
                content: getTsconfig(),
                isBinary: false,
            },
        },
    });

    return (
        <form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
            <input type="hidden" name="parameters" value={parameters} />
            <input type="hidden" name="embed" value="1" />
            <input type="hidden" name="query" value="module=/src/Demo.tsx" />
            <Tooltip content="Open in CodeSandbox" hoverOpenDelay={300} position="top">
                <Button aria-label="Open in CodeSandbox" icon={<CodeSandboxIcon />} type="submit" />
            </Tooltip>
        </form>
    );
}

export function CodeSandboxIcon() {
    return (
        <span className={Classes.ICON}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width={20} height={20}>
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
                    <path d="M131.84,25l88,48.18a8,8,0,0,1,4.16,7v95.64a8,8,0,0,1-4.16,7l-88,48.18a8,8,0,0,1-7.68,0l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,4.16-7l88-48.18A8,8,0,0,1,131.84,25Z" />
                    <line x1="128" y1="128" x2="128" y2="232" />
                    <polyline points="32.03 125.73 80 152 80 206.84" />
                    <polyline points="224 125.72 176 152 176 206.84" />
                    <polyline points="83.14 47.44 128 72 172.86 47.44" />
                    <polyline points="33.14 76.06 128 128 222.86 76.06" />
                </g>
            </svg>
        </span>
    );
}

function CodeMinimizeButton({ isMinimized, onClick }: { isMinimized: boolean; onClick: () => void }) {
    return (
        <Tooltip content={isMinimized ? "Expand code" : "Minimize code"} hoverOpenDelay={300} position="top">
            <Button
                aria-label={isMinimized ? "Expand code" : "Minimize code"}
                icon={isMinimized ? "maximize" : "minimize"}
                onClick={onClick}
            />
        </Tooltip>
    );
}

function CopyToClipboardButton({ text }: { text: string }) {
    const onClick = useCallback(() => {
        navigator.clipboard.writeText(text);
    }, [text]);

    return (
        <Tooltip content="Copy to clipboard" hoverOpenDelay={300} position="top">
            <Button aria-label="Copy to clipboard" icon="duplicate" onClick={onClick} />
        </Tooltip>
    );
}
