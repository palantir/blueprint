/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { IProps } from "@blueprint/core";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { IPropertyEntry } from "ts-quick-docs/src/interfaces";

import { getProps } from "../common/props";
import { ModifierTable } from "./modifierTable";
import { PropsTable } from "./propsTable";
import * as ReactDocs from "./reactDocs";
import * as ReactExamples from "./reactExamples";
import { IStyleguideModifier, IStyleguideSection, getTheme } from "./styleguide";

const MODIFIER_PLACEHOLDER = /\{\{([\.\:]?)modifier\}\}/g;
const DEFAULT_MODIFIER: IStyleguideModifier = {
    description: "Default",
    name: "default",
};
const SRC_HREF_BASE = "https://github.com/palantir/blueprint/blob/develop/packages/docs/src/examples";

export interface ISectionProps extends IStyleguideSection, IProps {
}

export const SectionHeading: React.SFC<{ depth: number, header: string, reference: string }> =
    ({ depth, header, reference }) => (
        // use createElement so we can dynamically choose tag based on depth
        React.createElement(`h${depth}`, { className: "kss-title", id: reference },
            <a className="kss-anchor" href={"#" + reference} key={0}>
                <span className="pt-icon-standard pt-icon-link" />
            </a>,
            header
        )
    );

/**
 * A section is composed of the following pieces, in order:
 * 1. header
 * 2. HTML description rendered from Markdown
 * 3. table of all modifier classes and attributes
 * 4. example banner containing markup template re-rendered for each modifier
 *   - example banner also contains React and Angular examples, if defined using
 *     @react-example or @angular-example KSS flags
 * 5. HTML markup template, rendered as text
 * 6. Any React children, usually sub-sections
 */
@PureRender
export class Section extends React.Component<ISectionProps, {}> {
    private interfaceProps: IPropertyEntry[];

    public render() {
        const sections: JSX.Element[] = this.props.sections.map((s) => <Section {...s} key={s.reference} />);
        return (
            <section
                className={classNames("docs-section", `depth-${this.props.depth}`)}
                data-section-id={this.props.reference}
                data-section-name={this.props.header}
            >
                <SectionHeading {...this.props} />
                <div
                    className="kss-description pt-running-text"
                    dangerouslySetInnerHTML={{ __html: this.props.description }}
                />
                {this.maybeRenderReactDocs()}
                {this.maybeRenderModifiers()}
                <div className="kss-example-wrapper">
                    {this.maybeRenderExample()}
                    {this.maybeRenderReactExample()}
                </div>
                {this.maybeRenderExampleSourceLink()}
                {this.maybeRenderMarkup()}
                {sections}
            </section>
        );
    }

    public componentWillMount() {
        // compute this once since it'll never change and is potentially expensive with inheritance
        this.interfaceProps = getProps(this.props.interfaceName);
    }

    private maybeRenderModifiers() {
        if (this.props.modifiers.length > 0) {
            return <ModifierTable modifiers={this.props.modifiers} />;
        } else if (this.interfaceProps.length > 0) {
            return <PropsTable name={this.props.interfaceName} props={this.interfaceProps} />;
        }

        return undefined;
    }

    private renderExample(modifier: IStyleguideModifier, index: number) {
        return (
            <div className="kss-example" data-modifier={modifier.name} key={index}>
                <code>{modifier.name}</code>
                <div dangerouslySetInnerHTML={renderExampleForModifier(this.props.markup, modifier)} />
            </div>
        );
    }

    private maybeRenderExample() {
        if (this.props.markup != null) {
            const examples = this.props.modifiers.map(this.renderExample, this);
            examples.unshift(this.renderExample(DEFAULT_MODIFIER, -1));
            return examples;
        }

        return undefined;
    }

    private maybeRenderReactDocs() {
        if (this.props.reactDocs != null) {
            const docsComponent = (ReactDocs as any)[this.props.reactDocs];
            if (docsComponent == null) {
                throw new Error(`Unknown component: Blueprint.Docs.${this.props.reactDocs}`);
            }
            return React.createElement("div", { className: "kss-description" }, React.createElement(docsComponent));
        }

        return undefined;
    }

    private maybeRenderReactExample() {
        if (this.props.reactExample != null) {
            const exampleComponent = (ReactExamples as any)[this.props.reactExample];
            if (exampleComponent == null) {
                throw new Error(`Unknown component: Blueprint.Examples.${this.props.reactExample}`);
            }
            return <div className="kss-example">{React.createElement(exampleComponent, { getTheme })}</div>;
        }

        return undefined;
    }

    private maybeRenderExampleSourceLink() {
        let fileName: string;

        // validation in maybeRenderAngularExample ensures that exactly one of the following branches will execute
        if (this.props.reactExample != null) {
            // DialogExample => dialogExample.tsx
            fileName = this.props.reactExample.charAt(0).toLowerCase() + this.props.reactExample.slice(1) + ".tsx";
        } else if (this.props.angularExample != null) {
            // @angular-example is already the filename minus extension
            fileName = this.props.angularExample + ".ts";
        } else {
            return undefined;
        }
        return (
            <a className="view-example-source" href={`${SRC_HREF_BASE}/${fileName}`} target="_blank">
                <span className="pt-icon-standard pt-icon-code">&nbsp;</span>View source on GitHub
            </a>
        );
    }

    private maybeRenderMarkup() {
        if (this.props.markup != null && !this.props.hideMarkup) {
            const html = { __html: this.props.highlightedMarkup };
            return <div className="kss-markup kss-style" dangerouslySetInnerHTML={html} />;
        }

        return undefined;
    }
}

function renderExampleForModifier(markup: string, modifier: IStyleguideModifier) {
    let { name } = modifier;
    const html = markup.replace(MODIFIER_PLACEHOLDER, (_, prefix) => {
        if (prefix && name.charAt(0) === prefix) {
            return name.slice(1);
        } else if (!prefix) {
            return name;
        } else {
            return "";
        }
    });
    return { __html: html };
}
