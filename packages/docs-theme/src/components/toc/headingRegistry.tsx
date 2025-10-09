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

import { createContext, type RefObject, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** Threshold for detecting scroll at top of page */
export const SCROLL_TOP_THRESHOLD = 10;

/** Threshold for considering a heading "in view" (scroll offset + buffer) */
export const HEADING_IN_VIEW_THRESHOLD = 50;

export interface HeadingData {
    depth: number;
    element: HTMLElement;
    route: string;
    title: string;
    url: string;
}

interface HeadingRegistryContextValue {
    getHeadingElement: (route: string) => HTMLElement | undefined;
    headings: HeadingData[];
    registerHeading: (route: string, element: HTMLElement, data: Omit<HeadingData, "element">) => void;
    scrollToHeading: (route: string) => void;
    unregisterHeading: (route: string) => void;
}

const HeadingRegistryContext = createContext<HeadingRegistryContextValue | undefined>(undefined);

export const HeadingRegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [headingsMap, setHeadingsMap] = useState<Map<string, HeadingData>>(new Map());

    const registerHeading = useCallback((route: string, element: HTMLElement, data: Omit<HeadingData, "element">) => {
        setHeadingsMap(prev => {
            const next = new Map(prev);
            next.set(route, { ...data, element });
            return next;
        });
    }, []);

    const unregisterHeading = useCallback((route: string) => {
        setHeadingsMap(prev => {
            const next = new Map(prev);
            next.delete(route);
            return next;
        });
    }, []);

    const scrollToHeading = useCallback(
        (route: string) => {
            const headingData = headingsMap.get(route);

            if (headingData == null) {
                return;
            }

            requestAnimationFrame(() => {
                const scrollContainer = document.documentElement;
                const offsetPosition = headingData.element.offsetTop - HEADING_IN_VIEW_THRESHOLD;

                scrollContainer.scrollTo({
                    behavior: "smooth",
                    top: offsetPosition,
                });
            });
        },
        [headingsMap],
    );

    const getHeadingElement = useCallback(
        (route: string): HTMLElement | undefined => {
            return headingsMap.get(route)?.element;
        },
        [headingsMap],
    );

    const headings = useMemo(() => Array.from(headingsMap.values()), [headingsMap]);

    const value = useMemo(
        () => ({
            getHeadingElement,
            headings,
            registerHeading,
            scrollToHeading,
            unregisterHeading,
        }),
        [getHeadingElement, headings, registerHeading, scrollToHeading, unregisterHeading],
    );

    return <HeadingRegistryContext.Provider value={value}>{children}</HeadingRegistryContext.Provider>;
};

export const useHeadingRegistry = () => {
    const context = useContext(HeadingRegistryContext);
    if (context == null) {
        throw new Error("useHeadingRegistry must be used within HeadingRegistryProvider");
    }
    return context;
};

export const useRegisterHeading = (
    route: string,
    ref: RefObject<HTMLHeadingElement>,
    { depth, title, url }: Omit<HeadingData, "element" | "route">,
) => {
    const { registerHeading, unregisterHeading } = useHeadingRegistry();

    useEffect(() => {
        if (ref.current != null) {
            registerHeading(route, ref.current, { depth, route, title, url });
        }

        return () => {
            unregisterHeading(route);
        };
    }, [route, ref, registerHeading, unregisterHeading, depth, title, url]);
};
