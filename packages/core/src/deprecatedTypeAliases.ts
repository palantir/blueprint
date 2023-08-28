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

/** @fileoverview type aliases for backwards-compatibility with @blueprintjs/core v4.x */

export {
    /** @deprecated use AbstractComponent */
    AbstractComponent as AbstractComponent2,
} from "./common/abstractComponent";

export {
    /** @deprecated use AbstractPureComponent */
    AbstractPureComponent as AbstractPureComponent2,
} from "./common/abstractPureComponent";

export type {
    /** @deprecated use InputGroupProps */
    InputGroupProps as InputGroupProps2,
} from "./components/forms/inputGroup";

export type {
    /** @deprecated use Toaster */
    Toaster as ToasterInstance,
} from "./components/toast/toaster";
