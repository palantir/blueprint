/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { OverlayToaster } from "./overlayToaster";
import type { OverlayToasterProps } from "./overlayToasterProps";
import type { ToastProps } from "./toast";

export type ToastOptions = ToastProps & { key: string };
/** Instance methods available on a toaster component instance. */
export interface Toaster {
    /**
     * Shows a new toast to the user, or updates an existing toast corresponding to the provided key (optional).
     *
     * Returns the unique key of the toast.
     */
    show(props: ToastProps, key?: string): string;

    /** Dismiss the given toast instantly. */
    dismiss(key: string): void;

    /** Dismiss all toasts instantly. */
    clear(): void;

    /** Returns the props for all current toasts. */
    getToasts(): ToastOptions[];
}

export type ToasterInstance = Toaster;
// merges with declaration of `Toaster` type in `toasterTypes.ts`
// kept for backwards-compatibility with v4.x
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Toaster = {
    // eslint-disable-next-line deprecation/deprecation
    create: deprecatedToasterCreate,
};

/** @deprecated use OverlayToaster.create() instead */
function deprecatedToasterCreate(props?: OverlayToasterProps, container = document.body): Toaster {
    return OverlayToaster.create(props, container);
}
