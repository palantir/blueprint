import { SwitchCard } from "@blueprintjs/core";

export default function SwitchCardDisabled() {
    return (
        <div className="docs-control-card-group-row">
            <SwitchCard disabled={true}>Wifi</SwitchCard>
            <SwitchCard disabled={true}>Bluetooth</SwitchCard>
            <SwitchCard disabled={true}>VPN</SwitchCard>
        </div>
    );
}
