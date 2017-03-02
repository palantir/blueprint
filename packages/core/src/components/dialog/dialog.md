@# Dialogs

Dialogs present content overlaid over other parts of the UI.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
<h5>Terminology note</h5>
The term "modal" is sometimes used to mean "dialog," but this is a misnomer.
_Modal_ is an adjective that describes parts of a UI.
An element is considered modal if it
[blocks interaction with the rest of the application](https://en.wikipedia.org/wiki/Modal_window).
We use the term "dialog" to avoid confusion with the adjective.
</div>

@## JavaScript API

The `Dialog` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

There are two ways to render dialogs:

- in-place in the DOM tree. This is the default behavior.
- injected into a newly created element attached to `document.body`.
Set `inline={false}` to enable this.

`Dialog` is implemented as a stateless React component. The children you provide to this component
are rendered as contents inside the `.pt-dialog` element.

```tsx
interface IDialogExampleState {
    isOpen: boolean;
}

class DialogExample extends React.Component<{}, IDialogExampleState> {
    public state = { isOpen: false };

    public render() {
        return (
            <div>
                <Button onClick={this.toggleDialog} text="Show dialog" />
                <Dialog
                    iconName="inbox"
                    isOpen={this.state.isOpen}
                    onClose={this.toggleDialog}
                    title="Dialog header"
                >
                    <div className="pt-dialog-body">
                        Some content
                    </div>
                    <div className="pt-dialog-footer">
                        <div className="pt-dialog-footer-actions">
                            <Button text="Secondary" />
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={this.toggleDialog}
                                text="Primary"
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

    private toggleDialog = () => this.setState({ isOpen: !this.state.isOpen });
}
```

@interface IDialogProps

@reactExample DialogExample

@## CSS API

You can create dialogs manually using the HTML markup and `pt-dialog-*` classes below.
However, you should use the dialog [JavaScript APIs](#components.dialog.js) whenever possible,
as they automatically generate some of this markup.

More examples of dialog content are shown below.
