/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Efficiently detect when an HTMLElement is resized.
 *
 * Attaches an invisible "resize-sensor" div to the element. Then it checks
 * the element's offsetWidth and offsetHeight whenever a scroll event is
 * triggered on the "resize-sensor" children. These events are further
 * debounced using requestAnimationFrame.
 *
 * Inspired by: https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
 */
export class ResizeSensor {
    public static attach(element: HTMLElement, callback: () => void) {
        const lifecycle = ResizeSensor.debounce(callback);

        const resizeSensor = document.createElement("div") as HTMLElement;
        resizeSensor.className = "bp-table-resize-sensor";
        resizeSensor.style.cssText = ResizeSensor.RESIZE_SENSOR_STYLE;
        resizeSensor.innerHTML = ResizeSensor.RESIZE_SENSOR_HTML;

        element.appendChild(resizeSensor);

        if (getComputedStyle(element, null).getPropertyValue("position") === "static") {
            element.style.position = "relative";
        }

        const expand = resizeSensor.childNodes[0] as HTMLElement;
        const expandChild = expand.childNodes[0] as HTMLElement;
        const shrink = resizeSensor.childNodes[1] as HTMLElement;

        const reset = () => {
            expandChild.style.width  = "100000px";
            expandChild.style.height = "100000px";
            expand.scrollLeft = 100000;
            expand.scrollTop = 100000;
            shrink.scrollLeft = 100000;
            shrink.scrollTop = 100000;
        };
        reset();

        let lastWidth: number;
        let lastHeight: number;
        const onScroll = () => {
            const currentWidth = element.offsetWidth;
            const currentHeight = element.offsetHeight;
            if (currentWidth !== lastWidth || currentHeight !== lastHeight) {
                lastWidth = currentWidth;
                lastHeight = currentHeight;
                lifecycle.trigger();
            }
            reset();
        };
        expand.addEventListener("scroll", onScroll);
        shrink.addEventListener("scroll", onScroll);

        return () => {
            element.removeChild(resizeSensor);
            lifecycle.cancelled = true;
        };
    }

    private static RESIZE_SENSOR_STYLE = "position: absolute; left: 0; top: 0; right: 0; " +
        "bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;";

    private static RESIZE_SENSOR_HTML = `<div class="bp-table-resize-sensor-expand"
        style="${ResizeSensor.RESIZE_SENSOR_STYLE}"><div style="position: absolute; left: 0; top: 0; transition: 0s;"
        ></div></div><div class="bp-table-resize-sensor-shrink" style="${ResizeSensor.RESIZE_SENSOR_STYLE}"
        ><div style="position: absolute; left: 0; top: 0; transition: 0s; width: 200%; height: 200%;"></div></div>`;

    private static debounce(callback: () => void) {
        const scope = {
            cancelled: false,
            trigger: () => {
                if (scope.triggered || scope.cancelled) {
                    return;
                }
                scope.triggered = true;
                requestAnimationFrame(() => {
                    scope.triggered = false;
                    if (!scope.cancelled) {
                        callback();
                    }
                });
            },
            triggered: false,
        };
        return scope;
    }
}
