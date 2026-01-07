import { useCallback, useRef } from "react";

import { EditableText, Intent, OverlayToaster } from "@blueprintjs/core";

export default function EditableTextBasic() {
    const toaster = useRef<OverlayToaster>(null);

    const handleConfirm = useCallback(
        (value: string) =>
            toaster.current?.show({
                intent: Intent.SUCCESS,
                message: `Confirmed: ${value}`,
            }),
        [],
    );

    const handleCancel = useCallback(
        () =>
            toaster.current?.show({
                intent: Intent.DANGER,
                message: "Canceled",
            }),
        [],
    );

    return (
        <>
            <EditableText
                placeholder="Click to edit..."
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
            <OverlayToaster ref={toaster} />
        </>
    );
}
