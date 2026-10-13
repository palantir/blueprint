import { SwitchCard } from "@blueprintjs/core";

export default function SwitchCardCompact() {
    return (
        <div className="docs-control-card-group-row">
            <SwitchCard compact={true}>Wifi</SwitchCard>
            <SwitchCard compact={true}>Bluetooth</SwitchCard>
            <SwitchCard compact={true}>VPN</SwitchCard>
        </div>
    );
}
