/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import { Add, AddIcon } from "./generated/components";

describe("<Add> icon component", () => {
    it("allows attaching an event handler", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        render(<Add onClick={handleClick} />);
    });

    it("disallows child elements", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        render(
            <Add onClick={handleClick}>
                {/* @ts-expect-error */}
                <path />
            </Add>,
        );
    });
});

describe("<AddIcon> alias component", () => {
    it("allows attaching an event handler", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        render(<AddIcon onClick={handleClick} />);
    });

    it("disallows child elements", () => {
        const handleClick: React.MouseEventHandler<HTMLSpanElement> = () => undefined;
        render(
            <AddIcon onClick={handleClick}>
                {/* @ts-expect-error */}
                <path />
            </AddIcon>,
        );
    });
});
