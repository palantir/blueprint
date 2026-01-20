"use client";

import { Card } from "@blueprintjs/core";

export default function CardCompact() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Card>This card has default padding.</Card>
            <Card compact={true}>This card is more compact.</Card>
        </div>
    );
}
