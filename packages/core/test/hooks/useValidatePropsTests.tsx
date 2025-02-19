/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render } from "@testing-library/react";
import { expect } from "chai";
import * as React from "react";
import * as sinon from "sinon";

import { useValidateProps } from "../../src/hooks/useValidateProps";

describe("useValidateProps", () => {
    const validatorSpy = sinon.spy();

    beforeEach(() => {
        validatorSpy.resetHistory();
    });

    const TestComponent: React.FC<{ value?: number }> = ({ value }) => {
        useValidateProps(validatorSpy, [value]);
        return null;
    };

    it("calls validator in development environment", () => {
        render(<TestComponent />);
        expect(validatorSpy.called).to.be.true;
    });

    it.skip("does not call validator in production environment", () => {
        // TODO: figure out how to test this
    });

    it("calls validator when dependencies change", () => {
        const { rerender } = render(<TestComponent value={1} />);
        expect(validatorSpy.callCount).to.equal(1);

        rerender(<TestComponent value={2} />);
        expect(validatorSpy.callCount).to.equal(2);
    });

    it("does not call validator when dependencies haven't changed", () => {
        const { rerender } = render(<TestComponent value={1} />);

        rerender(<TestComponent value={1} />);
        expect(validatorSpy.callCount).to.equal(1);
    });
});
