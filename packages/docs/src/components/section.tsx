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
import { IStyleguideModifier, IStyleguideSection } from "./styleguide";

const MODIFIER_PLACEHOLDER = /\{\{([\.\:]?)modifier\}\}/g;
const DEFAULT_MODIFIER: IStyleguideModifier = {
    description: "Default",
    name: "default",
};

export interface ISectionProps extends IProps {
    section: IStyleguideSection;
    exampleRenderer(section: IStyleguideSection): { element: JSX.Element, sourceUrl: string };
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
        const { section } = this.props;
        const sections: JSX.Element[] = section.sections.map((s) =>
            <Section key={s.reference} exampleRenderer={this.props.exampleRenderer} section={s} />);
        const example = this.props.exampleRenderer(section);
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
                    {example.element}
                </div>
                {this.maybeRenderExampleSourceLink(example.sourceUrl)}
                {this.maybeRenderMarkup()}
                {sections}
            </section>
        );
    }

    public componentWillMount() {
        // compute this once since it'll never change and is potentially expensive with inheritance
        this.interfaceProps = getProps(this.props.section.interfaceName);
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
        const { reactDocs } = this.props.section;
        if (reactDocs != null) {
            const docsComponent = (ReactDocs as any)[reactDocs];
            if (docsComponent == null) {
                throw new Error(`Unknown component: Blueprint.Docs.${reactDocs}`);
            }
            return React.createElement("div", { className: "kss-description" }, React.createElement(docsComponent));
        }

        return undefined;
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
