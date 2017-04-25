@# Icons

Blueprint provides over 300 UI icons in an icon font. They come in two sizes, 16px and 20px, and can
be used anywhere text is used. It's easy to change their color or apply effects like text shadows
via standard CSS properties.

To use Blueprint UI icons, you need to apply two classes to a `<span>` element:
- a __sizing class__, either `pt-icon-standard` (16px) or `pt-icon-large` (20px)
- an __icon name class__, such as `pt-icon-projects`

Icon classes also support the four `.pt-intent-*` modifiers to color the image.

```html
<span class="pt-icon-{{size}} pt-icon-{{name}}"></span>

<span class="pt-icon-standard pt-icon-projects"></span>
<span class="pt-icon-large pt-icon-geosearch pt-intent-success"></span>
```

Many Blueprint [components](#core/components) provide an `iconName` prop, which supports both the
full name `pt-icon-projects` and the short name `projects`.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Non-standard sizes</h5>
    Generally, icons should only be used at either 16px or 20px. However if a non-standard size is
    necessary, set a `font-size` that is whole multiple of 16 or 20 with the relevant size class.
    You can instead use the class `pt-icon` to make the icon inherit its size from surrounding text.
</div>

@reactDocs Icons
