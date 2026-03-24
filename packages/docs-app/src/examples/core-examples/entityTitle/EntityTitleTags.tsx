import { EntityTitle, Intent, Tag } from "@blueprintjs/core";

export default function EntityTitleTags() {
    return (
        <EntityTitle
            icon="shop"
            title="Buy groceries"
            tags={<Tag intent={Intent.DANGER} minimal={true}>Due today</Tag>}
        />
    );
}
