/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { createRef, useState } from "react";
import { flushSync } from "react-dom";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Draggable } from "./draggable";

function click(target: HTMLElement) {
    fireEvent.mouseDown(target);
    fireEvent.mouseUp(document);
}

describe("<Draggable>", () => {
    it.each([true, false])("moves listeners to a replaced child with an external ref=%s", external => {
        const targetRef = external ? createRef<HTMLDivElement>() : undefined;
        const onClick = vi.fn();
        const target = (key: string) => (
            <Draggable targetRef={targetRef} onClick={onClick}>
                <div key={key} ref={targetRef}>
                    {key}
                </div>
            </Draggable>
        );
        const { rerender, unmount } = render(target("first"));
        const first = screen.getByText("first");
        click(first);
        expect(onClick).toHaveBeenCalledTimes(1);

        rerender(target("second"));
        const second = screen.getByText("second");
        click(first);
        expect(onClick).toHaveBeenCalledTimes(1);
        click(second);
        expect(onClick).toHaveBeenCalledTimes(2);

        unmount();
        click(second);
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("uses a replacement targetRef object", () => {
        const firstRef = createRef<HTMLDivElement>();
        const secondRef = createRef<HTMLDivElement>();
        const onClick = vi.fn();
        const target = (ref: React.RefObject<HTMLDivElement>, key: string) => (
            <Draggable targetRef={ref} onClick={onClick}>
                <div ref={ref} key={key}>
                    {key}
                </div>
            </Draggable>
        );
        const { rerender } = render(target(firstRef, "first"));
        const first = screen.getByText("first");
        rerender(target(secondRef, "second"));
        click(first);
        expect(onClick).not.toHaveBeenCalled();
        click(screen.getByText("second"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("detaches a cleared target and attaches when it becomes available again", () => {
        const targetRef = createRef<HTMLDivElement>();
        const onClick = vi.fn();
        const target = (visible: boolean) => (
            <Draggable targetRef={targetRef} onClick={onClick}>
                {visible ? <div ref={targetRef}>Target</div> : <span>Empty</span>}
            </Draggable>
        );
        const { rerender } = render(target(false));
        rerender(target(true));
        const first = screen.getByText("Target");
        click(first);
        expect(onClick).toHaveBeenCalledTimes(1);

        rerender(target(false));
        click(first);
        expect(onClick).toHaveBeenCalledTimes(1);
        rerender(target(true));
        click(screen.getByText("Target"));
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("keeps an ongoing drag across updates that retain the target", () => {
        const onDragMove = vi.fn();
        const onDragEnd = vi.fn();
        const target = (text: string) => (
            <Draggable onDragMove={onDragMove} onDragEnd={onDragEnd}>
                <div>{text}</div>
            </Draggable>
        );
        const { rerender, unmount } = render(target("first"));
        fireEvent.mouseDown(screen.getByText("first"), { clientX: 1, clientY: 2 });
        fireEvent.mouseMove(document, { clientX: 4, clientY: 6 });
        rerender(target("second"));
        fireEvent.mouseMove(document, { clientX: 7, clientY: 10 });
        fireEvent.mouseUp(document, { clientX: 8, clientY: 12 });
        expect(onDragMove).toHaveBeenCalledTimes(3);
        expect(onDragEnd).toHaveBeenCalledExactlyOnceWith(
            expect.any(MouseEvent),
            expect.objectContaining({ activation: [1, 2], current: [8, 12], offset: [7, 10] }),
        );

        fireEvent.mouseDown(screen.getByText("second"));
        unmount();
        fireEvent.mouseMove(document);
        fireEvent.mouseUp(document);
        expect(onDragMove).toHaveBeenCalledTimes(3);
        expect(onDragEnd).toHaveBeenCalledTimes(1);
    });

    it("ends document listening when an active target disappears", () => {
        const targetRef = createRef<HTMLDivElement>();
        const onDragMove = vi.fn();
        const onDragEnd = vi.fn();
        const target = (visible: boolean) => (
            <Draggable targetRef={targetRef} onDragMove={onDragMove} onDragEnd={onDragEnd}>
                {visible ? <div ref={targetRef}>Target</div> : <span>Empty</span>}
            </Draggable>
        );
        const { rerender, unmount } = render(target(true));
        fireEvent.mouseDown(screen.getByText("Target"));
        rerender(target(false));
        fireEvent.mouseMove(document);
        fireEvent.mouseUp(document);
        expect(onDragMove).not.toHaveBeenCalled();
        expect(onDragEnd).not.toHaveBeenCalled();
        unmount();
        fireEvent.mouseMove(document);
        fireEvent.mouseUp(document);
        expect(onDragMove).not.toHaveBeenCalled();
        expect(onDragEnd).not.toHaveBeenCalled();
    });

    it.each([true, false])("cancels a moved drag before replacing its target through null=%s", throughNull => {
        const targetRef = createRef<HTMLDivElement>();
        const onClick = vi.fn();
        const onDragMove = vi.fn();
        const onDragEnd = vi.fn();
        const target = (key?: string) => (
            <Draggable targetRef={targetRef} onClick={onClick} onDragMove={onDragMove} onDragEnd={onDragEnd}>
                {key === undefined ? (
                    <span>Empty</span>
                ) : (
                    <div key={key} ref={targetRef}>
                        {key}
                    </div>
                )}
            </Draggable>
        );
        const { rerender } = render(target("first"));
        fireEvent.mouseDown(screen.getByText("first"), { clientX: 1, clientY: 2 });
        fireEvent.mouseMove(document, { clientX: 5, clientY: 8 });
        expect(onDragMove).toHaveBeenCalledTimes(1);
        if (throughNull) {
            rerender(target());
        }
        rerender(target("second"));
        fireEvent.mouseUp(document);
        expect(onDragMove).toHaveBeenCalledTimes(1);
        expect(onDragEnd).not.toHaveBeenCalled();

        click(screen.getByText("second"));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onDragMove).toHaveBeenCalledTimes(1);
        expect(onDragEnd).not.toHaveBeenCalled();
    });

    it.each([true, false])("cancels pending clicks when the target is removed by unmount=%s", unmountTarget => {
        vi.useFakeTimers();
        try {
            const onClick = vi.fn();
            const onDoubleClick = vi.fn();
            const target = (key: string) => (
                <Draggable onClick={onClick} onDoubleClick={onDoubleClick}>
                    <div key={key}>{key}</div>
                </Draggable>
            );
            const { rerender, unmount } = render(target("first"));
            click(screen.getByText("first"));
            if (unmountTarget) {
                unmount();
            } else {
                rerender(target("second"));
            }
            vi.advanceTimersByTime(500);
            expect(onClick).not.toHaveBeenCalled();
            expect(onDoubleClick).not.toHaveBeenCalled();
            if (!unmountTarget) {
                click(screen.getByText("second"));
                expect(onDoubleClick).not.toHaveBeenCalled();
                vi.advanceTimersByTime(500);
                expect(onClick).toHaveBeenCalledTimes(1);
            }
        } finally {
            vi.useRealTimers();
        }
    });

    it("cancels activation when onActivate synchronously replaces the target", () => {
        const onClick = vi.fn();
        function ReplacingTarget() {
            const [key, setKey] = useState("first");
            return (
                <Draggable
                    onActivate={() => {
                        flushSync(() => setKey("second"));
                        return true;
                    }}
                    onClick={onClick}
                >
                    <div key={key}>{key}</div>
                </Draggable>
            );
        }
        render(<ReplacingTarget />);
        fireEvent.mouseDown(screen.getByText("first"));
        fireEvent.mouseUp(document);
        expect(onClick).not.toHaveBeenCalled();
        click(screen.getByText("second"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("cancels drag end when the final onDragMove synchronously replaces the target", () => {
        const onClick = vi.fn();
        const onDragEnd = vi.fn();
        function ReplacingTarget() {
            const [key, setKey] = useState("first");
            return (
                <Draggable
                    onClick={onClick}
                    onDragEnd={onDragEnd}
                    onDragMove={event => {
                        if (event.type === "mouseup") {
                            flushSync(() => setKey("second"));
                        }
                    }}
                >
                    <div key={key}>{key}</div>
                </Draggable>
            );
        }
        render(<ReplacingTarget />);
        fireEvent.mouseDown(screen.getByText("first"));
        fireEvent.mouseMove(document, { clientX: 5, clientY: 8 });
        fireEvent.mouseUp(document, { clientX: 6, clientY: 9 });
        expect(onDragEnd).not.toHaveBeenCalled();
        click(screen.getByText("second"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("preserves delayed clicks and double clicks", () => {
        vi.useFakeTimers();
        try {
            const onClick = vi.fn();
            const onDoubleClick = vi.fn();
            render(
                <Draggable onClick={onClick} onDoubleClick={onDoubleClick}>
                    <div>Target</div>
                </Draggable>,
            );
            const target = screen.getByText("Target");
            click(target);
            expect(onClick).not.toHaveBeenCalled();
            vi.advanceTimersByTime(500);
            expect(onClick).toHaveBeenCalledTimes(1);

            click(target);
            click(target);
            expect(onDoubleClick).toHaveBeenCalledTimes(1);
            vi.advanceTimersByTime(500);
            expect(onClick).toHaveBeenCalledTimes(1);
        } finally {
            vi.useRealTimers();
        }
    });

    it("updates event flags without replacing the target", () => {
        const onParentMouseDown = vi.fn();
        const onClick = vi.fn();
        const target = (preventDefault: boolean, stopPropagation: boolean) => (
            <div onMouseDown={onParentMouseDown}>
                <Draggable preventDefault={preventDefault} stopPropagation={stopPropagation} onClick={onClick}>
                    <div>Target</div>
                </Draggable>
            </div>
        );
        const { rerender } = render(target(false, false));
        expect(fireEvent.mouseDown(screen.getByText("Target"))).toBe(true);
        fireEvent.mouseUp(document);
        expect(onParentMouseDown).toHaveBeenCalledTimes(1);

        rerender(target(true, true));
        expect(fireEvent.mouseDown(screen.getByText("Target"))).toBe(false);
        fireEvent.mouseUp(document);
        expect(onParentMouseDown).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledTimes(2);
    });
});
