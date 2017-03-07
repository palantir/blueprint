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

@## Fonts

Blueprint does not include any fonts of its own; it will use the default sans-serif operating system
font. We provide a class to use the default monospace font instead.

Markup:
<div class="{{.modifier}}">Blueprint components react overlay date picker.</div>

.pt-monospace-text - Use a monospace font (ideal for code)

@## Headings

Markup:
<h1>H1 heading</h1>
<h2>H2 heading</h2>
<h3>H3 heading</h3>
<h4>H4 heading</h4>
<h5>H5 heading</h5>
<h6>H6 heading</h6>

@## UI text

The base font size for Blueprint web applications is 14px. This should be the default type size
for most short strings of text which are not headings or titles. If you wish to reset some
element's font size and line height to the default base styles, use the `.pt-ui-text` class.
For longer running text, see [running text styles](#typography.running-text).

Markup:
<div class="{{.modifier}}">Blueprint components react overlay date picker.</div>

.pt-ui-text - Default UI text. This is applied to the document body as part of core styles.
.pt-ui-text-large - Larger UI text.

@## Running text

Large blocks of _running text_ should use `.pt-running-text` styles.

Note that `<p>` elements by default don't add any styles; they just inherit the base typography.
This is a conservative design; `<p>` elements are so ubiquitous that they're more often used for UI
text than long form text. It's up to the user to decide which blocks of text in an application
should get running text styles.

Markup:
<p>
    Default paragraphs have base typography styles.
</p>
<p class="pt-running-text">
    Running text is larger and more spaced out.
    <br />
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
    esse cillum dolore eu fugiat nulla pariatur.
    <br />
    <a href="#">Excepteur sint occaecat cupidatat non proident.</a>
</p>
<div class="pt-running-text">
    Includes support for <strong>strong</strong>, <em>emphasized</em>, and <u>underlined</u> text.
    <a href="#">Also links!</a>
</div>

@## Links

Simply use an `<a href="">` tag as you normally would. No class is necessary for Blueprint styles.
Links are underlined only when hovered.

Putting an icon inside a link will cause it to inherit the link's text color.

@## Preformatted text

Use `<pre>` for code blocks, and `<code>` for inline code. Note that `<pre>` blocks will
retain _all_ whitespace so you'll have to format the content accordingly.

Markup:
```html
<code>$ npm install</code>
<pre>
    %pt-select {
        @include pt-button();
        @include prefixer(appearance, none, webkit moz);
        border-radius: $pt-border-radius;
        height: $pt-button-height;
        padding: 0 ($input-padding-horizontal * 3) 0 $input-padding-horizontal;
    }
</pre>
<pre><code>export function hasModifier(modifiers: ts.ModifiersArray, ...modifierKinds: ts.SyntaxKind[]) {
    if (modifiers == null || modifierKinds == null) {
        return false;
    }
    return modifiers.some((m) => {
        return modifierKinds.some((k) => m.kind === k);
    });
}</code></pre>
```

@## Block quotes

Block quotes are treated as running text.

Markup:
<blockquote>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur.
</p>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur.
</p>
</blockquote>

@## Lists

Blueprint provides a small amount of global styling and a few modifier classes for list elements.

`<ul>` and `<ol>` elements in blocks with the `.pt-running-text` modifier class will
automatically assume the `.pt-list` styles to promote readability.

Markup:
<ul class="{{.modifier}}">
    <li>Item the first</li>
    <li>Item the second</li>
    <li>Item the third</li>
</ul>
<ol class="{{.modifier}}">
    <li>Item the first</li>
    <li>Item the second</li>
    <li>Item the third</li>
</ol>

.pt-list - Add a little spacing between items for readability.
.pt-list-unstyled - Remove all list styling (including indicators) so you can add your own.

@## Text utilities

Blueprint provides a small handful of class-based text utilities which can applied to any element
that contains text.

Markup:
<div class="{{.modifier}}" style="width: 320px;">
Blueprint components react overlay date picker. Breadcrumbs dialog progress non-ideal state.
</div>

.pt-text-muted - Changes text color to a gentler gray.
.pt-text-overflow-ellipsis - Truncates a single line of text with an ellipsis if it overflows its
container.

@## Internationalization

@### Right-to-left text

Use the utility class `.pt-rtl`.

Markup:
<h4>Arabic:</h4>
<p class="pt-rtl">
    لكل لأداء بمحاولة من. مدينة الواقعة يبق أي, وإعلان وقوعها، حول كل, حدى عجّل مشروط الخاسرة قد.
    من الذود تكبّد بين, و لها واحدة الأراضي. عل الصفحة والروسية يتم, أي للحكومة استعملت شيء. أم وصل زهاء اليا
</p>
<h4>Hebrew:</h4>
<p class="pt-rtl">
    כדי על עזרה יידיש הבהרה, מלא באגים טכניים דת. תנך או ברית ביולי. כתב בה הטבע למנוע, דת כלים פיסיקה החופשית זכר.
    מתן החלל מאמרשיחהצפה ב. הספרות אנציקלופדיה אם זכר, על שימושי שימושיים תאולוגיה עזה
</p>

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
