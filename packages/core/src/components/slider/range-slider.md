@# Range slider

`RangeSlider` allows the user to choose a range between upper and lower bounds. The component
functions identically to `Slider` except that the user can select both ends of the range. It exposes
its selected value as `[number, number]`: a two-element array with minimum and maximum range bounds.

@reactExample RangeSliderExample

@## JavaScript API

The `RangeSlider` component is available in the __@blueprintjs/core__ package. Make sure to review
the [general usage docs for JS components](#components.usage).

`RangeSlider` is a controlled component, so the `value` prop determines its current appearance.
Provide an `onChange` handler to receive updates and an `onRelease` handler to determine when the
user has stopped interacting with the slider.

@interface IRangeSliderProps
