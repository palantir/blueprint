@# Section

The **Section** component can be used to contain, structure, and create hierarchy for information in your UI. It makes use of some concepts from other more atomic Blueprint components:

-   The overall appearance looks like a [**Card**](#core/components/card) (with limited `elevation` options)
-   Contents may be collapsible like the [**Collapse**](#core/components/collapse) component

@## Import

```tsx
import { Section } from "@blueprintjs/core";
```

@reactExample SectionExample

@## Props interface

@interface SectionProps

@## Section card

Multiple **SectionCard** child components can be added under one **Section**, they will be stacked vertically. This layout can be used to further group information.

```tsx
<Section>
    <SectionCard>{/* ... */}</SectionCard>
    <SectionCard>{/* ... */}</SectionCard>
</Section>
```

The `bordered` prop on **SectionCard** can be used to override the parent Section's `bordered` setting for that individual card. This allows, for example, a borderless Section (with no header divider) to still show a dividing border between specific cards:

```tsx
<Section bordered={false}>
    <SectionCard bordered={true}>{/* ... */}</SectionCard>
    <SectionCard bordered={true}>{/* ... */}</SectionCard>
</Section>
```

@interface SectionCardProps
