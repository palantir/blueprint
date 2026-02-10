import { Button, Card, Classes, H5 } from "@blueprintjs/core";

export default function SkeletonBasic() {
    return (
        <Card>
            <H5>
                <a className={Classes.SKELETON} href="#" tabIndex={-1}>
                    Card heading
                </a>
            </H5>
            <p className={Classes.SKELETON}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget tortor felis.
                Fusce dapibus metus in dapibus mollis. Quisque eget ex diam.
            </p>
            <Button className={Classes.SKELETON} icon="add" tabIndex={-1}>
                Submit
            </Button>
        </Card>
    );
}
