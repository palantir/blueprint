/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import type { BreadcrumbProps } from "../breadcrumbs/breadcrumb";

import { BreadcrumbsNext } from "./breadcrumbsNext";

const ITEMS: BreadcrumbProps[] = [{ text: "1" }, { text: "2" }, { text: "3" }];

describe("<BreadcrumbsNext>", () => {
    it("renders without crashing", () => {
        render(<BreadcrumbsNext items={ITEMS} minVisibleItems={ITEMS.length} />);
        expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("has correct displayName", () => {
        expect(BreadcrumbsNext.displayName).toBe("Blueprint6.BreadcrumbsNext");
    });

    it("renders breadcrumb items with correct classes", () => {
        render(<BreadcrumbsNext items={ITEMS} minVisibleItems={ITEMS.length} />);
        const list = screen.getByRole("list");
        expect(list).toHaveClass(Classes.BREADCRUMBS);
        expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });
});
