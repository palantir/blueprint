/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const TAB_KEY_CODE = 9;

/* istanbul ignore next */

/**
 * A nifty little class that maintains event handlers to add a class to the container element
 * when entering "mouse mode" (on a `mousedown` event) and remove it when entering "keyboard mode"
 * (on a `tab` key `keydown` event).
 */
export class InteractionModeEngine {
    private isRunning = false;

    // tslint:disable-next-line:no-constructor-vars
    constructor(private container: Element, private className: string) {}

    /** Returns whether the engine is currently running. */
    public isActive() {
        return this.isRunning;
    }

    /** Enable behavior which applies the given className when in mouse mode. */
    public start() {
        this.container.addEventListener("mousedown", this.handleMouseDown);
        this.isRunning = true;
    }

    /** Disable interaction mode behavior and remove className from container. */
    public stop() {
        this.reset();
        this.isRunning = false;
    }

    private reset() {
        this.container.classList.remove(this.className);
        this.container.removeEventListener("keydown", this.handleKeyDown);
        this.container.removeEventListener("mousedown", this.handleMouseDown);
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (e.which === TAB_KEY_CODE) {
            this.reset();
            this.container.addEventListener("mousedown", this.handleMouseDown);
        }
    };

    private handleMouseDown = () => {
        this.reset();
        this.container.classList.add(this.className);
        this.container.addEventListener("keydown", this.handleKeyDown);
    };
}
