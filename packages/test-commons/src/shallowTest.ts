/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { shallow, type ShallowRendererProps, type ShallowWrapper } from "enzyme";
import { type Component, type ReactElement } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export interface ShallowTestWrapper<P = {}, S = {}, C = Component> extends Disposable {
    readonly wrapper: ShallowWrapper<P, S, C>;
}

export const shallowTest2: typeof shallow = (node: ReactElement<unknown>, options?: ShallowRendererProps) => {
    const rootElement = document.createElement("div");
    document.body.appendChild(rootElement);

    const wrapper = shallow(node, options);

    return {
        wrapper,
        [Symbol.dispose]: () => {
            wrapper.unmount();
            rootElement.remove();
        },
    };
};

export function shallowTest<C extends Component, P = C["props"], S = C["state"]>(
    node: ReactElement<P>,
    options?: ShallowRendererProps,
): ShallowTestWrapper<P, S, C>;
export function shallowTest<P, S = unknown>(
    node: ReactElement<P>,
    options?: ShallowRendererProps,
): ShallowTestWrapper<P, S>;
export function shallowTest(
    node: ReactElement<unknown>,
    options?: ShallowRendererProps,
): ShallowTestWrapper<unknown, unknown, unknown> {
    const rootElement = document.createElement("div");
    document.body.appendChild(rootElement);

    const wrapper = shallow(node, options);

    return {
        wrapper,
        [Symbol.dispose]: () => {
            wrapper.unmount();
            rootElement.remove();
        },
    };
}
