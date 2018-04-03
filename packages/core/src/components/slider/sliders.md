@# Sliders

A slider is a numeric input for choosing one or two numbers between lower and upper bounds.
The `Slider` component also has a labeled axis that supports custom formatting.

To adjust a slider value, the user clicks and drags a handle or clicks the axis to move the nearest
handle to that spot. Users can also use arrow keys on the keyboard to adjust the value.

Use `Slider` for choosing a single value and `RangeSlider` for choosing two values.

@## Single slider

`Slider` is a controlled component, so the `value` prop determines its current appearance. Provide
an `onChange` handler to receive updates and an `onRelease` handler to determine when the user has
stopped interacting with the slider.

@reactExample SliderExample

@interface ISliderProps

@## Range slider

`RangeSlider` allows the user to choose a range between upper and lower bounds. The component
functions identically to `Slider` except that the user can select both ends of the range. It exposes
its selected value as `[number, number]`: a two-element array with minimum and maximum range bounds.

`RangeSlider` is a controlled component, so the `value` prop determines its current appearance.
Provide an `onChange` handler to receive updates and an `onRelease` handler to determine when the
user has stopped interacting with the slider.

@reactExample RangeSliderExample

@interface IRangeSliderProps

