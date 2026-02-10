import { Icon, Link } from "@blueprintjs/core";

export default function LinkExternal() {
    return (
        <Link href="https://blueprintjs.com" target="_blank">
            Open in new tab <Icon icon="share" />
        </Link>
    );
}
