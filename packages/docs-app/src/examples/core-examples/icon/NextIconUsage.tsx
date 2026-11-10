import { Button } from "@blueprintjs/core";
import { AirplaneFilledIcon, AirplaneIcon } from "@blueprintjs/icons/next";

export default function NextIconUsage() {
    return (
        <div className="group">
            <Button icon={<AirplaneIcon />} intent="primary" text="Book flight" />
            <Button icon={<AirplaneFilledIcon />} text="Booked" />
        </div>
    );
}
