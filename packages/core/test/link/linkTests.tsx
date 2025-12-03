/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { expect } from "chai";
import { createRef } from "react";

import { Classes, Intent, Link } from "../../src";

describe("<Link>", () => {
    it("should render an anchor tag with href", () => {
        render(<Link href="/test">Test</Link>);
        const link = screen.getByRole("link", { name: "Test" });

        expect(link).to.exist;
        expect(link.tagName).to.equal("A");
        expect(link.getAttribute("href")).to.equal("/test");
    });

    it("should apply base LINK class", () => {
        render(<Link href="#">Test</Link>);
        const link = screen.getByRole("link", { name: "Test" });

        expect(link.classList.contains(Classes.LINK)).to.be.true;
    });

    it("should support custom className prop", () => {
        render(
            <Link className="custom-class" href="#">
                Test
            </Link>,
        );
        const link = screen.getByRole("link", { name: "Test" });

        expect(link.classList.contains("custom-class")).to.be.true;
        expect(link.classList.contains(Classes.LINK)).to.be.true;
    });

    describe("variant prop", () => {
        it("should default to underline variant", () => {
            render(<Link href="#">Test</Link>);
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.classList.contains(Classes.LINK_UNDERLINE)).to.be.true;
            expect(link.classList.contains(Classes.LINK_PLAIN)).to.be.false;
        });

        it('should apply underline class when variant="underline"', () => {
            render(
                <Link variant="underline" href="#">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.classList.contains(Classes.LINK_UNDERLINE)).to.be.true;
            expect(link.classList.contains(Classes.LINK_PLAIN)).to.be.false;
        });

        it('should apply plain class when variant="plain"', () => {
            render(
                <Link variant="plain" href="#">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.classList.contains(Classes.LINK_PLAIN)).to.be.true;
            expect(link.classList.contains(Classes.LINK_UNDERLINE)).to.be.false;
        });
    });

    describe("color prop", () => {
        it("should default to Intent.PRIMARY", () => {
            render(<Link href="#">Test</Link>);
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.classList.contains(Classes.INTENT_PRIMARY)).to.be.true;
        });

        it("should apply PRIMARY intent class", () => {
            render(
                <Link color={Intent.PRIMARY} href="#">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.classList.contains(Classes.INTENT_PRIMARY)).to.be.true;
        });

        it("should apply SUCCESS intent class", () => {
            render(
                <Link color={Intent.SUCCESS} href="#">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.classList.contains(Classes.INTENT_SUCCESS)).to.be.true;
            expect(link.classList.contains(Classes.INTENT_PRIMARY)).to.be.false;
        });

        it("should apply WARNING intent class", () => {
            render(
                <Link color={Intent.WARNING} href="#">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.classList.contains(Classes.INTENT_WARNING)).to.be.true;
        });

        it("should apply DANGER intent class", () => {
            render(
                <Link color={Intent.DANGER} href="#">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.classList.contains(Classes.INTENT_DANGER)).to.be.true;
        });

        it('should apply color-inherit class when color="inherit"', () => {
            render(
                <Link color="inherit" href="#">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.classList.contains(Classes.LINK_COLOR_INHERIT)).to.be.true;
            expect(link.classList.contains(Classes.INTENT_PRIMARY)).to.be.false;
        });
    });

    describe("HTML attributes", () => {
        it("should pass through target attribute", () => {
            render(
                <Link target="_blank" href="#">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.getAttribute("target")).to.equal("_blank");
        });

        it("should forward standard HTML attributes", () => {
            render(
                <Link href="/test" title="Link Title" id="test-link" data-testid="custom-test-id">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Test" });

            expect(link.getAttribute("title")).to.equal("Link Title");
            expect(link.getAttribute("id")).to.equal("test-link");
            expect(link.getAttribute("data-testid")).to.equal("custom-test-id");
        });

        it("should support aria attributes", () => {
            render(
                <Link href="#" aria-label="Custom Label" aria-describedby="description">
                    Test
                </Link>,
            );
            const link = screen.getByRole("link", { name: "Custom Label" });

            expect(link.getAttribute("aria-label")).to.equal("Custom Label");
            expect(link.getAttribute("aria-describedby")).to.equal("description");
        });
    });

    describe("ref forwarding", () => {
        it("should forward ref to anchor element", () => {
            const ref = createRef<HTMLAnchorElement>();
            render(
                <Link ref={ref} href="#">
                    Test
                </Link>,
            );

            expect(ref.current).to.exist;
            expect(ref.current).to.be.instanceOf(HTMLAnchorElement);
            expect(ref.current?.tagName).to.equal("A");
        });
    });
});
