@# Dialogs

Dialogs present content overlaid over other parts of the UI.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-callout-title">Terminology note</h4>
    The term "modal" is sometimes used to mean "dialog," but this is a misnomer.
    _Modal_ is an adjective that describes parts of a UI.
    An element is considered modal if it
    [blocks interaction with the rest of the application](https://en.wikipedia.org/wiki/Modal_window).
    We use the term "dialog" to avoid confusion with the adjective.
</div>

@reactExample DialogExample

@## JavaScript API

The `Dialog` component is available in the **@blueprintjs/core** package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

There are two ways to render dialogs:

* injected into a newly created element attached to `document.body` using `<Portal>`.
  This is the default behavior.
* in-place in the DOM tree. Set `usePortal={false}` to enable this behavior.

`Dialog` is a stateless React component. The children you provide to this component
are rendered as contents inside the `.@ns-dialog` element.

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
                    icon="inbox"
                    isOpen={this.state.isOpen}
                    onClose={this.toggleDialog}
                    title="Dialog header"
                >
                    <div className="@ns-dialog-body">Some content</div>
                    <div className="@ns-dialog-footer">
                        <div className="@ns-dialog-footer-actions">
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

@## CSS API

You can create dialogs manually using the HTML markup and `@ns-dialog-*` classes below.
However, you should use the dialog [JavaScript APIs](#core/components/dialog.javascript-api) whenever possible,
as they automatically generate some of this markup.

More examples of dialog content are shown below.

@css dialog
