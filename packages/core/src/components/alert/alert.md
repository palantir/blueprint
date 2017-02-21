@# Alerts

Alerts notify users of important information and force them to acknowledge the alert content before
continuing.

Although similar to [dialogs](#components.dialog), alerts are more restrictive and should only be
used for important notifications. The user can only exit the alert by clicking one of the
confirmation buttons — clicking the overlay or pressing the <kbd class="pt-key">esc</kbd> key will
not close the alert.

You can only use this component in controlled mode. Use the `onClick` handlers in the primary and
secondary action props to handle closing the `Alert`. Optionally, display an icon next to the body
to show the type of the alert.

@reactExample AlertExample

@## JavaScript API

The `Alert` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

@interface IAlertProps
