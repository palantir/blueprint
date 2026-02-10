import { useCallback, useState } from "react";

import { CompoundTag } from "@blueprintjs/core";

const INITIAL_TAGS = ["London", "New York", "Seattle"];

export default function CompoundTagRemovable() {
    const [tags, setTags] = useState(INITIAL_TAGS);

    const handleRemove = useCallback(
        (tag: string) => () => setTags(prev => prev.filter(t => t !== tag)),
        [],
    );

    return (
        <div className="group">
            {tags.map(tag => (
                <CompoundTag key={tag} leftContent="City" onRemove={handleRemove(tag)}>
                    {tag}
                </CompoundTag>
            ))}
        </div>
    );
}
