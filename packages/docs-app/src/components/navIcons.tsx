/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import React from "react";

export const NavIcon: React.SFC<{ route: string }> = ({ route }) => {
    return (
        <svg className="docs-nav-package-icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            {ICON_CONTENTS[route]}
        </svg>
    );
};

const OPACITY = 0.6;
const ICON_CONTENTS: Record<string, JSX.Element> = {
    blueprint: (
        <g fillRule="evenodd">
            <path d="M17 12v4a2 2 0 0 1-2 2h-1v-3a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v3H9a2 2 0 0 1-2-2v-4l5-3.3 5 3.3z" />
            <path
                d="M12 7.202l-5.445 3.63a1 1 0 0 1-1.11-1.664l6-4a1 1 0 0 1 1.11 0l6 4a1 1 0 0 1-1.11 1.664L12 7.202z"
                fillRule="nonzero"
                opacity={OPACITY}
            />
        </g>
    ),

    core: (
        <g fillRule="evenodd">
            <path d="M12 7.211l4 2.6v3.6l-4 2.6-4-2.6v-3.6z" />
            <path
                d="M13.094 4.325l5 3.266A2 2 0 0 1 19 9.265v4.692a2 2 0 0 1-.906 1.675l-5 3.265a2 2 0 0 1-2.188 0l-5-3.265A2 2 0 0 1 5 13.957V9.265a2 2 0 0 1 .906-1.674l5-3.266a2 2 0 0 1 2.188 0zM12 6.02l-5 3.25v4.685l5 3.25 5-3.25V9.269l-5-3.25z"
                opacity={OPACITY}
            />
        </g>
    ),

    datetime: (
        <g fillRule="evenodd">
            <path d="M6 10h12v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6z" opacity={OPACITY} />
            <path d="M8 6h8a2 2 0 0 1 2 2v1H6V8a2 2 0 0 1 2-2z" />
        </g>
    ),

    icons: (
        <g fillRule="evenodd">
            <path d="M11.657 5l2.058 4.168 4.6.669-3.329 3.245.786 4.581-4.115-2.163V5z" opacity={OPACITY} />
            <path d="M11.657 5v10.5l-4.114 2.163.786-4.581L5 9.837l4.6-.669L11.657 5z" />
        </g>
    ),

    labs: (
        <g fillRule="evenodd">
            <path
                d="M10 9V7h-.5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1H14v2l3.927 5.89A2 2 0 0 1 16.263 18H7.737a2 2 0 0 1-1.664-3.11L10 9z"
                opacity={OPACITY}
            />
            <path d="M17.281 13.917l.649.974A2 2 0 0 1 16.266 18H7.74a2 2 0 0 1-1.664-3.11l2.25-3.375c1.363-.21 2.755.165 4.177 1.124 1.255.847 2.848 1.273 4.778 1.278z" />
        </g>
    ),

    resources: (
        <g fillRule="evenodd">
            <path d="M5 11l7 7 7-7H5z" />
            <path opacity={OPACITY} d="M5 11l3-4h8l3 4z" />
        </g>
    ),

    select: (
        <g transform="translate(5 6)" fillRule="evenodd">
            <rect y="4" width="14" height="4" rx="1" />
            <rect opacity={OPACITY} x="2" width="10" height="3" rx="1" />
            <rect opacity={OPACITY} x="2" y="9" width="10" height="3" rx="1" />
        </g>
    ),

    table: (
        <g fillRule="evenodd">
            <path
                d="M10 15v-2h4v2h-4zm0 1h4v2h-4v-2zm8-1h-3v-2h3v2zm0 1a2 2 0 0 1-2 2h-1v-2h3zM6 15v-2h3v2H6zm0 1h3v2H8a2 2 0 0 1-2-2zm4-4v-2h4v2h-4zm8 0h-3v-2h3v2zM6 12v-2h3v2H6z"
                opacity={OPACITY}
            />
            <path d="M8 6h8a2 2 0 0 1 2 2v1H6V8a2 2 0 0 1 2-2z" />
        </g>
    ),

    timezone: (
        <g transform="translate(6 5)" fillRule="evenodd">
            <ellipse opacity={OPACITY / 1.5} cx="6" cy="10.5" rx="6" ry="2.5" />
            <path d="M2 4c0-2 1.5-4 4-4s4 2 4 4c0 1.333-1.333 3.667-4 7-2.667-3.333-4-5.667-4-7zm4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        </g>
    ),
};
