/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { render } from "@testing-library/react";
import { expect } from "chai";
import * as React from "react";
import { useUID } from "react-uid";
import { spy } from "sinon";

import type { OverlayProps } from "../../src/components/overlay/overlayProps";
import type { OverlayInstance } from "../../src/components/overlay2/overlay2";
import { OverlaysProvider } from "../../src/context";
import { useOverlayStack, usePrevious } from "../../src/hooks";
import { modifyGlobalStack } from "../../src/hooks/overlays/useLegacyOverlayStack";

interface TestComponentProps extends OverlayProps {
    handleLastOpenedChange?: (lastOpened: OverlayInstance | undefined) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

const TestComponentWithoutProvider: React.FC<TestComponentProps> = ({
    autoFocus,
    children,
    enforceFocus,
    containerRef: containerElement,
    handleLastOpenedChange,
    hasBackdrop,
    isOpen,
    usePortal,
}) => {
    const { openOverlay, getLastOpened, closeOverlay } = useOverlayStack();

    const bringFocusInsideOverlay = React.useCallback(() => {
        // unimplemented since it's not tested in this suite
    }, []);

    const handleDocumentFocus = React.useCallback((_e: FocusEvent) => {
        // unimplemented since it's not tested in this suite
    }, []);

    const id = useUID();
    const instance = React.useMemo<OverlayInstance>(
        () => ({
            bringFocusInsideOverlay,
            containerElement,
            handleDocumentFocus,
            id,
            props: {
                autoFocus,
                enforceFocus,
                hasBackdrop,
                usePortal,
            },
        }),
        [
            autoFocus,
            bringFocusInsideOverlay,
            containerElement,
            enforceFocus,
            handleDocumentFocus,
            hasBackdrop,
            id,
            usePortal,
        ],
    );

    const prevIsOpen = usePrevious(isOpen) ?? false;
    React.useEffect(() => {
        if (!prevIsOpen && isOpen) {
            // just opened
            openOverlay(instance);
        }

        if (prevIsOpen && !isOpen) {
            // just closed
            closeOverlay(instance);
        }
    }, [isOpen, openOverlay, closeOverlay, prevIsOpen, instance]);

    // run once on unmount
    React.useEffect(() => {
        return () => {
            if (isOpen) {
                closeOverlay(instance);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const lastOpened = getLastOpened();
    const prevLastOpened = usePrevious(lastOpened);
    React.useEffect(() => {
        if (prevLastOpened !== lastOpened) {
            handleLastOpenedChange?.(lastOpened);
        }
    }, [handleLastOpenedChange, lastOpened, prevLastOpened]);

    return <div ref={containerElement}>{children}</div>;
};

const TestComponentWithProvider: React.FC<TestComponentProps> = props => {
    return (
        <OverlaysProvider>
            <TestComponentWithoutProvider {...props} />
        </OverlaysProvider>
    );
};

describe("useOverlayStack()", () => {
    const handleLastOpenedChange = spy();
    const containerRef = React.createRef<HTMLDivElement>();
    const TEST_PROPS_CLOSED: TestComponentProps = {
        autoFocus: true,
        containerRef,
        enforceFocus: true,
        handleLastOpenedChange,
        hasBackdrop: true,
        isOpen: false,
        usePortal: true,
    };
    const TEST_PROPS_OPEN: TestComponentProps = {
        ...TEST_PROPS_CLOSED,
        isOpen: true,
    };

    afterEach(() => {
        handleLastOpenedChange.resetHistory();
    });

    describe("with <OverlaysProvider>", () => {
        it("should render without crashing", () => {
            render(<TestComponentWithProvider {...TEST_PROPS_CLOSED} />);
        });

        it("opening an overlay should change the result of getLastOpened()", () => {
            const { rerender } = render(<TestComponentWithProvider {...TEST_PROPS_CLOSED} />);
            // we need to re-render twice: the overlay is added to the stack _after_ the first re-render completes,
            // so it wont' trigger a change in getLastOpened() until the second re-render.
            rerender(<TestComponentWithProvider {...TEST_PROPS_OPEN} />);
            rerender(<TestComponentWithProvider {...TEST_PROPS_OPEN} />);
            expect(
                handleLastOpenedChange.calledOnce,
                `expected getLastOpened() result to change after re-rendering with isOpen={true}`,
            ).to.be.true;
            const lastOpenedInstance = handleLastOpenedChange.getCall(0).args[0] as OverlayInstance;
            expect(lastOpenedInstance).to.exist;
            expect(containerRef.current).to.exist;
            expect(lastOpenedInstance.containerElement.current).to.equal(containerRef.current);
        });
    });

    describe("without <OverlaysProvider>", () => {
        before(() => {
            // ensure there is a clean global state that might be polluted by other test suites
            modifyGlobalStack(s => s.splice(0, s.length));
        });

        it("should render without crashing", () => {
            render(<TestComponentWithoutProvider {...TEST_PROPS_CLOSED} />);
        });

        it("opening an overlay should change the result of getLastOpened()", () => {
            const { rerender } = render(<TestComponentWithoutProvider {...TEST_PROPS_CLOSED} />);
            // we need to re-render twice: the overlay is added to the stack _after_ the first re-render completes,
            // so it wont' trigger a change in getLastOpened() until the second re-render.
            rerender(<TestComponentWithoutProvider {...TEST_PROPS_OPEN} />);
            rerender(<TestComponentWithoutProvider {...TEST_PROPS_OPEN} />);
            expect(
                handleLastOpenedChange.callCount > 0,
                `expected getLastOpened() result to change after re-rendering with isOpen={true}`,
            ).to.be.true;
            const lastOpenedInstance = handleLastOpenedChange.getCall(0).args[0] as OverlayInstance;
            expect(lastOpenedInstance).to.exist;
            expect(containerRef.current).to.exist;
            expect(
                lastOpenedInstance.containerElement.current === containerRef.current,
                "expected last opened overlay container element ref to be the same as the ref passed through props",
            ).to.be.true;
        });
    });
});
