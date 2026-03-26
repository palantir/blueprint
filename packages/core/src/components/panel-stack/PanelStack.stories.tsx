/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Button } from "../button/buttons";

import { PanelStack } from "./panelStack";
import type { Panel, PanelProps } from "./panelTypes";

// ---------------------------------------------------------------------------
// Sample panel components used across stories
// ---------------------------------------------------------------------------

interface RootPanelInfo {
    label: string;
}

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
            <div style={{ display: "flex", gap: 8 }}>
                <Button text="Open leaf panel" onClick={handleOpen} />
                <Button text="Close" variant="minimal" onClick={closePanel} />
            </div>
        </div>
    );
};

interface LeafPanelInfo {
    message: string;
}

const LeafPanel: React.FC<PanelProps<LeafPanelInfo>> = ({ closePanel, message }) => {
    return (
        <div style={{ padding: 16 }}>
            <p>{message}</p>
            <Button text="Go back" variant="minimal" onClick={closePanel} />
        </div>
    );
};

// ---------------------------------------------------------------------------
// Helper type covering all panels used in these stories
// ---------------------------------------------------------------------------

type SamplePanel = Panel<RootPanelInfo> | Panel<DetailPanelInfo> | Panel<LeafPanelInfo>;

const INITIAL_PANEL: SamplePanel = {
    renderPanel: RootPanel,
    title: "Root Panel",
    props: { label: "Welcome to PanelStack. Click below to navigate." },
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof PanelStack<SamplePanel>> = {
    title: "Core/PanelStack",
    component: PanelStack,
    decorators: [
        Story => (
            <div
                style={{
                    width: 400,
                    height: 300,
                    border: "1px solid var(--pt-divider-black, rgba(17,20,24,0.15))",
                    borderRadius: 4,
                    overflow: "hidden",
                }}
            >
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * The default uncontrolled PanelStack with an initial panel. Click through
 * to push and pop panels on the stack.
 */
export const Default: Story = {
    render: () => <PanelStack<SamplePanel> initialPanel={INITIAL_PANEL} />,
};

/**
 * Interactive playground demonstrating `onOpen` and `onClose` callbacks. Open
 * the Actions panel in Storybook to see the callbacks fire.
 */
export const Playground: Story = {
    render: function Render() {
        const [stack, setStack] = useState<SamplePanel[]>([INITIAL_PANEL]);

        const handleOpen = useCallback((panel: SamplePanel) => {
            setStack(prev => [...prev, panel]);
        }, []);

        const handleClose = useCallback((_panel: SamplePanel) => {
            setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
        }, []);

        return <PanelStack<SamplePanel> stack={stack} onOpen={handleOpen} onClose={handleClose} />;
    },
};
