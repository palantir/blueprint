/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryLabel } from "@storybook-common";
import { useCallback, useState } from "react";

import { Flex } from "@blueprintjs/labs";

import { Button } from "../button/buttons";

import { PanelStack, type PanelStackProps } from "./panelStack";
import type { Panel, PanelProps } from "./panelTypes";

interface RootPanelInfo {
    label: string;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const RootPanel: React.FC<PanelProps<RootPanelInfo>> = ({ openPanel, label }) => {
    const handleOpen = useCallback(() => {
        openPanel({
            renderPanel: DetailPanel,
            title: "Detail Panel",
            props: { itemName: "Item A" },
        });
    }, [openPanel]);

    return (
        <div style={{ padding: 16 }}>
            <p>{label}</p>
            <Button text="Open detail panel" onClick={handleOpen} />
        </div>
    );
};

interface DetailPanelInfo {
    itemName: string;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const DetailPanel: React.FC<PanelProps<DetailPanelInfo>> = ({ openPanel, closePanel, itemName }) => {
    const handleOpen = useCallback(() => {
        openPanel({
            renderPanel: LeafPanel,
            title: "Leaf Panel",
            props: { message: `Navigated from ${itemName}` },
        });
    }, [openPanel, itemName]);

    return (
        <div style={{ padding: 16 }}>
            <p>
                Viewing: <strong>{itemName}</strong>
            </p>
            <Flex gap={2}>
                <Button text="Open leaf panel" onClick={handleOpen} />
                <Button text="Close" variant="minimal" onClick={closePanel} />
            </Flex>
        </div>
    );
};

interface LeafPanelInfo {
    message: string;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const LeafPanel: React.FC<PanelProps<LeafPanelInfo>> = ({ closePanel, message }) => {
    return (
        <div style={{ padding: 16 }}>
            <p>{message}</p>
            <Button text="Go back" variant="minimal" onClick={closePanel} />
        </div>
    );
};

// A panel with locally-held counter state, used to demonstrate
// `renderActivePanelOnly={false}` preserving component state across navigation.
interface CounterPanelInfo {
    initial: number;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const CounterPanel: React.FC<PanelProps<CounterPanelInfo>> = ({ openPanel, initial }) => {
    const [count, setCount] = useState(initial);
    const handleIncrement = useCallback(() => setCount(c => c + 1), []);
    const handleOpen = useCallback(() => {
        openPanel({
            renderPanel: LeafPanel,
            title: "Leaf Panel",
            props: { message: "Navigate back — your counter is preserved." },
        });
    }, [openPanel]);

    return (
        <div style={{ padding: 16 }}>
            <p>
                Counter: <strong>{count}</strong>
            </p>
            <Flex gap={2}>
                <Button text="Increment" onClick={handleIncrement} />
                <Button text="Open next panel" onClick={handleOpen} />
            </Flex>
        </div>
    );
};

// Use a permissive payload type so panels with different shapes can coexist in
// the same stack. TypeScript's contravariant function-parameter typing rejects
// any narrower union here, so renderPanel needs a cast at each construction site.
type SamplePanel = Panel<object>;
type AnyPanelRenderer = React.FC<PanelProps<object>>;

const INITIAL_PANEL: SamplePanel = {
    renderPanel: RootPanel as AnyPanelRenderer,
    title: "Root Panel",
    props: { label: "Welcome to PanelStack. Click below to navigate." },
};

const COUNTER_INITIAL_PANEL: SamplePanel = {
    renderPanel: CounterPanel as AnyPanelRenderer,
    title: "Counter Panel",
    props: { initial: 0 },
};

const CONTROLLED_STACK: readonly SamplePanel[] = [
    INITIAL_PANEL,
    {
        renderPanel: DetailPanel as AnyPanelRenderer,
        title: "Detail Panel",
        props: { itemName: "Item A" },
    },
];

// PanelStack uses absolute positioning internally, so it needs explicit
// dimensions on its own root (not just an outer wrapper). Apply size via a
// className passed through to the PanelStack element.
const STACK_FRAME_CLASS = "panel-stack-story-frame";
const stackFrameStyles = `
.${STACK_FRAME_CLASS} {
    width: 400px;
    height: 300px;
    border: 1px solid var(--bp-border-default);
    border-radius: var(--bp-radius-medium);
}
`;

function StackFrameStyles() {
    return <style>{stackFrameStyles}</style>;
}

// Renders the current panel stack as a list below a PanelStack, with the
// top-of-stack panel highlighted. Bottom of the list = bottom of the stack.
function StackIndicator({ stack }: { stack: readonly SamplePanel[] }) {
    return (
        <Flex flexDirection="column" gap={1} style={{ width: 400 }}>
            <StoryLabel title={`Stack (${stack.length})`} />
            <Flex flexDirection="column" gap={1}>
                {stack.map((panel, index) => {
                    const isTop = index === stack.length - 1;
                    return (
                        <div
                            key={index}
                            style={{
                                padding: "4px 8px",
                                border: "1px solid var(--bp-border-default)",
                                borderRadius: "var(--bp-radius-small)",
                                background: isTop ? "var(--bp-surface-emphasis)" : "var(--bp-surface-default)",
                                fontFamily: "var(--bp-font-family-monospace)",
                                fontSize: 12,
                            }}
                        >
                            {index}: {String(panel.title)}
                            {isTop ? "  ← top" : ""}
                        </div>
                    );
                })}
            </Flex>
        </Flex>
    );
}

// Wraps a PanelStack in uncontrolled mode and mirrors its internal stack via
// onOpen/onClose so we can render a visible stack indicator below.
function PanelStackWithIndicator({
    initialPanel,
    ...rest
}: Omit<PanelStackProps<SamplePanel>, "stack" | "onOpen" | "onClose"> & {
    initialPanel: SamplePanel;
}) {
    const [stack, setStack] = useState<readonly SamplePanel[]>([initialPanel]);
    const handleOpen = useCallback((panel: SamplePanel) => {
        setStack(prev => [...prev, panel]);
    }, []);
    const handleClose = useCallback(() => {
        setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }, []);
    return (
        <Flex flexDirection="column" gap={3}>
            <PanelStack<SamplePanel>
                {...rest}
                className={STACK_FRAME_CLASS}
                initialPanel={initialPanel}
                onOpen={handleOpen}
                onClose={handleClose}
            />
            <StackIndicator stack={stack} />
        </Flex>
    );
}

// PanelStack is driven by `initialPanel` / `stack` and inline panel components
// rather than args, so hide those props (and event handlers) from the controls panel.
const disabledArgs = ["className", "initialPanel", "stack", "onOpen", "onClose"] as const satisfies ReadonlyArray<
    keyof PanelStackProps<SamplePanel>
>;

const meta: Meta<typeof PanelStack<SamplePanel>> = {
    title: "Core/PanelStack",
    component: PanelStack,
    parameters: {
        layout: "centered",
    },
    args: {
        renderActivePanelOnly: true,
        showPanelHeader: true,
    },
    argTypes: {
        renderActivePanelOnly: { control: "boolean" },
        showPanelHeader: { control: "boolean" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof PanelStack<SamplePanel>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default uncontrolled `PanelStack` with an `initialPanel`. Click the button
 * to push new panels; the auto-generated header provides a back button to pop.
 */
export const Default: Story = {
    render: args => (
        <>
            <StackFrameStyles />
            <PanelStackWithIndicator {...args} initialPanel={INITIAL_PANEL} />
        </>
    ),
};

/**
 * Toggle `showPanelHeader` to hide the built-in header and back button. When
 * hidden, panels are responsible for providing their own navigation affordances.
 */
export const ShowPanelHeader: Story = {
    argTypes: {
        showPanelHeader: { table: { disable: true } },
    },
    render: args => (
        <>
            <StackFrameStyles />
            <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="With header" />
                    <PanelStackWithIndicator {...args} initialPanel={INITIAL_PANEL} showPanelHeader={true} />
                </Flex>
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="Without header" />
                    <PanelStackWithIndicator {...args} initialPanel={INITIAL_PANEL} showPanelHeader={false} />
                </Flex>
            </Flex>
        </>
    ),
};

/**
 * When `renderActivePanelOnly` is `false`, all panels in the stack remain
 * mounted, so inactive panel state (local React state, scroll position, form
 * input) is preserved as the user navigates. The Counter Panel below keeps its
 * value when you push a new panel and pop back.
 */
export const RenderActivePanelOnly: Story = {
    argTypes: {
        renderActivePanelOnly: { table: { disable: true } },
    },
    render: args => (
        <>
            <StackFrameStyles />
            <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="Active only (default)" />
                    <PanelStackWithIndicator
                        {...args}
                        initialPanel={COUNTER_INITIAL_PANEL}
                        renderActivePanelOnly={true}
                    />
                </Flex>
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="All panels (state preserved)" />
                    <PanelStackWithIndicator
                        {...args}
                        initialPanel={COUNTER_INITIAL_PANEL}
                        renderActivePanelOnly={false}
                    />
                </Flex>
            </Flex>
        </>
    ),
};

/**
 * Pass a `stack` prop (instead of `initialPanel`) to drive `PanelStack` in
 * controlled mode. The parent owns the stack array and updates it from
 * `onOpen` / `onClose` callbacks.
 */
export const Controlled: Story = {
    render: function Render(args) {
        const [stack, setStack] = useState<readonly SamplePanel[]>(CONTROLLED_STACK);

        const handleOpen = useCallback((panel: SamplePanel) => {
            setStack(prev => [...prev, panel]);
        }, []);

        const handleClose = useCallback(() => {
            setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
        }, []);

        return (
            <>
                <StackFrameStyles />
                <Flex flexDirection="column" gap={3}>
                    <PanelStack<SamplePanel>
                        {...args}
                        className={STACK_FRAME_CLASS}
                        stack={stack}
                        onOpen={handleOpen}
                        onClose={handleClose}
                    />
                    <StackIndicator stack={stack} />
                </Flex>
            </>
        );
    },
};

/**
 * Interactive playground demonstrating `onOpen` and `onClose` callbacks. Open
 * the Actions panel in Storybook to see the callbacks fire as you navigate.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [stack, setStack] = useState<readonly SamplePanel[]>([INITIAL_PANEL]);

        const handleOpen = useCallback((panel: SamplePanel) => {
            setStack(prev => [...prev, panel]);
        }, []);

        const handleClose = useCallback((_panel: SamplePanel) => {
            setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
        }, []);

        return (
            <>
                <StackFrameStyles />
                <Flex flexDirection="column" gap={3}>
                    <PanelStack<SamplePanel>
                        {...args}
                        className={STACK_FRAME_CLASS}
                        stack={stack}
                        onOpen={handleOpen}
                        onClose={handleClose}
                    />
                    <StackIndicator stack={stack} />
                </Flex>
            </>
        );
    },
};
