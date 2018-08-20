---
tag: new
---

@# Divider

`Divider` visually separate contents with a thin line and margin on all sides.

@reactExample DividerExample

@## Props

The `fill` modifier controls the margin on the ends of the line.

The `vertical` modifier specifies the orientation of the line's _container_ and
the line will appear perpendicular to this, such that `<Divider vertical />`
will render a _horizontal_ line for consistency with other uses of the
`vertical` modifier such as `<ButtonGroup vertical />` .

@interface IDividerProps
