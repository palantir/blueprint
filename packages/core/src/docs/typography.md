@# Typography

@## Usage

Keep in mind these general web typography guidelines when building your applications.

- The default text color in all components is compliant with the recommended
[WCAG 2.0](https://www.w3.org/TR/WCAG20/) minimum contrast ratio.
- If you choose to go with a custom text color, make sure the background behind it provides
proper contrast.
- Try not to explicitly write pixel values for your font-size or line-height CSS rules.
Instead, reference the classes and variables we provide in Blueprint (`.@ns-ui-text`,
`$@ns-font-size-large`, etc.).

@## UI text

Blueprint does not include any fonts of its own; it will use the default sans-serif operating system font.
A handful of utility CSS classes can be combined freely to further customize a block of text.

The base font size for Blueprint web applications is 14px. This should be the default type size
for most short strings of text which are not headings or titles. If you wish to reset some
element's font size and line height to the default base styles, use the `.@ns-ui-text` class.

For longer blocks of running text, such as articles or documents, see [running text styles](#core/typography.running-text).

@css ui-text

@## Running text

Longform text, such as rendered Markdown documents, benefit from increased spacing and support for unclassed textual elements.
Apply `.@ns-running-text` to the parent element to apply the following styles to all children:

- `<h*>`, `<ul>`, `<ol>`, `<blockquote>`, `<code>`, `<pre>`, `<kbd>` tags do not require additional CSS classes for styles. This is great for rendered Markdown documents.
- `<h*>` tag margins are adjusted to provide clear separation between sections in a document.
- `<ul>` and `<ol>` tags receive [`.@ns-list`](#core/typography.lists) styles for legibility.

@css running-text

@## Headings

Apply the `.@ns-heading` class to one of the six `<h*>` tags (or nest them inside a `.@ns-running-text` container)
to adjust font size and line height.

@css headings

@## Links

Simply use an `<a href="">` tag as you normally would. No class is necessary for Blueprint styles.
Links are underlined only when hovered.

Putting an icon inside a link will cause it to inherit the link's text color.

@## Preformatted text

Use `.@ns-code` for inline code elements (typically with the `<code>` tag).
Use `.@ns-code-block` for mulitline blocks of code (typically on a `<pre>` tag).
Note that `<pre>` blocks will retain _all_ whitespace so you'll have to format the content accordingly.

When nested inside a `.@ns-running-text` container, use the `<pre>` or `<code>` tags directly without CSS classes.

@css preformatted

@## Block quotes

Block quotes receive a left border and padding to distinguish them from body text.

Use the `.@ns-blockquote` class or nest a `<blockquote>` element inside a `.@ns-running-text` container.

@css blockquote

@## Lists

Blueprint provides a small amount of global styling and a few modifier classes for list elements.

`<ul>` and `<ol>` elements in blocks with the `.@ns-running-text` modifier class will
automatically assume the `.@ns-list` styles to promote readability.

Use `.@ns-list-unstyled` to remove list item decorations and margins and padding.

Note that these classes must be applied to each nested `<ul>` or `<ol>` element in a tree.

@css lists

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

The following elements and components support the `.@ns-dark` class directly (i.e, `.@ns-card.@ns-dark`)
and can be used as a container for nested dark children:

- `Card`
- Overlays: `Dialog`, `Popover`, `Tooltip`, `Toast`
- `Popover` and `Tooltip` will automatically detect when their trigger is inside a `.@ns-dark`
container and add the same class to themselves.

Rather than illustrating dark components inline, this documentation site provides a site-wide switch
in the sidebar to enable the dark theme. Try it out as you read the docs.
