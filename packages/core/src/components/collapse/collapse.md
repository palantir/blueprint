@# Collapse

The `Collapse` element shows and hides content with a built-in slide in/out animation.
You might use this to create a panel of settings for your application, with sub-sections
that can be expanded and collapsed.

@reactExample CollapseExample

@## JavaScript API

The `Collapse` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

Any content should be a child of the `Collapse` element. Content must be in the document
flow (e.g. `position: absolute;` wouldn't work, as the parent element would inherit a height of 0).

Toggling the `isOpen` prop triggers the open and close animations.
Once the component is in the closed state, the children are no longer rendered, unless the
`keepChildrenMounted` prop is true.

```tsx
export interface ICollapseExampleState {
    isOpen?: boolean;
};

export class CollapseExample extends React.Component<{}, ICollapseExampleState> {
    public state = {
        isOpen: false,
    };

    public render() {
        return (
            <div>
                <Button onClick={this.handleClick}>
                    {this.state.isOpen ? "Hide" : "Show"} build logs
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                    <pre>
                        Dummy text.
                    </pre>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }
}
```

@interface ICollapseProps
