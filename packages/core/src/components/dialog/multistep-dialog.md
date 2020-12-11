@# Multistep Dialog

Dialogs present content overlaid over other parts of the UI.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">Terminology note</h4>

The term "modal" is sometimes used to mean "dialog," but this is a misnomer.
_Modal_ is an adjective that describes parts of a UI.
An element is considered modal if it
[blocks interaction with the rest of the application](https://en.wikipedia.org/wiki/Modal_window).
We use the term "dialog" to avoid confusion with the adjective.

</div>

@reactExample MultistepDialogExample

@## Props

`MultistepDialog` is a stateless React component controlled by the `isOpen` prop.

@interface IMultistepDialogProps
