@# Alert

__Alerts__ notify users of important information and force them to acknowledge the alert content before continuing.

Although similar to [__Dialog__](#core/components/dialog), an alert is more restrictive and should only be used for
important information. By default, the user can only exit the alert by clicking one of the confirmation buttons;
clicking the overlay or pressing the `esc` key will not close the alert. These interactions can be enabled via props.

@reactExample AlertExample

@## Props interface

__Alert__ only supports controlled usage through the `isOpen` prop. Use the `onConfirm` and `onCancel` props to respond
to those interactions separately, or use `onClose` to handle both at the same time.

@interface AlertProps
