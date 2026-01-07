import { Button } from "@blueprintjs/core";

export default function ButtonAlignText() {
    return (
        <div className="stack" style={{ minWidth: 300 }}>
            <Button alignText="start" icon="align-left" endIcon="caret-down">
                Start
            </Button>
            <Button alignText="center" icon="align-center" endIcon="caret-down">
                Center
            </Button>
            <Button alignText="end" icon="align-right" endIcon="caret-down">
                End
            </Button>
        </div>
    );
}
