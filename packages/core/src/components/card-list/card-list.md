@# Card List

A card list is a wrapper around Cards. Compared to stand-alone cards, it can be used to reduce visual weight and allows inner scrolling.

@reactExample CardListExample


@## Props

```tsx
import { Button, Card, Elevation } from "@blueprintjs/core";

<CardList>
    <Card interactive={true} style={{ justifyContent: "space-between" }}>
        <span>Chicken Basquaise</span>
        <Icon icon={IconNames.CHEVRON_RIGHT} className={Classes.TEXT_MUTED} />
    </Card>

    <Card interactive={true} style={{ justifyContent: "space-between" }}>
        <span>Tarte Flambée</span>
        <Icon icon={IconNames.CHEVRON_RIGHT} className={Classes.TEXT_MUTED} />
    </Card>

    <Card interactive={true} style={{ justifyContent: "space-between" }}>
        <span>Pain au Chocolat</span>
        <Icon icon={IconNames.CHEVRON_RIGHT} className={Classes.TEXT_MUTED} />
    </Card>
</CardList>
```

@interface CardListProps

@css card-list
