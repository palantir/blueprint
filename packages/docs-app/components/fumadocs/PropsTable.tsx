"use client";

import type { ReactNode } from "react";
import { HTMLTable, Tag } from "./blueprint-client";

export interface PropDefinition {
    name: string;
    type: string;
    defaultValue?: string;
    description: ReactNode;
    required?: boolean;
    deprecated?: boolean;
}

export interface PropsTableProps {
    props: PropDefinition[];
}

export function PropsTable({ props }: PropsTableProps) {
    return (
        <HTMLTable bordered striped className="docs-props-table">
            <thead>
                <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {props.map(prop => (
                    <tr key={prop.name}>
                        <td>
                            <code className="docs-prop-name">{prop.name}</code>
                            {prop.required && (
                                <Tag minimal intent="danger" className="docs-prop-required" style={{ marginLeft: 8 }}>
                                    Required
                                </Tag>
                            )}
                            {prop.deprecated && (
                                <Tag minimal intent="warning" className="docs-prop-deprecated" style={{ marginLeft: 8 }}>
                                    Deprecated
                                </Tag>
                            )}
                        </td>
                        <td>
                            <code className="docs-prop-type">{prop.type}</code>
                        </td>
                        <td>
                            {prop.defaultValue ? (
                                <code className="docs-prop-default">{prop.defaultValue}</code>
                            ) : (
                                "—"
                            )}
                        </td>
                        <td>{prop.description}</td>
                    </tr>
                ))}
            </tbody>
        </HTMLTable>
    );
}
