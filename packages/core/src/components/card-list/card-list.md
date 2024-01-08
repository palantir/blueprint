---
tag: new
---

@# Card List

__CardList__ is a lightweight wrapper around the [__Card__](#core/components/card) component. It can be used to
visually group together cards in a list without any excess visual weight around or between them. Long lists may
be styled with CSS to scroll vertically.

@reactExample CardListExample

@## Usage

```tsx
import { Card, CardList } from "@blueprintjs/core";

<CardList>
    <Card>Basil</Card>
    <Card>Olive oil</Card>
    <Card>Kosher Salt</Card>
    <Card>Garlic</Card>
    <Card>Pine nuts</Card>
    <Card>Parmigiano Reggiano</Card>
</CardList>
```

@## Combining with Section

__CardList__ may be used as content for the [__Section__](#core/components/section) component (inside a nested
__SectionCard__). This allows support for features like a title & description above the list.

Set the same value for `<SectionCard padded>` and `<CardList bordered>` (either `true` or `false` for both) to get two
different kinds of appearances.

```tsx
import { Card, CardList, Section, SectionCard } from "@blueprintjs/core";

<Section title="Traditional pesto">
    <SectionCard padded={false}>
        <CardList bordered={false}>
            <Card>Basil</Card>
            <Card>Olive oil</Card>
            {/* ... */}
        </CardList>
    </SectionCard>
</Section>
```

@## Props interface

@interface CardListProps
