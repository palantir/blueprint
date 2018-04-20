@# Typography

@## Usage

Keep in mind these general web typography guidelines when building your applications.

- The default text color in all components is compliant with the recommended
[WCAG 2.0](https://www.w3.org/TR/WCAG20/) minimum contrast ratio.
- If you choose to go with a custom text color, make sure the background behind it provides
proper contrast.
- Try not to explicitly write pixel values for your font-size or line-height CSS rules.
Instead, reference the classes and variables we provide in Blueprint (`.@ns-ui-text`,
`$pt-font-size-large`, etc.).

@## Fonts

Blueprint does not include any fonts of its own; it will use the default sans-serif operating system
font. We provide a class to use the default monospace font instead.


@css fonts

@## Headings

@css headings

@## UI text

The base font size for Blueprint web applications is 14px. This should be the default type size
for most short strings of text which are not headings or titles. If you wish to reset some
element's font size and line height to the default base styles, use the `.@ns-ui-text` class.
For longer running text, see [running text styles](#core/typography.running-text).

@css ui-text

@## Running text

Longform text, such as rendered Markdown documents, benefit from additional spacing and slightly
large font size. Apply `.@ns-running-text` to the parent element to adjust spacing for the following
elements:

- `<p>` tags have increased line-height and font size.
- `<h*>` tag margins are adjusted to provide clear separation between sections in a document.
- `<ul>` and `<ol>` tags receive [`.@ns-list`](#core/typography.lists) styles for legibility.

@css running-text

@## Links

Simply use an `<a href="">` tag as you normally would. No class is necessary for Blueprint styles.
Links are underlined only when hovered.

Putting an icon inside a link will cause it to inherit the link's text color.

@## Preformatted text

Use `<pre>` for code blocks, and `<code>` for inline code. Note that `<pre>` blocks will
retain _all_ whitespace so you'll have to format the content accordingly.

@css preformatted

@## Block quotes

Block quotes are treated as running text.

@css blockquote

@## Lists

Blueprint provides a small amount of global styling and a few modifier classes for list elements.

`<ul>` and `<ol>` elements in blocks with the `.@ns-running-text` modifier class will
automatically assume the `.@ns-list` styles to promote readability.

@css lists

@## Text utilities

Blueprint provides a small handful of class-based text utilities which can applied to any element
that contains text.

@css utilities

@## Internationalization

I18n in Blueprint is straightforward. React components expose props for customizing any strings;
use the library of your choice for managing internationalized strings.

@### Right-to-left text

Use the utility class `.@ns-rtl`.

@css rtl

@## Dark theme

Blueprint provides two UI color themes: light and dark. The light theme is active by default. The
dark theme can be applied by adding the class `@ns-dark` to a container element to theme all nested
elements.

Once applied, the dark theme will cascade to nested `.@ns-*` elements inside a `.@ns-dark` container.
There is no way to nest light-themed elements inside a dark container.

Most elements only support the dark theme when nested inside a `.@ns-dark` container because it does
not make sense to mark individual elements as dark. The dark container is therefore responsible for
setting a dark background color.

The following elements and components support the `.@ns-dark` class directly (i.e, `.@ns-app.@ns-dark`)
and can be used as a container for nested dark children:

- `.@ns-app`
- `.@ns-card`
- Overlays: `Dialog`, `Popover`, `Tooltip`, `Toast`
- `Popover` and `Tooltip` will automatically detect when their trigger is inside a `.@ns-dark`
container and add the same class to themselves.

Rather than illustrating dark components inline, this documentation site provides a site-wide switch
in the top right corner of the page to enable the dark theme. Try it out as you read the docs.
