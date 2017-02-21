@# Icons

@## UI icons

Blueprint UI icons are implemented via an icon font. They can be used anywhere text is
used. It's easy to change their color or apply effects like text shadows via standard CSS
properties.

To use Blueprint UI icons, you need to apply two classes to a `<span>` element:
- a __sizing class__, either `pt-icon-standard` (16px) or `pt-icon-large` (20px)
- an icon __identifier class__, such as `pt-icon-projects`

```html
<span class="pt-icon-standard pt-icon-projects"></span>
```

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
<h5>Non-standard sizes</h5>
Generally, icons should only be used at either 16px or 20px. However if a non-standard size is
necessary, set a `font-size` that is whole multiple of 16 or 20 with the relevant size class.
You can instead use the class `pt-icon` to make the icon inherit its size from surrounding text.
</div>

@reactDocs Icons
