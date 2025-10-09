/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { HEADING_IN_VIEW_THRESHOLD, SCROLL_TOP_THRESHOLD, useHeadingRegistry } from "./headingRegistry";

export function useTOCActiveItem(routes: string[]) {
    const { headings } = useHeadingRegistry();
    const [activeAnchor, setActiveAnchor] = useState<string | null>(null);

    // Store the last clicked anchor to give it priority during scroll animation
    const lastClickedRef = useRef<string | null>(null);

    useEffect(() => {
        if (routes.length === 0) {
            return;
        }

        const relevantHeadings = headings.filter(h => routes.includes(h.route));

        if (relevantHeadings.length === 0) {
            return;
        }

        // Track which headings are currently intersecting
        const intersectingHeadings = new Map<string, IntersectionObserverEntry>();

        const updateActiveAnchor = () => {
            // If user recently clicked, keep that one active during scroll animation
            if (lastClickedRef.current != null) {
                const clickedEntry = intersectingHeadings.get(lastClickedRef.current);
                if (clickedEntry?.isIntersecting) {
                    // Check if the clicked heading is now in a good position
                    const rect = clickedEntry.target.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= HEADING_IN_VIEW_THRESHOLD) {
                        lastClickedRef.current = null;
                    }
                }
                return;
            }

            // Special case: Top of page → first heading
            if (window.scrollY <= SCROLL_TOP_THRESHOLD) {
                setActiveAnchor(routes[0] ?? null);
                return;
            }

            // Find the topmost intersecting heading
            let topmostEntry: IntersectionObserverEntry | undefined;
            let topmostTop = Infinity;

            for (const entry of intersectingHeadings.values()) {
                if (entry.isIntersecting && entry.boundingClientRect.top < topmostTop) {
                    topmostTop = entry.boundingClientRect.top;
                    topmostEntry = entry;
                }
            }

            if (topmostEntry != null) {
                const route = topmostEntry.target.getAttribute("id");
                if (route != null) {
                    setActiveAnchor(route);
                }
            }
        };

        const observer = new IntersectionObserver(
            entries => {
                // Update the map of intersecting headings
                for (const entry of entries) {
                    const route = entry.target.getAttribute("id");
                    if (route != null) {
                        intersectingHeadings.set(route, entry);
                    }
                }

                updateActiveAnchor();
            },
            {
                // Root margin creates a detection zone near the top of viewport
                rootMargin: `-${HEADING_IN_VIEW_THRESHOLD}px 0px -70% 0px`,
                threshold: [0, 0.5, 1],
            },
        );

        // Observe all relevant headings
        for (const heading of relevantHeadings) {
            observer.observe(heading.element);
        }

        // Set initial active anchor
        updateActiveAnchor();

        return () => {
            observer.disconnect();
        };
    }, [routes, headings]);

    const handleTocItemClick = useCallback((route: string) => {
        lastClickedRef.current = route;
        setActiveAnchor(route);
        window.location.hash = route;
    }, []);

    return {
        activeAnchor,
        handleTocItemClick,
    };
}
