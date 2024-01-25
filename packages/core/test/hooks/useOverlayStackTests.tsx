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
        // TODO: implement
    }, []);

    const handleDocumentFocus = React.useCallback((_e: FocusEvent) => {
        // TODO: implement
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
    const DEFAULT_PROPS: TestComponentProps = {
        autoFocus: true,
        containerRef,
        enforceFocus: true,
        handleLastOpenedChange,
        hasBackdrop: true,
        isOpen: false,
        usePortal: true,
    };

    afterEach(() => {
        handleLastOpenedChange.resetHistory();
    });

    describe("with <OverlaysProvider>", () => {
        it("should render without crashing", () => {
            render(<TestComponentWithProvider {...DEFAULT_PROPS} />);
        });

        it("opening an overlay should change the result of getLastOpened()", () => {
            const { rerender } = render(<TestComponentWithProvider {...DEFAULT_PROPS} />);
            rerender(<TestComponentWithProvider {...DEFAULT_PROPS} isOpen={true} />);
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
        it("should render without crashing", () => {
            render(<TestComponentWithoutProvider {...DEFAULT_PROPS} />);
        });

        it("opening an overlay should change the result of getLastOpened()", () => {
            const { rerender } = render(<TestComponentWithoutProvider {...DEFAULT_PROPS} />);
            rerender(<TestComponentWithoutProvider {...DEFAULT_PROPS} isOpen={true} />);
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
});
