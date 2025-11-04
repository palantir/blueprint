import { Button, ButtonGroup } from "@blueprintjs/core";

export default function ButtonGroupVertical() {
    return (
        <div className="stack" style={{ minWidth: "200px" }}>
            <ButtonGroup vertical={true} fill={true}>
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
            </ButtonGroup>
            <ButtonGroup variant="outlined" vertical={true} fill={true}>
                <Button alignText="start" icon="align-left">
                    Start
                </Button>
                <Button alignText="center" icon="align-center">
                    Center
                </Button>
                <Button alignText="end" endIcon="align-right">
                    End
                </Button>
            </ButtonGroup>
        </div>
    );
}
