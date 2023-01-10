@# Dialogs

Dialogs present content overlaid over other parts of the UI.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">Terminology note</h4>

The term "modal" is sometimes used to mean "dialog," but this is a misnomer.
_Modal_ is an adjective that describes parts of a UI.
An element is considered modal if it
[blocks interaction with the rest of the application](https://en.wikipedia.org/wiki/Modal_window).
We use the term "dialog" to avoid confusion with the adjective.

</div>

Blueprint provides two types of dialogs:

1. Standard dialog: show single view using the `Dialog` component
1. Multi-step dialog: show multiple sequential views using the `MultistepDialog` component.

@## Dialog

@reactExample DialogExample

A standard __Dialog__ renders its contents in an [__Overlay__](#core/components/overlay) with a
`Classes.DIALOG` element. You can use some simple dialog markup sub-components or CSS classes
to structure its contents:

```tsx
<Dialog title="Informational dialog" icon="info-sign">
    <DialogBody>
        {/* body contents here */}
    </DialogBody>
    <DialogFooter actions={<Button intent="primary" text="Close" onClick={/* ... */} />} />
</Dialog>
```

@### Dialog props

`<Dialog>` is a stateless React component controlled by the `isOpen` prop.

The children you provide to this component are rendered as contents inside the
`Classes.DIALOG` element.

@interface IDialogProps

@### Dialog body props

`<DialogBody>` renders a `Classes.DIALOG_BODY` element, optionally with a constrained container
height which allows vertical scrolling of its content.

@interface DialogBodyProps

@### Dialog footer props

`<DialogFooter>` renders a `Classes.DIALOG_FOOTER` element. Footer "actions" are rendered
towards the right side of the footer container element.

@interface DialogFooterProps

@### CSS

You can create dialogs manually using the HTML markup and `@ns-dialog-*` classes below.
However, you should use the [`Dialog` component](#core/components/dialog.props)
whenever possible, as they automatically generate some of this markup.

More examples of dialog content are shown below.

@css dialog

@## Multistep dialog

@reactExample MultistepDialogExample

@### Multistep dialog props

`MultistepDialog` is a wrapper around `Dialog` that displays a dialog with multiple steps, each of which maps to a specific panel.

The children you provide to this component are rendered as contents inside the
`Classes.DIALOG` element. Typically, you will want to render a panel with
`Classes.DIALOG_BODY` that contains the body content for each step.

Children of the `MultistepDialog` are filtered down to only `DialogStep` components and rendered in order.
`DialogStep` children are managed by the component; clicking one will change selection.

@interface IMultistepDialogProps

@### DialogStep

`DialogStep` is a minimal wrapper with no functionality of its own&mdash;it is managed entirely by its
parent `MultistepDialog` wrapper. `DialogStep` title text can be set via the `title` prop.

The associated step panel will be visible when the `DialogStep` is selected.

@interface IDialogStepProps
