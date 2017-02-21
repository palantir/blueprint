---
parent: components
---

@# Navbars

Navbars present useful navigation controls at the top of an application.

The `Navbar` component can have up to two groups of elements: a left-aligned group and a
right-aligned group. These groups can contain multiple elements, which are laid out horizontally.

@## CSS API

Use the following classes to construct a navbar:

- `nav.pt-navbar` &ndash; The parent element. Use a `<nav>` element for accessibility.
- `.pt-navbar-group.pt-align-(left|right)` &ndash; Left- or right-aligned group.
- `.pt-navbar-heading` &ndash; Larger text for your application title.
- `.pt-navbar-divider` &ndash; Thin vertical line that can be placed between groups of elements.

Markup:
<nav class="pt-navbar {{.modifier}}">
<div class="pt-navbar-group pt-align-left">
<div class="pt-navbar-heading">Blueprint</div>
<input class="pt-input" placeholder="Search files..." type="text" />
</div>
<div class="pt-navbar-group pt-align-right">
<button class="pt-button pt-minimal pt-icon-home">Home</button>
<button class="pt-button pt-minimal pt-icon-document">Files</button>
<span class="pt-navbar-divider"></span>
<button class="pt-button pt-minimal pt-icon-user"></button>
<button class="pt-button pt-minimal pt-icon-notifications"></button>
<button class="pt-button pt-minimal pt-icon-cog"></button>
</div>
</nav>

.pt-dark - Dark theme.

@### Fixed to viewport top

Add the `.pt-fixed-top` class to the `.pt-navbar` to attach it to the top of the viewport using
`position: fixed; top: 0;`. This is so-called "sticky" behavior: the navbar stays at the top of the
screen as the user scrolls through the document.

This modifier is not illustrated here because it breaks the documentation flow.

<div class="pt-callout pt-intent-danger pt-icon-error">
<h5>Body padding required</h5>
The fixed navbar will lie on top of your other content unless you add padding to the top of the
`<body>` element equal to the height of the navbar. Use the `$pt-navbar-height` Sass variable to
access the height of the navbar (50px).
</div>

@### Fixed width

If your application is inside a fixed-width container (instead of spanning the entire viewport), you
can align the navbar to match.

Wrap your `.pt-navbar-group`s in an element with your desired `width` and `margin: 0 auto;` to
horizontally center it.

Markup:
<nav class="pt-navbar pt-dark">
<div style="margin: 0 auto; width: 480px;"> <!-- ADD ME -->
<div class="pt-navbar-group pt-align-left">
<div class="pt-navbar-heading">Blueprint</div>
</div>
<div class="pt-navbar-group pt-align-right">
<button class="pt-button pt-minimal pt-icon-home">Home</button>
<button class="pt-button pt-minimal pt-icon-document">Files</button>
<span class="pt-navbar-divider"></span>
<button class="pt-button pt-minimal pt-icon-user"></button>
<button class="pt-button pt-minimal pt-icon-notifications"></button>
<button class="pt-button pt-minimal pt-icon-cog"></button>
</div>
</div>
</nav>
