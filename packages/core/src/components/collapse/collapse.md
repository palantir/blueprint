@# Collapse

The __Collapse__ element shows and hides content with a built-in slide in/out animation.
You might use this to create a panel of settings for your application, with sub-sections
that can be expanded and collapsed.

@reactExample CollapseExample

@## Usage

Any content should be a child of `<Collapse>`. Content must be in the document flow
(e.g. `position: absolute;` wouldn't work, as the parent element would inherit a height of 0).

Toggling the `isOpen` prop triggers the open and close animations.
Once the component is in the closed state, the children are no longer rendered, unless the
`keepChildrenMounted` prop is true.

```tsx
export interface CollapseExampleState {
    isOpen?: boolean;
};

export class CollapseExample extends React.Component<{}, CollapseExampleState> {
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
                    <Pre>
                        Dummy text.
                    </Pre>
                </Collapse>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }
}
```

@## Props interface

@interface CollapseProps
