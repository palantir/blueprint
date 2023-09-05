---
tag: new
---

@# Section

The __Section__ component can be used to contain, structure, and create hierarchy for information in your UI. It makes use of some concepts from other more atomic Blueprint components:

- The overall appearance looks like a [__Card__](#core/components/card) (with limited `elevation` options)
- Contents may be collapsible like the [__Collapse__](#core/components/collapse) component

@reactExample SectionExample

@## Props interface

@interface SectionProps

@## Section card

Multiple __SectionCard__ child components can be added under one __Section__, they will be stacked vertically. This layout can be used to further group information.

```tsx
<Section>
    <SectionCard>{/* ... */}</SectionCard>
    <SectionCard>{/* ... */}</SectionCard>
</Section>
```

@interface SectionCardProps
