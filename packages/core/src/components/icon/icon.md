@# Icon

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    See [**Icons**](#core/icons) for a searchable list of all available UI icons.
</div>

This section describes two ways of using the UI icon font: via CSS or via React component.

Many Blueprint components provide an `iconName` prop, which supports both the
full name `pt-icon-projects` and the short name `projects`.

@## CSS API

To use Blueprint UI icons via CSS, you must apply two classes to a `<span>` element:
- a __sizing class__, either `pt-icon-standard` (16px) or `pt-icon-large` (20px)
- an __icon name class__, such as `pt-icon-projects`

Icon classes also support the four `.pt-intent-*` modifiers to color the image.

```html
<span class="pt-icon-{{size}} pt-icon-{{name}}"></span>

<span class="pt-icon-standard pt-icon-projects"></span>
<span class="pt-icon-large pt-icon-geosearch pt-intent-success"></span>
```

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    <h5>Non-standard sizes</h5>
    Generally, icons should only be used at either 16px or 20px. However if a non-standard size is
    necessary, set a `font-size` that is whole multiple of 16 or 20 with the relevant size class.
    You can instead use the class `pt-icon` to make the icon inherit its size from surrounding text.
</div>

@## JavaScript API

Use the `<Icon>` component to easily render icons in React. The required `iconName` prop is typed
such that it can offer autocomplete for known icon names. The optional `iconSize` prop ensures
you'll never forget a sizing class and clarifies the expected width and height of the icon element.
The component also accepts all valid HTML props for a `<span>` element.

```tsx
<Icon iconName="cross" />
<Icon iconName="graph" iconSize={20} intent={Intent.PRIMARY} />
<Icon iconName="add" iconSize="inherit" onClick={handleAdd}>

// deprecated usage, will be removed in 2.0:
<Icon iconName="pt-icon-globe" />
```

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
  <h5>Deprecated usage of full icon names</h5>
  Fully qualified icon names including the "pt-icon-" prefix are supported by the `iconName` prop
  __but their usage is deprecated__ and will be removed in 2.0. Passing such icon names will log
  a warning to the console.
</div>

@interface IIconProps
