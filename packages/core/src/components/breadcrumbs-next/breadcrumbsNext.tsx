/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { DISPLAYNAME_PREFIX } from "../../common";
import { Breadcrumbs, type BreadcrumbsProps } from "../breadcrumbs/breadcrumbs";

export type BreadcrumbsNextProps = Omit<BreadcrumbsProps, "popoverProps">;

/**
 * BreadcrumbsNext component.
 *
 * Thin wrapper around `Breadcrumbs` that omits the `popoverProps` prop.
 *
 * @see https://blueprintjs.com/docs/#core/components/breadcrumbs
 */
export const BreadcrumbsNext: React.FC<BreadcrumbsNextProps> = props => {
    return <Breadcrumbs {...props} />;
};

BreadcrumbsNext.displayName = `${DISPLAYNAME_PREFIX}.BreadcrumbsNext`;
