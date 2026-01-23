"use client";

// This barrel file re-exports Blueprint components with "use client" directive
// to make them compatible with Next.js React Server Components architecture.
// Blueprint components use React hooks internally but don't have "use client" directives.

export {
    // Core components
    Button,
    AnchorButton,
    ButtonGroup,
    Callout,
    Card,
    Collapse,
    Dialog,
    Divider,
    Drawer,
    HTMLTable,
    Icon,
    Menu,
    MenuDivider,
    MenuItem,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Overlay,
    Popover,
    Pre,
    Spinner,
    Tab,
    Tabs,
    Tag,
    Text,
    Tooltip,
    Tree,
    // Form components
    Checkbox,
    ControlGroup,
    FormGroup,
    InputGroup,
    NumericInput,
    RadioGroup,
    Radio,
    Switch,
    TextArea,
    // Utilities
    Classes,
    Intent,
    Position,
    Alignment,
    Elevation,
    // Types
    type ButtonProps,
    type IconName,
} from "@blueprintjs/core";
