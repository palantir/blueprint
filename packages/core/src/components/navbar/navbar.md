@# Navbar

**Navbar** presents useful navigation controls at the top of an application.

@## Import

```tsx
import { Navbar } from "@blueprintjs/core";
```

@reactExample NavbarExample

@## Usage

The **Navbar** API includes four stateless React components:

-   **Navbar**
-   **NavbarGroup** (aliased as `Navbar.Group`)
-   **NavbarHeading** (aliased as `Navbar.Heading`)
-   **NavbarDivider** (aliased as `Navbar.Divider`)

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">
    Nested components are deprecated

</h5>

Use of the nested components such as `<Navbar.Group>` is deprecated. Use the top-level components (e.g. `<NavbarGroup>`)
instead.

</div>

These components are simple containers for their children. Each of them supports the full range of HTML `<div>`
DOM attributes.

```tsx
<Navbar>
    <NavbarGroup align={Alignment.START}>
        <NavbarHeading>Blueprint</NavbarHeading>
        <NavbarDivider />
        <Button className="@ns-minimal" icon="home" text="Home" />
        <Button className="@ns-minimal" icon="document" text="Files" />
    </NavbarGroup>
</Navbar>
```

@### Fixed to viewport top

Enable the `fixedToTop` prop to attach a navbar to the top of the viewport using `position: fixed; top: 0;`. This is
so-called "sticky" behavior: the navbar stays at the top of the screen as the user scrolls through the document.

This modifier is not illustrated here because it breaks the document flow.

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">Body padding required</h5>

The fixed navbar will lie on top of your other content unless you add padding to the top of the `<body>` element equal
to the height of the navbar. Use the `$pt-navbar-height` Sass variable.

</div>

@### Fixed width

If your application is inside a fixed-width container (instead of spanning the entire viewport), you can align the
navbar to match by wrap your navbar groups in an element with your desired `width` and `margin: 0 auto;` to horizontally
center it.

@reactCodeExample NavbarFixedWidthExample

@## Props interface

@interface NavbarProps

@interface NavbarGroupProps

@interface NavbarHeadingProps

@interface NavbarDividerProps
