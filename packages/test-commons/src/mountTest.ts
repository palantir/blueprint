/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { mount, type MountRendererProps, type ReactWrapper } from "enzyme";
import { type Component, type ReactElement } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export interface MountTestWrapper<P = {}, S = {}, C = Component> extends Disposable {
    readonly wrapper: ReactWrapper<P, S, C>;
}

export function mountTest<C extends Component, P = C["props"], S = C["state"]>(
    node: ReactElement<P>,
    options?: MountRendererProps,
): MountTestWrapper<P, S, C>;
export function mountTest<P>(node: ReactElement<P>, options?: MountRendererProps): MountTestWrapper<P, any>;
export function mountTest<P, S>(node: ReactElement<P>, options?: MountRendererProps): MountTestWrapper<P, S>;
export function mountTest(
    node: ReactElement<unknown>,
    options?: MountRendererProps,
): MountTestWrapper<unknown, unknown> {
    const rootElement = document.createElement("div");
    document.body.appendChild(rootElement);

    const wrapper = mount(node, options);

    return {
        wrapper,
        [Symbol.dispose]: () => {
            wrapper.unmount();
            rootElement.remove();
        },
    };
}
