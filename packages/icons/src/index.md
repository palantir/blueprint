---
reference: icons
---

@# Icons

Blueprint provides over 300 vector UI icons in two sizes (16px and 20px) and two formats (SVG and fonts).
It's easy to change their color or apply effects like text shadows via standard SVG or CSS properties.

There are two ways of using Blueprint UI icons, described in more detail in the
[**Icon component documentation**](#core/components/icon):

1. React component renders SVG paths: `<Icon icon="more" />`
2. CSS classes use icon fonts: `<span className="@ns-icon-standard @ns-icon-more" />`

Many Blueprint [components](#core/components) support an `icon` prop to control a React `<Icon>` component, which accepts both the full name `@ns-icon-projects` and the short name `projects`.

@reactDocs Icons
