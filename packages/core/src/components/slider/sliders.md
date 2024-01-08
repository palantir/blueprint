@# Slider

A slider is a numeric input for choosing numbers between lower and upper bounds.
It also has a labeled axis that supports custom formatting.

To adjust a slider value, the user clicks and drags a handle or clicks the axis
to move the nearest handle to that spot. Users can also use arrow keys on the
keyboard to adjust individual handles.

Use `Slider` for choosing a single value, `RangeSlider` for choosing two values,
and `MultiSlider` for more advanced use cases.

@## Slider

Use `Slider` to choose a single value on a number line. It is a controlled
component, so the `value` prop determines its current appearance. Provide an
`onChange` handler to receive updates and an `onRelease` handler to determine
when the user has stopped interacting with the slider.

@reactExample SliderExample

@interface SliderProps

@## Range slider

Use `RangeSlider` to choose a range between upper and lower bounds. The
component functions identically to `Slider` with the addition of a second
handle. It exposes its selected value as `[number, number]`: a two-element array
with minimum and maximum range bounds.

`RangeSlider` is a controlled component, so the `value` prop determines its
current appearance. Provide an `onChange` handler to receive updates and an
`onRelease` handler to determine when the user has stopped interacting with the
slider.

@reactExample RangeSliderExample

@interface RangeSliderProps

@## Multi slider

`MultiSlider` is a flexible solution for picking arbitrary values on a number
line. It powers both `Slider` and `RangeSlider` internally and can be used for
implementing more advanced use cases than one or two numbers.

@reactExample MultiSliderExample

@interface MultiSliderProps

@### Handle

Handles for a `MultiSlider` are configured as `MultiSlider.Handle` children
elements, each with their own `value` and other properties.

```tsx
// RangeSlider looks roughly like this:
<MultiSlider onChange={...}>
    <MultiSlider.Handle
        value={startValue}
        type="start"
        intentAfter={Intent.PRIMARY}
        htmlProps={handleHtmlProps.start}
    />
    <MultiSlider.Handle
        value={endValue}
        type="end"
        htmlProps={handleHtmlProps.end}
    />
</MultiSlider>
```

@interface HandleProps
