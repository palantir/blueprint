/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IClientCoordinates, ICoordinateData, IDragHandler } from "./draggable";

export class DragEvents {
    public static DOUBLE_CLICK_TIMEOUT_MSEC = 500;

    /**
     * Returns true if the event includes a modifier key that often adds the result of the drag
     * event to any existing state. For example, holding CTRL before dragging may select another
     * region in addition to an existing one, while the absence of a modifier key may clear the
     * existing selection first.
     * @param event the mouse event for the drag interaction
     */
    public static isAdditive(event: MouseEvent) {
        return event.ctrlKey || event.metaKey;
    }

    private handler: IDragHandler;
    private element: HTMLElement;

    private activationCoordinates: IClientCoordinates;
    private doubleClickTimeoutToken: number;
    private isActivated: boolean;
    private isDragging: boolean;
    private lastCoordinates: IClientCoordinates;

    public attach(element: HTMLElement, handler: IDragHandler) {
        this.detach();
        this.handler = handler;
        this.element = element;

        if (this.isValidDragHandler(handler)) {
            this.element.addEventListener("mousedown", this.handleMouseDown);
        }
        return this;
    }

    public detach() {
        if (this.element != null) {
            this.element.removeEventListener("mousedown", this.handleMouseDown);
            this.detachDocumentEventListeners();
        }
    }

    private isValidDragHandler(handler: IDragHandler) {
        return handler != null && (handler.onActivate != null
            || handler.onDragMove != null
            || handler.onDragEnd != null
            || handler.onClick != null
            || handler.onDoubleClick != null);
    }

    private attachDocumentEventListeners() {
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    private detachDocumentEventListeners() {
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    private initCoordinateData(event: MouseEvent) {
        this.activationCoordinates = [event.clientX, event.clientY];
        this.lastCoordinates = this.activationCoordinates;
    }

    private updateCoordinateData(event: MouseEvent) {
        const currentCoordinates = [event.clientX, event.clientY];
        const deltaCoordinates = [
            currentCoordinates[0] - this.lastCoordinates[0],
            currentCoordinates[1] - this.lastCoordinates[1],
        ];
        const offsetCoordinates = [
            currentCoordinates[0] - this.activationCoordinates[0],
            currentCoordinates[1] - this.activationCoordinates[1],
        ];
        const data = {
            activation: this.activationCoordinates,
            current: currentCoordinates,
            delta: deltaCoordinates,
            last: this.lastCoordinates,
            offset: offsetCoordinates,
        } as ICoordinateData;
        this.lastCoordinates = [event.clientX, event.clientY];
        return data;
    }

    private maybeAlterEventChain(event: MouseEvent) {
        if (this.handler.preventDefault) {
            event.preventDefault();
        }
        if (this.handler.stopPropagation) {
            event.stopPropagation();
        }
        if (this.handler.stopImmediatePropagation) {
            console.log("dragEvents.ts: stopImmediatePropagation!");
            event.stopImmediatePropagation();
        }
    }

    private handleMouseDown = (event: MouseEvent) => {
        this.initCoordinateData(event);

        if (this.handler != null && this.handler.onActivate != null) {
            const exitCode = this.handler.onActivate(event);
            if (exitCode === false) {
                return;
            }
        }

        this.isActivated = true;
        this.maybeAlterEventChain(event);

        // It is possible that the mouseup would not be called after the initial
        // mousedown (for example if the mouse is moved out of the window). So,
        // we preemptively detach to avoid duplicate listeners.
        this.detachDocumentEventListeners();
        this.attachDocumentEventListeners();
    }

    private handleMouseMove = (event: MouseEvent) => {
        this.maybeAlterEventChain(event);

        if (this.isActivated) {
            this.isDragging = true;
        }

        if (this.isDragging) {
            const coords = this.updateCoordinateData(event);

            if (this.handler != null && this.handler.onDragMove != null) {
                this.handler.onDragMove(event, coords);
            }
        }
    }

    private handleMouseUp = (event: MouseEvent) => {
        this.maybeAlterEventChain(event);

        if (this.handler != null) {
            if (this.isDragging) {
                const coords = this.updateCoordinateData(event);

                if (this.handler.onDragMove != null) {
                    this.handler.onDragMove(event, coords);
                }

                if (this.handler.onDragEnd != null) {
                    this.handler.onDragEnd(event, coords);
                }
            } else if (this.isActivated) {
                if (this.handler.onDoubleClick != null) {

                    if (this.doubleClickTimeoutToken == null) {
                        // if this the first click of a possible double-click,
                        // we delay the firing of the click event by the
                        // timeout.
                        this.doubleClickTimeoutToken = setTimeout(() => {
                            delete this.doubleClickTimeoutToken;
                            if (this.handler.onClick != null) {
                                this.handler.onClick(event);
                            }
                        }, DragEvents.DOUBLE_CLICK_TIMEOUT_MSEC);
                    } else {
                        // otherwise, this is the second click in the double-
                        // click so we cancel the single-click timeout and
                        // fire the double-click event.
                        clearTimeout(this.doubleClickTimeoutToken);
                        delete this.doubleClickTimeoutToken;
                        this.handler.onDoubleClick(event);
                    }

                } else if (this.handler.onClick != null) {
                    this.handler.onClick(event);
                }
            }
         }

        this.isActivated = false;
        this.isDragging = false;
        this.detachDocumentEventListeners();
    }
}
