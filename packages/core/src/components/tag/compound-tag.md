---
tag: new
---

@# Compound Tag

**Compound Tag** is a variant of [**Tag**](#core/components/tag) which renders textual information in
a pair (sometimes referred to as a "key-value pair"). The content on the left and right is visually
segmented to signify the pairwise relationship. Just like **Tag**, this component supports a range
of visual modifiers for many different situations and its colors are designed to be accessible in
almost any context.

@reactExample CompoundTagExample

@## Usage

The `<CompoundTag>` component is a stateless wrapper around its children with support for an optional close button.
It supports all valid `<span>` DOM attributes.

Content for the left side of the tag is specified with the `leftContent` prop.

@## Props interface

@interface CompoundTagProps
