@# Navbars

Navbars present useful navigation controls at the top of an application.

The `.@ns-navbar` CSS component can have up to two groups of elements: a left-aligned group and a
right-aligned group. These groups can contain multiple elements, which are laid out horizontally.

@## CSS API

Use the following classes to construct a navbar:

* `nav.@ns-navbar` &ndash; The parent element. Use a `<nav>` element for accessibility.
* `.@ns-navbar-group.@ns-align-(left|right)` &ndash; Left- or right-aligned group.
* `.@ns-navbar-heading` &ndash; Larger text for your application title.
* `.@ns-navbar-divider` &ndash; Thin vertical line that can be placed between groups of elements.

@css navbar

@### Fixed to viewport top

Add the `.@ns-fixed-top` class to the `.@ns-navbar` to attach it to the top of the viewport using
`position: fixed; top: 0;`. This is so-called "sticky" behavior: the navbar stays at the top of the
screen as the user scrolls through the document.

This modifier is not illustrated here because it breaks the documentation flow.

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-callout-title">Body padding required</h4>
    The fixed navbar will lie on top of your other content unless you add padding to the top of the
    `<body>` element equal to the height of the navbar. Use the `$pt-navbar-height` Sass variable to
    access the height of the navbar (50px).
</div>

@### Fixed width

If your application is inside a fixed-width container (instead of spanning the entire viewport), you
can align the navbar to match.

Wrap your `.@ns-navbar-group`s in an element with your desired `width` and `margin: 0 auto;` to
horizontally center it.

@css navbar-container

@## JavaScript API

The `Navbar` component is available in the **@blueprintjs/core** package. The
package also includes three small helper components: `NavbarGroup`,
`NavbarHeading`, and `NavbarDivider`. These can be referenced by their aliases
as well: `Navbar.Group`, `Navbar.Heading`, and `Navbar.Divider`, respectively.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

These components are simple wrappers around the corresponding CSS APIs. Each of
them supports the full range of HTML props.

```tsx
<Navbar>
    <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>Blueprint</NavbarHeading>
        <NavbarDivider />
        <Button className="@ns-minimal" icon="home" text="Home" />
        <Button className="@ns-minimal" icon="document" text="Files" />
    </NavbarGroup>
</Navbar>
```

@reactExample NavbarExample

@interface INavbarProps
@interface INavbarGroupProps
@interface INavbarHeadingProps
@interface INavbarDividerProps
