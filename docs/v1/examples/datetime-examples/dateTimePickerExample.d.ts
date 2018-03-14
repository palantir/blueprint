/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export declare class DateTimePickerExample extends BaseExample<{
    date: Date;
}> {
    state: {
        date: Date;
    };
    protected renderExample(): JSX.Element;
    private handleDateChange;
}
