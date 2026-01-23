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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { spy } from "sinon";

import { IconNames } from "@blueprintjs/icons";
import { describe, expect, test } from "@blueprintjs/test-commons/vitest";

import { AnchorButton, Button, Classes, Icon } from "../../src";

describe("<Button>", () => {
    commonTests(Button);

    test("should attach ref", () => {
        const ref = createRef<HTMLButtonElement>();
        render(<Button ref={ref} />);

        expect(ref.current).to.exist;
        expect(ref.current).to.be.instanceOf(HTMLButtonElement);
    });
});

describe("<AnchorButton>", () => {
    commonTests(AnchorButton);

    test("should attach ref", () => {
        const ref = createRef<HTMLAnchorElement>();
        render(<AnchorButton ref={ref} />);

        expect(ref.current).to.exist;
        expect(ref.current).to.be.instanceOf(HTMLAnchorElement);
    });
});

function commonTests(Component: typeof Button | typeof AnchorButton) {
    test("should render its contents", () => {
        render(<Component className="foo" text="test" />);
        const button = screen.getByRole("button", { name: "test" });

        expect(button).to.exist;
        expect(button.classList.contains(Classes.BUTTON)).to.be.true;
        expect(button.classList.contains("foo")).to.be.true;
    });

    test("should render an icon", () => {
        render(<Component icon={IconNames.STYLE} />);
        const button = screen.getByRole("button");

        expect(button.querySelector(`[data-icon="${IconNames.STYLE}"]`)).to.exist;
    });

    test("should prefer endIcon to rightIcon", () => {
        const endIcon = <Icon icon="airplane" data-testid="endIcon" />;
        const rightIcon = <Icon icon="add" data-testid="rightIcon" />;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        render(<Component endIcon={endIcon} rightIcon={rightIcon} />);

        expect(screen.getByTestId("endIcon")).to.exist;
        expect(screen.queryByTestId("rightIcon")).to.not.exist;
    });

    test("should render additional props", () => {
        render(<Component data-test-foo="bar" />);
        const button = screen.getByRole("button");

        expect(button.getAttribute("data-test-foo")).to.equal("bar");
    });

    test("should render when text prop is provided with a numeric value", () => {
        render(<Component text={0} />);
        const button = screen.getByRole("button", { name: "0" });

        expect(button).to.exist;
    });

    test("should not render a text span when children are empty", () => {
        render(<Component />);
        const button = screen.getByRole("button");

        expect(button.querySelector("span")).to.not.exist;
    });

    test("should not render a text span when text prop is empty", () => {
        render(<Component text="" />);
        const button = screen.getByRole("button");

        expect(button.querySelector("span")).to.not.exist;
    });

    test("should accept textClassName prop", () => {
        render(<Component text="text" textClassName="foo" />);
        const button = screen.getByRole("button");

        expect(button.querySelector(".foo")).to.exist;
    });

    test("should render a spinner while loading", () => {
        render(<Component loading={true} />);
        const spinner = screen.getByRole("progressbar", { name: /loading/i });

        expect(spinner).to.exist;
    });

    test("should disable button while loading", async () => {
        const onClick = spy();
        render(<Component loading={true} onClick={onClick} />);
        const button = screen.getByRole("button");

        await userEvent.click(button);

        expect(onClick.called).to.be.false;
    });

    // This tests some subtle (potentialy unexpected) behavior, but it was an API decision we
    // made a long time ago which we rely on and should not break.
    // See https://github.com/palantir/blueprint/issues/3819#issuecomment-1189478596
    test("should disable button while loading, even when disabled prop is explicity set to false", async () => {
        const onClick = spy();
        render(<Component loading={true} disabled={false} onClick={onClick} />);
        const button = screen.getByRole("button");

        await userEvent.click(button);

        expect(onClick.called).to.be.false;
    });

    test("should trigger onClick when clicked", async () => {
        const onClick = spy();
        render(<Component onClick={onClick} />);
        const button = screen.getByRole("button");

        await userEvent.click(button);

        expect(onClick.called).to.be.true;
    });

    test("should call onClick when enter key is pressed", async () => {
        const onClick = spy();
        render(<Component onClick={onClick} />);
        const button = screen.getByRole("button");

        await userEvent.type(button, "{enter}");

        expect(onClick.called).to.be.true;
    });

    test("should call onClick when space key is pressed", async () => {
        const onClick = spy();
        render(<Component onClick={onClick} />);
        const button = screen.getByRole("button");

        await userEvent.type(button, "{space}");

        expect(onClick.called).to.be.true;
    });
}
