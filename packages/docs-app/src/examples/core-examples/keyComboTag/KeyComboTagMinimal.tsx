import { KeyComboTag } from "@blueprintjs/core";

export default function KeyComboTagMinimal() {
    return (
        <div className="group">
            <KeyComboTag combo="cmd + s" minimal={true} />
            <KeyComboTag combo="ctrl + shift + z" minimal={true} />
            <KeyComboTag combo="enter" minimal={true} />
        </div>
    );
}
