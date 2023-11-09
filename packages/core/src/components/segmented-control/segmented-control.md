---
tag: new
---

@# Segmented control

A **SegmentedControl** is a linear collection of buttons which allows a user to choose an option from multiple choices,
similar to a [**Radio**](#core/components/radio) group.

Compared to the [**ButtonGroup**](#core/components/button-group) component, **SegmentedControl** has affordances
to signify a selection UI and a reduced visual weight which is appropriate for forms.

@reactExample SegmentedControlExample

@## Usage

**SegmentedControl** can be used as either a controlled or uncontrolled component with the `value`, `defaultValue`,
and `onChange` props.

Options are specified as `OptionProps` objects, just like [RadioGroup](#core/components/radio.radiogroup) and
[HTMLSelect](#core/components/html-select).

```tsx
<SegmentedControl
    options={[
        {
            label: "List",
            value: "list",
        },
        {
            label: "Grid",
            value: "grid",
        },
        {
            label: "Gallery",
            value: "gallery",
        },
    ]}
    defaultValue="list"
/>
```

@## Props interface

@interface SegmentedControlProps
