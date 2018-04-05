@# Typography

@## Usage

Keep in mind these general web typography guidelines when building your applications.

- The default text color in all components is compliant with the recommended
[WCAG 2.0](https://www.w3.org/TR/WCAG20/) minimum contrast ratio.
- If you choose to go with a custom text color, make sure the background behind it provides
proper contrast.
- Try not to explicitly write pixel values for your font-size or line-height CSS rules.
Instead, reference the classes and variables we provide in Blueprint (`.pt-ui-text`,
`$pt-font-size-large`, etc.).

@## UI text

Blueprint does not include any fonts of its own; it will use the default sans-serif operating system font.
A handful of utility CSS classes can be combined freely to further customize a block of text.

The base font size for Blueprint web applications is 14px. This should be the default type size
for most short strings of text which are not headings or titles. If you wish to reset some
element's font size and line height to the default base styles, use the `.pt-ui-text` class.

For longer blocks of running text, such as articles or documents, see [running text styles](#core/typography.running-text).

@css pt-ui-text

@## Running text

Longform text, such as rendered Markdown documents, benefit from increased spacing and support for unclassed textual elements.
Apply `.pt-running-text` to the parent element to apply the following styles to all children:

- `<h*>`, `<ul>`, `<ol>`, `<blockquote>`, `<code>`, `<pre>` do not require additional CSS classes for styles. This is great for rendered Markdown documents.
- `<h*>` tag margins are adjusted to provide clear separation between sections in a document.
- `<ul>` and `<ol>` tags receive [`.pt-list`](#core/typography.lists) styles for legibility.

@css pt-running-text

@## Headings

Apply the `.pt-heading` class to one of the six `<h*>` tags (or nest them inside a `.pt-running-text` container)
to adjust font size and line height.

@css headings

@## Links

Simply use an `<a href="">` tag as you normally would. No class is necessary for Blueprint styles.
Links are underlined only when hovered.

Putting an icon inside a link will cause it to inherit the link's text color.

@## Preformatted text

Use `.pt-code` for inline code elements (typically with the `<code>` tag).
Use `.pt-code-block` for mulitline blocks of code (typically on a `<pre>` tag).
Note that `<pre>` blocks will retain _all_ whitespace so you'll have to format the content accordingly.

When nested inside a `.pt-running-text` container, use the `<pre>` or `<code>` tags directly without CSS classes.

@css preformatted

@## Block quotes

Block quotes receive a left border and padding to distinguish them from body text.

Use the `.pt-blockquote` class or nest a `<blockquote>` element inside a `.pt-running-text` container.

@css blockquote

@## Lists

Use `.pt-list` to adjust list margins and padding to match Blueprint's grid. `<ul>` and `<ol>` elements inside a
`.pt-running-text` container will automatically assume these styles to promote readability.

Use `.pt-list-unstyled` to remove list item decorations and margins and padding.

Note that these classes must be applied to each nested `<ul>` or `<ol>` element in a tree.

@css lists

@## Internationalization

I18n in Blueprint is straightforward. React components expose props for customizing any strings;
use the library of your choice for managing internationalized strings.

@### Right-to-left text

Use the utility class `.pt-rtl`.

@css pt-rtl

@## Dark theme

Blueprint provides two UI color themes: light and dark. The light theme is active by default. The
dark theme can be applied by adding the class `pt-dark` to a container element to theme all nested
elements.

Once applied, the dark theme will cascade to nested `.pt-*` elements inside a `.pt-dark` container.
There is no way to nest light-themed elements inside a dark container.

Most elements only support the dark theme when nested inside a `.pt-dark` container because it does
not make sense to mark individual elements as dark. The dark container is therefore responsible for
setting a dark background color.

The following elements and components support the `.pt-dark` class directly (i.e, `.pt-app.pt-dark`)
and can be used as a container for nested dark children:

- `.pt-app`
- `.pt-card`
- Overlays: `Dialog`, `Popover`, `Tooltip`, `Toast`
- `Popover` and `Tooltip` will automatically detect when their trigger is inside a `.pt-dark`
container and add the same class to themselves.

Rather than illustrating dark components inline, this documentation site provides a site-wide switch
in the top right corner of the page to enable the dark theme. Try it out as you read the docs.
