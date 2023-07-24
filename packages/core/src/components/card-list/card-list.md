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
    <Card>Olive oil</Card>
    <Card>Ground black pepper</Card>
    <Card>Carrots</Card>
</CardList>
```

@## Combining with Section

__CardList__ may be used as content for the [__Section__](#core/components/section) component. This allows support for
features like a title & description.

```tsx
import { Card, CardList, Section } from "@blueprintjs/core";

<Section title="Ingredients" collapsible={true}>
    <CardList>
        <Card>Olive oil</Card>
        <Card>Ground black pepper</Card>
        <Card>Carrots</Card>
    </CardList>
</Section>
```

@## Props interface

@interface CardListProps
