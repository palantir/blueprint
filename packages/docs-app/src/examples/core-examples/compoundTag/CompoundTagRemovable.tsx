import { useCallback, useState } from "react";

import { Button, CompoundTag } from "@blueprintjs/core";

const INITIAL_TAGS = ["London", "New York", "Seattle"];

export default function CompoundTagRemovable() {
    const [tags, setTags] = useState(INITIAL_TAGS);

    const handleRemove = useCallback(
        (tag: string) => () => setTags(prev => prev.filter(t => t !== tag)),
        [],
    );

    const handleReset = useCallback(() => setTags(INITIAL_TAGS), []);

    return (
        <div className="group center">
            <div className="group">
                {tags.map(tag => (
                    <CompoundTag key={tag} leftContent="City" onRemove={handleRemove(tag)}>
                        {tag}
                    </CompoundTag>
                ))}
            </div>
            {tags.length === 0 && (
                <Button
                    icon="refresh"
                    variant="outlined"
                    size="small"
                    text="Reset tags"
                    onClick={handleReset}
                />
            )}
        </div>
    );
}
