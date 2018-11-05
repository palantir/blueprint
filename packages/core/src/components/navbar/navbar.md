@# Navbar

Navbars present useful navigation controls at the top of an application.

@reactExample NavbarExample

@### Fixed to viewport top

Enable the `fixedToTop` prop to attach a navbar to the top of the viewport using
`position: fixed; top: 0;`. The navbar stays at the top of the screen and above
other elements as the user scrolls through the document.

Enable the `stickyToTop` prop to attach a navbar to the top of its parent container using
`position: sticky; top: 0;`. If navbar is placed below the top of the viewport, it will
move as the user scrolls through the document, attaching itself to the top of the viewport
once it is reached. **IE11 does not support this feature.**

These modifiers are not illustrated here because they break the document flow.

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">Body padding required</h4>
    The fixed navbar will lie on top of your other content unless you add padding to the top of the
    `<body>` element equal to the height of the navbar. Use the `$pt-navbar-height` Sass variable.
</div>

@### Fixed width

If your application is inside a fixed-width container (instead of spanning the
entire viewport), you can align the navbar to match by wrap your navbar groups
in an element with your desired `width` and `margin: 0 auto;` to horizontally
center it.

@css navbar-container

@## Props

The `Navbar` API includes four stateless React components:

* `Navbar`
* `NavbarGroup` (aliased as `Navbar.Group`)
* `NavbarHeading` (aliased as `Navbar.Heading`)
* `NavbarDivider` (aliased as `Navbar.Divider`)

These components are simple containers for their children. Each of them supports
the full range of HTML `<div>` props.

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

@interface INavbarProps

@interface INavbarGroupProps

@interface INavbarHeadingProps

@interface INavbarDividerProps

@## CSS

Use the following classes to construct a navbar:

* `nav.@ns-navbar` &ndash; The parent element. Use a `<nav>` element for accessibility.
* `.@ns-navbar-group.@ns-align-(left|right)` &ndash; Left- or right-aligned group.
* `.@ns-navbar-heading` &ndash; Larger text for your application title.
* `.@ns-navbar-divider` &ndash; Thin vertical line that can be placed between groups of elements.

@css navbar
