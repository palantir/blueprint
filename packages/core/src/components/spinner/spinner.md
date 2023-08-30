@# Spinner

__Spinners__ indicate progress in a circular fashion. They're great for ongoing operations of indeterminate length and
can also represent known progress.

@reactExample SpinnerExample

@## Usage

__Spinner__ is a simple stateless component that renders SVG markup. It can be used safely in DOM and SVG containers as
it only renders SVG elements.

The `value` prop determines how much of the track is filled by the head. When this prop is defined, the spinner head
will smoothly animate as `value` changes. Omitting `value` will result in an "indeterminate" spinner where the head
spins indefinitely (this is the default appearance).

The `size` prop determines the pixel width/height of the spinner. Size constants are provided as an enum:
`SpinnerSize.SMALL`, `SpinnerSize.STANDARD`, and `SpinnerSize.LARGE`

@## Props interface

@interface SpinnerProps
