/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { H5, Stepper, Step, Switch, IconName, Button, ButtonGroup, HTMLSelect, Label } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

const iconTypes = {
    "icons": ["person","cog","cloud"] as IconName[],
    "numbered": [<>1</>,<>2</>,<>3</>],
    "alphabetical": [<>A</>,<>B</>,<>C</>],
    "dotted": [] as never[],
};

export interface IStepperExampleState {
    accordion: boolean;
    activeStep: number;
    content: boolean;
    iconType: keyof typeof iconTypes;
    errored: boolean;
    fill: boolean;
    large: boolean;
    vertical?: boolean;
}

export class StepperExample extends React.PureComponent<IExampleProps, IStepperExampleState> {
    public state: IStepperExampleState = {
        accordion: false,
        activeStep: 0,
        content: false,
        fill: true,
        iconType: "numbered",
        errored: false,
        large: false,
        vertical: false,
    };

    public render() {
        const {
            activeStep,
            accordion,
            content,
            iconType,
            errored,
            fill,
            large,
            vertical,
        } = this.state;

        const icons = iconTypes[iconType];

        const navBtns = (
          <ButtonGroup>
            <Button icon="arrow-left" text="Previous" disabled={activeStep < 1} onClick={this.handlePrevious} />
            <Button icon="arrow-right" text="Next" disabled={activeStep > 2} onClick={this.handleNext} />
          </ButtonGroup>
        );

        const stepContent = content && (
          <>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <ButtonGroup>
              {activeStep > 0 && <Button icon="arrow-up" text="Previous" onClick={this.handlePrevious} />}
              {activeStep < 2 && <Button icon="arrow-down" text="Next" onClick={this.handleNext} />}
              {activeStep === 2 && <Button icon="tick" intent="primary" text="Complete" onClick={this.handleNext} />}
            </ButtonGroup>
          </>
        );

        const reset = activeStep > 2 && <Button icon="undo" text="Reset" onClick={this.handleReset} />;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={vertical} label="Vertical" key="vertical" onChange={this.handleVerticalChange} />
                <Switch checked={large} label="Large" key="large" onChange={this.handleLargeChange} />
                <Switch checked={accordion} label="Accordion" key="accordion" onChange={this.handleAccordionChange} />
                <Switch checked={fill} label="Fill" key="fill" onChange={this.handleFillChange} />
                <H5>Example</H5>
                <Label>
                    Icon Type
                    <HTMLSelect value={iconType} onChange={this.handleIconChange}>
                        <option value="numbered">Numbered</option>
                        <option value="dotted">Dotted</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="icons">Icons</option>
                    </HTMLSelect>
                </Label>
                <Switch checked={errored} label="Error step two" key="errored" onChange={this.handleErrorChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                {!content && navBtns}
                <Stepper activeStep={activeStep} fill={accordion ? "accordion" : fill} large={large} vertical={vertical}>
                    <Step label="Step one" icon={icons[0]}>{stepContent}</Step>
                    <Step label="Step two" icon={icons[1]} labelInfo="Optional" error={errored}>{stepContent}</Step>
                    <Step label="Step three" icon={icons[2]}>{stepContent}</Step>
                </Stepper>
                {accordion && reset}
            </Example>
        );
    }

    private handlePrevious = () => this.setState(prevState => ({ activeStep: prevState.activeStep - 1 }));
    private handleNext = () => this.setState(prevState => ({ activeStep: prevState.activeStep + 1 }));
    private handleReset = () => this.setState({ activeStep: 0 });
    private handleAccordionChange = (event: React.FormEvent<HTMLInputElement>) => this.setState({ accordion: event.currentTarget.checked });
    private handleFillChange = (event: React.FormEvent<HTMLInputElement>) => this.setState({ fill: event.currentTarget.checked });
    private handleErrorChange = (event: React.FormEvent<HTMLInputElement>) => this.setState({ errored: event.currentTarget.checked });
    private handleLargeChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ large: event.target.checked });
    private handleVerticalChange = (event: React.FormEvent<HTMLInputElement>) => this.setState({ vertical: event.currentTarget.checked });

    private handleIconChange = (event: React.FormEvent<HTMLSelectElement>) => this.setState({ iconType: event.currentTarget.value as keyof typeof iconTypes });
}
