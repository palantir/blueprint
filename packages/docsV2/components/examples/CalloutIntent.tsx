"use client";

import { Callout } from "@blueprintjs/core";

export default function CalloutIntent() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            <Callout intent="primary">This is a primary Callout</Callout>
            <Callout intent="success">This is a success Callout</Callout>
            <Callout intent="warning">This is a warning Callout</Callout>
            <Callout intent="danger">This is a danger Callout</Callout>
        </div>
    );
}
