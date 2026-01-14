import { Link } from "@blueprintjs/core";

export default function LinkWithinText() {
    return (
        <p>
            Blueprint is a React-based UI toolkit for building complex, data-dense web interfaces.
            To learn more about the project and explore all available components, visit the{" "}
            <Link href="https://blueprintjs.com/docs" color="inherit">
                official documentation
            </Link>{" "}
            or check out the{" "}
            <Link href="https://github.com/palantir/blueprint" color="inherit">
                GitHub repository
            </Link>
            .
        </p>
    );
}
