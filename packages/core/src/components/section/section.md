@# Section

The __Section__ component can be used to contain, structure, and create hierarchy for information in your UI. It makes use of some concepts from other more atomic Blueprint components:

- The overall appearance looks like a [__Card__](#core/components/card)
- Contents may be collapsible like the [__Collapse__](#core/components/collapse) component

@reactExample SectionExample

@## Props interface

@interface SectionProps

@## Section panel

Multiple __SectionPanel__ child components can be added under one __Section__, they will be stacked vertically. This layout can be used to further group information.

```tsx
<Section>
    <SectionPanel>{/* ... */}</SectionPanel>
    <SectionPanel>{/* ... */}</SectionPanel>
</Section>
```

@interface SectionPanelProps
