import { Button, Card, Classes, H5 } from "@blueprintjs/core";

export default function SkeletonCard() {
    return (
        <Card>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div
                    className={Classes.SKELETON}
                    style={{ borderRadius: "50%", height: 40, width: 40 }}
                />
                <div style={{ flex: 1 }}>
                    <H5 className={Classes.SKELETON} style={{ marginBottom: 4 }}>
                        User display name
                    </H5>
                    <span className={Classes.SKELETON}>username@email.com</span>
                </div>
            </div>
            <p className={Classes.SKELETON}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget tortor felis. Fusce dapibus metus
                in dapibus mollis.
            </p>
            <p className={Classes.SKELETON}>Quisque eget ex diam. Proin at ante sem.</p>
            <div style={{ display: "flex", gap: 8 }}>
                <Button className={Classes.SKELETON} tabIndex={-1}>
                    Action
                </Button>
                <Button className={Classes.SKELETON} tabIndex={-1}>
                    Cancel
                </Button>
            </div>
        </Card>
    );
}
