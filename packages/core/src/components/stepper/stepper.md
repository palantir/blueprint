---
tag: new
---

@# Stepper

A stepper conveys progress through steps.

@reactExample StepperExample

@### Stepper

A `Stepper` is a container for steps.  A stepper can render its steps either horizontally or vertically.

The active step is indicated by the `activeStep` controlled prop.

@interface IStepperProps

@### Step

A `Step` is a single step within a `Stepper`.

A step has a label, but can also support an icon.  If no icon is specified, a dot is rendered in its place.

Steps can also contain content, which is collapsed (via the `Collapse` component) unless the step is active.

@interface IStepProps

@### StepConnector

A `StepConnector` is a component rendered in between each `Step` within a `Stepper`.  The `StepConnector` is
a simple implementation that `Stepper` uses by default, which renders a line between each step.

The `Stepper` supports overriding the default `StepConnector` with a customized connector component of your own, via the `connector` prop.

@interface IStepConnectorProps
