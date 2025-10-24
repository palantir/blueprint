/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

export const DISPLAYNAME_PREFIX = "BlueprintLabs";

/**
 * A shared base interface for all Blueprint component props.
 */
export interface Props {
    /** A space-delimited list of class names to pass along to a child element. */
    className?: string;
}
