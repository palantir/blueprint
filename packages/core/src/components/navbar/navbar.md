@# Navbar

__Navbar__ presents useful navigation controls at the top of an application.

@reactExample NavbarExample

@## Usage

The __Navbar__ API includes four stateless React components:

*   __Navbar__
*   __NavbarGroup__ (aliased as `Navbar.Group`)
*   __NavbarHeading__ (aliased as `Navbar.Heading`)
*   __NavbarDivider__ (aliased as `Navbar.Divider`)

These components are simple containers for their children. Each of them supports the full range of HTML `<div>`
DOM attributes.

```tsx
<Navbar>
    <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Blueprint</Navbar.Heading>
        <Navbar.Divider />
        <Button className="@ns-minimal" icon="home" text="Home" />
        <Button className="@ns-minimal" icon="document" text="Files" />
    </Navbar.Group>
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

@css navbar-container

@## Props interface

@interface NavbarProps

@interface NavbarGroupProps

@interface NavbarHeadingProps

@interface NavbarDividerProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use `<Navbar>`

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Use the following classes to construct a navbar:

*   `nav.@ns-navbar` &ndash; The parent element. Use a `<nav>` element for accessibility.
*   `.@ns-navbar-group.@ns-align-(left|right)` &ndash; Left- or right-aligned group.
*   `.@ns-navbar-heading` &ndash; Larger text for your application title.
*   `.@ns-navbar-divider` &ndash; Thin vertical line that can be placed between groups of elements.

@css navbar
