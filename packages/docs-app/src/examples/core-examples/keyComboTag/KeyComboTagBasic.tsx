import { KeyComboTag } from "@blueprintjs/core";

export default function KeyComboTagBasic() {
    return (
        <div className="group">
            <KeyComboTag combo="cmd + s" />
            <KeyComboTag combo="ctrl + shift + z" />
            <KeyComboTag combo="enter" />
        </div>
    );
}
