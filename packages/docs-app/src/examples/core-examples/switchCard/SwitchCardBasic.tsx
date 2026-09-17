import { SwitchCard } from "@blueprintjs/core";

export default function SwitchCardBasic() {
    return (
        <div className="docs-control-card-group-row">
            <SwitchCard>Wifi</SwitchCard>
            <SwitchCard>Bluetooth</SwitchCard>
            <SwitchCard>VPN</SwitchCard>
        </div>
    );
}
