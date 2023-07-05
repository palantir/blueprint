@# Section

The __Section__ component can be used to contain, structure, and create hierarchy for information in your UI. It makes use of some concepts from other more atomic Blueprint components:

- The overall appearance looks like a [__Card__](#core/components/card)
- The header can optionally contain [__Tabs__](#core/components/tabs) which switch between different content panels
- Contents may be collapsible like the [__Collapse__](#core/components/collapse) component

@reactExample SectionExample

@## Props interface

@interface SectionProps

@## SectionContent

Multiple __SectionContent__ child components can be added under one __Section__, they will be stacked. This can be used to further group information.

```tsx
<Section>
    <SectionContent>{/* ... */}</SectionContent>
    <SectionContent>{/* ... */}</SectionContent>
</Section>
```

@interface SectionContentProps
