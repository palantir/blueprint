/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { IPropertyEntry } from "ts-quick-docs/src/interfaces";

import { ExampleComponentClass } from "../common/resolveExample";
import { getTheme } from "../common/theme";
import { ModifierTable } from "./modifierTable";
import { PropsTable } from "./propsTable";
import { IStyleguideExtensionProps, IStyleguideModifier, IStyleguideSection } from "./styleguide";

const MODIFIER_PLACEHOLDER = /\{\{([\.\:]?)modifier\}\}/g;
const DEFAULT_MODIFIER: IStyleguideModifier = {
    description: "Default",
    name: "default",
};

export interface ISectionProps extends IStyleguideExtensionProps, IProps {
    section: IStyleguideSection;
}

export const SectionHeading: React.SFC<{ depth: number, header: string, reference: string }> =
    ({ depth, header, reference }) => (
        // use createElement so we can dynamically choose tag based on depth
        React.createElement(`h${depth}`, { className: "kss-title" },
            <a className="docs-anchor" key="anchor" name={reference} />,
            <a className="docs-anchor-link" href={"#" + reference} key="link">
                <span className="pt-icon-standard pt-icon-link" />
            </a>,
            header,
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
        const { section } = this.props;
        const sections: JSX.Element[] = section.sections.map((s) => (
            <Section
                key={s.reference}
                resolveDocs={this.props.resolveDocs}
                resolveExample={this.props.resolveExample}
                resolveInterface={this.props.resolveInterface}
                section={s}
            />
        ));
        const example = this.props.resolveExample(section);
        return (
            <section
                className={classNames("docs-section", `depth-${section.depth}`)}
                data-section-id={section.reference}
                data-section-name={section.header}
            >
                <SectionHeading {...section} />
                <div
                    className="kss-description pt-running-text"
                    dangerouslySetInnerHTML={{ __html: section.description }}
                />
                {this.maybeRenderReactDocs()}
                {this.maybeRenderModifiers()}
                <div className="kss-example-wrapper">
                    {this.maybeRenderExample()}
                    {this.maybeRenderExampleComponent(example.component)}
                </div>
                {this.maybeRenderExampleSourceLink(example.sourceUrl)}
                {this.maybeRenderMarkup()}
                {sections}
            </section>
        );
    }

    public componentWillMount() {
        // compute this once since it'll never change and is potentially expensive with inheritance
        this.interfaceProps = this.props.resolveInterface(this.props.section.interfaceName);
    }

    private maybeRenderModifiers() {
        const { interfaceName, modifiers } = this.props.section;
        if (modifiers.length > 0) {
            return <ModifierTable modifiers={modifiers} />;
        } else if (this.interfaceProps.length > 0) {
            return <PropsTable name={interfaceName} props={this.interfaceProps} />;
        }

        return undefined;
    }

    private renderExample(modifier: IStyleguideModifier, index: number) {
        return (
            <div className="kss-example" data-modifier={modifier.name} key={index}>
                <code>{modifier.name}</code>
                <div dangerouslySetInnerHTML={renderExampleForModifier(this.props.section.markup, modifier)} />
            </div>
        );
    }

    private maybeRenderExample() {
        const { markup, modifiers } = this.props.section;
        if (markup != null) {
            const examples = modifiers.map(this.renderExample, this);
            examples.unshift(this.renderExample(DEFAULT_MODIFIER, -1));
            return examples;
        }

        return undefined;
    }

    private maybeRenderReactDocs() {
        const component = this.props.resolveDocs(this.props.section);
        if (component == null) { return undefined; }
        return <div className="kss-description">{React.createElement(component)}</div>;
    }

    private maybeRenderExampleComponent(component: ExampleComponentClass) {
        if (component == null) { return undefined; }
        return <div className="kss-example">{React.createElement(component, { getTheme })}</div>;
    }

    private maybeRenderExampleSourceLink(sourceUrl: string) {
        if (!sourceUrl) { return undefined; }
        return (
            <a className="view-example-source" href={sourceUrl} target="_blank">
                <span className="pt-icon-standard pt-icon-code">&nbsp;</span>View source on GitHub
            </a>
        );
    }

    private maybeRenderMarkup() {
        const { section } = this.props;
        if (section.markup != null && !section.hideMarkup) {
            const html = { __html: section.highlightedMarkup };
            // .pt-running-text for consistent font-size with inline markdown in .scss files
            return <div className="kss-markup kss-style pt-running-text" dangerouslySetInnerHTML={html} />;
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
