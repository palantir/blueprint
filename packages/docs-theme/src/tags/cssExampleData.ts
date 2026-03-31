/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

export interface CssModifier {
    name: string;
    documentation: string;
}

export interface CssExampleData {
    markup: string;
    modifiers: CssModifier[];
    reference: string;
}

/* eslint-disable max-len */

export const cssExampleData: Record<string, CssExampleData> = {
    "ui-text": {
        reference: "ui-text",
        markup: `<div class="{{.modifier}}">
  More than a decade ago, we set out to create products that would transform
  the way organizations use their data. Today, our products are deployed at
  the most critical government, commercial, and non-profit institutions in
  the world to solve problems we hadn't even dreamed of back then.
</div>`,
        modifiers: [
            {
                name: ".bp6-ui-text",
                documentation:
                    "Default Blueprint font styles, applied to the <code>&lt;body&gt;</code> tag and available as a class for nested resets.",
            },
            { name: ".bp6-monospace-text", documentation: "Use a monospace font (ideal for code)." },
            {
                name: ".bp6-running-text",
                documentation:
                    'Increase line height ideal for longform text. See <a href="#core/typography.running-text">Running text</a> below for additional features.',
            },
            { name: ".bp6-text-large", documentation: "Use a larger font size." },
            { name: ".bp6-text-small", documentation: "Use a smaller font size." },
            {
                name: ".bp6-text-muted",
                documentation:
                    'Change text color to a gentler gray. This text color meets <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum">minimum contrast standards of WCAG 2.1</a> for $white through $light-gray4 in light theme, and $black through $dark-gray4 in dark theme.',
            },
            {
                name: ".bp6-text-disabled",
                documentation:
                    'Change text color to a transparent, faded gray. This text color will not meet minimum contrast standards and should only be used on &quot;incidental&quot; text as defined by <a href="https://www.w3.org/TR/WCAG21/#contrast-minimum">WCAG 2.1 Contrast Minimum</a>, either purely decorative, or text of a disabled UI element.',
            },
            {
                name: ".bp6-text-overflow-ellipsis",
                documentation: "Truncate a single line of text with an ellipsis if it overflows its container.",
            },
        ],
    },
    "running-text": {
        reference: "running-text",
        markup: `<div class="bp6-running-text {{.modifier}}">
  <p>
    We build products that make people better at their most important
    work — the kind of work you read about on the front page of the
    newspaper, not just the technology section.
  </p>
  <ul>
    <li>Item the <code>first</code>.</li>
    <li>Item the <strong>second</strong>.</li>
    <li>Item the <a href="#core/typography.running-text">third</a>.</li>
  </ul>
  <h3>Scale, Speed, Agility</h3>
  <p>
    A successful data transformation requires the whole organization — users, the IT shop, and
    leadership — to operate in lockstep. With Foundry, the enterprise comes together to
    transform the organization and turn data into a competitive advantage.
  </p>
</div>`,
        modifiers: [{ name: ".bp6-text-large", documentation: "Use larger font size." }],
    },
    headings: {
        reference: "headings",
        markup: `<div>
  <h1 class="bp6-heading {{.modifier}}">H1 heading</h1>
  <h2 class="bp6-heading {{.modifier}}">H2 heading</h2>
  <h3 class="bp6-heading {{.modifier}}">H3 heading</h3>
  <h4 class="bp6-heading {{.modifier}}">H4 heading</h4>
  <h5 class="bp6-heading {{.modifier}}">H5 heading</h5>
  <h6 class="bp6-heading {{.modifier}}">H6 heading</h6>
</div>`,
        modifiers: [{ name: ".bp6-text-muted", documentation: "Change text color to a gentler gray." }],
    },
    preformatted: {
        reference: "preformatted",
        markup: `<div>
  <p>Use the <code class="bp6-code">&lt;code&gt;</code> tag for snippets of code.</p>
  <pre class="bp6-code-block">Use the &lt;pre&gt; tag for blocks of code.</pre>
  <pre class="bp6-code-block"><code>// code sample
export function hasModifier(
  modifiers: ts.ModifiersArray,
  ...modifierKinds: ts.SyntaxKind[],
) {
  if (modifiers == null || modifierKinds == null) {
    return false;
  }
  return modifiers.some(m => modifierKinds.some(k => m.kind === k));
}</code></pre>
</div>`,
        modifiers: [],
    },
    blockquote: {
        reference: "blockquote",
        markup: `<blockquote class="bp6-blockquote">
  Premium Aerotec is a key supplier for Airbus, producing 30 million parts per year,
  which is huge complexity. Skywise helps us manage all the production steps.
  It gives Airbus much better visibility into where the product is in the supply chain,
  and it lets us immediately see our weak points so we can react on the spot.
</blockquote>`,
        modifiers: [],
    },
    lists: {
        reference: "lists",
        markup: `<ol class="{{.modifier}}">
  <li>Item the first</li>
  <li>Item the second</li>
  <li>
    Item the third
    <ul class="{{.modifier}}">
      <li>Item the fourth</li>
      <li>Item the fifth</li>
    </ul>
  </li>
</ol>`,
        modifiers: [
            { name: ".bp6-list", documentation: "Add a little spacing between items for readability." },
            {
                name: ".bp6-list-unstyled",
                documentation: "Remove all list styling (including indicators) so you can add your own.",
            },
        ],
    },
    rtl: {
        reference: "rtl",
        markup: `<h5 class="bp6-heading">Arabic:</h5>
<p class="bp6-rtl">
  لكل لأداء بمحاولة من. مدينة الواقعة يبق أي, وإعلان وقوعها، حول كل, حدى عجّل مشروط الخاسرة قد.
  من الذود تكبّد بين, و لها واحدة الأراضي. عل الصفحة والروسية يتم, أي للحكومة استعملت شيء. أم وصل زهاء اليا
</p>
<h5 class="bp6-heading">Hebrew:</h5>
<p class="bp6-rtl">
  כדי על עזרה יידיש הבהרה, מלא באגים טכניים דת. תנך או ברית ביולי. כתב בה הטבע למנוע, דת כלים פיסיקה החופשית זכר.
  מתן החלל מאמרשיחהצפה ב. הספרות אנציקלופדיה אם זכר, על שימושי שימושיים תאולוגיה עזה
</p>`,
        modifiers: [],
    },
    skeleton: {
        reference: "skeleton",
        markup: `<div class="bp6-card">
  <h5 class="bp6-heading"><a class="{{.modifier}}" href="#" tabindex="-1">Card heading</a></h5>
  <p class="{{.modifier}}">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget tortor felis.
    Fusce dapibus metus in dapibus mollis. Quisque eget ex diam.
  </p>
  <button type="button" class="bp6-button bp6-icon-add {{.modifier}}" tabindex="-1">Submit</button>
</div>`,
        modifiers: [
            { name: ".bp6-skeleton", documentation: "Render this element as a skeleton, an outline of its true self." },
        ],
    },
};
