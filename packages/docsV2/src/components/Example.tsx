import React from "react";

interface ExampleProps {
    children: React.ReactNode;
}

/**
 * A simple container component for rendering Blueprint component examples.
 * Provides consistent styling and layout for documentation examples.
 */
export function Example({ children }: ExampleProps) {
    return (
        <div className="example-container">
            <div className="example-preview">{children}</div>
        </div>
    );
}
