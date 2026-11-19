import { Card, Classes, H5 } from "@blueprintjs/core";

export default function SkeletonWithCard() {
    return (
        <Card>
            <div style={{ alignItems: "center", display: "flex", marginBottom: 10 }}>
                <div
                    className={Classes.SKELETON}
                    style={{ borderRadius: "50%", height: 40, width: 40 }}
                />
                <div style={{ flex: 1, marginLeft: 10 }}>
                    <H5 className={Classes.SKELETON} style={{ marginBottom: 4 }}>
                        User name placeholder
                    </H5>
                    <span className={Classes.SKELETON}>Subtitle placeholder</span>
                </div>
            </div>
            <p className={Classes.SKELETON}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sagittis nulla
                vitae sem sollicitudin, ac interdum tortor laoreet.
            </p>
        </Card>
    );
}
