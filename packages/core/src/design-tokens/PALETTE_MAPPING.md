# Legacy palette mapping

This table maps the existing `palette.*` values to the new, literal **light-theme** `color.*` values. Token paths correspond to CSS names such as `--bp-palette-blue-3` and `--bp-color-blue-9`.

Exact matches compare RGBA values, including opacity, to numerical precision. Rounded-only matches share an 8-bit hex preview but are not the same color value. A dash means the old value is not present in that category; all legacy tokens remain available unchanged.

The numbered values are literals, not references to the legacy palette or runtime derivation recipes. Established light values and dark Button snapshots are retained. `color.white` and `color.black` match the legacy values; every family's `contrast` token references one of those shared colors. Transparent colors remain transparent. Other default role pairings are not contrast guarantees.

Each family has `contrast`, `contrast-hover`, and `contrast-active` foregrounds for solid steps 9, 10, and 11 respectively. Each pairing meets 4.5:1 in both themes without changing the preserved fills. States can require different foregrounds: forest's hover foreground uses literal `#000000` because neither shared Blueprint white nor black meets the target on step 10. The shared-color rows below list rest (`contrast`) mappings only.

The separate `themes/dark/palette.dark.tokens.json` defines all 13 roles and state-specific solid contrast foregrounds for every light-theme family. Existing grey3–5, intent solid9–11, border and foreground snapshots remain unchanged; additional dark roles no longer inherit light primitive values. Dark semantic intent and text aliases are declared in the same scope so they resolve against these dark primitives. The dark values are not included in this light-only table.

Custom Storybook accents use a separate OKLCH-based generator, not these default literals or Radix's exact algorithm. Generated solid9 retains the normalized input; solid9–11 share a foreground meeting 4.5:1, and text12–13 meet 4.5:1 against generated backgrounds1–5. These guarantees apply to generated palettes, not to all preserved default treatments.

| Previous token         | Value     | Exact new token(s)                                                                           | Rounded-only match(es) |
| ---------------------- | --------- | -------------------------------------------------------------------------------------------- | ---------------------- |
| `palette.black`        | `#111418` | `color.black`; `color.<family>.contrast` for `orange`, `turquoise`, `forest`, `lime`, `gold` | —                      |
| `palette.white`        | `#ffffff` | `color.white`; `color.<family>.contrast` for all other families                              | —                      |
| `palette.dark-gray.1`  | `#1c2127` | `color.grey.13`                                                                              | —                      |
| `palette.dark-gray.2`  | `#252a31` | —                                                                                            | —                      |
| `palette.dark-gray.3`  | `#2f343c` | —                                                                                            | —                      |
| `palette.dark-gray.4`  | `#383e47` | `color.grey.11`                                                                              | —                      |
| `palette.dark-gray.5`  | `#404854` | `color.grey.10`                                                                              | —                      |
| `palette.gray.1`       | `#5f6b7c` | `color.grey.9`, `color.grey.12`                                                              | —                      |
| `palette.gray.2`       | `#738091` | `color.grey.8`                                                                               | —                      |
| `palette.gray.3`       | `#8f99a8` | —                                                                                            | —                      |
| `palette.gray.4`       | `#abb3bf` | —                                                                                            | —                      |
| `palette.gray.5`       | `#c5cbd3` | —                                                                                            | —                      |
| `palette.light-gray.1` | `#d3d8de` | —                                                                                            | —                      |
| `palette.light-gray.2` | `#dce0e5` | —                                                                                            | —                      |
| `palette.light-gray.3` | `#e5e8eb` | —                                                                                            | —                      |
| `palette.light-gray.4` | `#edeff2` | —                                                                                            | —                      |
| `palette.light-gray.5` | `#f6f7f9` | `color.grey.1`                                                                               | —                      |
| `palette.blue.1`       | `#184a90` | `color.blue.11`, `color.blue.13`                                                             | —                      |
| `palette.blue.2`       | `#215db0` | `color.blue.10`, `color.blue.12`                                                             | —                      |
| `palette.blue.3`       | `#2d72d2` | `color.blue.9`                                                                               | —                      |
| `palette.blue.4`       | `#4c90f0` | —                                                                                            | —                      |
| `palette.blue.5`       | `#8abbff` | —                                                                                            | —                      |
| `palette.green.1`      | `#165a36` | `color.green.11`, `color.green.13`                                                           | —                      |
| `palette.green.2`      | `#1c6e42` | `color.green.10`, `color.green.12`                                                           | —                      |
| `palette.green.3`      | `#238551` | `color.green.9`                                                                              | —                      |
| `palette.green.4`      | `#32a467` | —                                                                                            | —                      |
| `palette.green.5`      | `#72ca9b` | —                                                                                            | —                      |
| `palette.orange.1`     | `#77450d` | `color.orange.13`                                                                            | —                      |
| `palette.orange.2`     | `#935610` | `color.orange.12`                                                                            | —                      |
| `palette.orange.3`     | `#c87619` | —                                                                                            | —                      |
| `palette.orange.4`     | `#ec9a3c` | —                                                                                            | —                      |
| `palette.orange.5`     | `#fbb360` | `color.orange.9`                                                                             | —                      |
| `palette.red.1`        | `#8e292c` | `color.red.11`, `color.red.13`                                                               | —                      |
| `palette.red.2`        | `#ac2f33` | `color.red.10`, `color.red.12`                                                               | —                      |
| `palette.red.3`        | `#cd4246` | `color.red.9`                                                                                | —                      |
| `palette.red.4`        | `#e76a6e` | —                                                                                            | —                      |
| `palette.red.5`        | `#fa999c` | —                                                                                            | —                      |
| `palette.vermilion.1`  | `#96290d` | `color.vermilion.11`, `color.vermilion.13`                                                   | —                      |
| `palette.vermilion.2`  | `#b83211` | `color.vermilion.10`, `color.vermilion.12`                                                   | —                      |
| `palette.vermilion.3`  | `#d33d17` | `color.vermilion.9`                                                                          | —                      |
| `palette.vermilion.4`  | `#eb6847` | —                                                                                            | —                      |
| `palette.vermilion.5`  | `#ff9980` | —                                                                                            | —                      |
| `palette.rose.1`       | `#a82255` | `color.rose.11`, `color.rose.13`                                                             | —                      |
| `palette.rose.2`       | `#c22762` | `color.rose.10`, `color.rose.12`                                                             | —                      |
| `palette.rose.3`       | `#db2c6f` | `color.rose.9`                                                                               | —                      |
| `palette.rose.4`       | `#f5498b` | —                                                                                            | —                      |
| `palette.rose.5`       | `#ff66a1` | —                                                                                            | —                      |
| `palette.violet.1`     | `#5c255c` | `color.violet.11`, `color.violet.13`                                                         | —                      |
| `palette.violet.2`     | `#7c327c` | `color.violet.10`, `color.violet.12`                                                         | —                      |
| `palette.violet.3`     | `#9d3f9d` | `color.violet.9`                                                                             | —                      |
| `palette.violet.4`     | `#bd6bbd` | —                                                                                            | —                      |
| `palette.violet.5`     | `#d69fd6` | —                                                                                            | —                      |
| `palette.indigo.1`     | `#5642a6` | `color.indigo.11`, `color.indigo.13`                                                         | —                      |
| `palette.indigo.2`     | `#634dbf` | `color.indigo.10`, `color.indigo.12`                                                         | —                      |
| `palette.indigo.3`     | `#7961db` | `color.indigo.9`                                                                             | —                      |
| `palette.indigo.4`     | `#9881f3` | —                                                                                            | —                      |
| `palette.indigo.5`     | `#bdadff` | —                                                                                            | —                      |
| `palette.cerulean.1`   | `#0c5174` | `color.cerulean.11`, `color.cerulean.13`                                                     | —                      |
| `palette.cerulean.2`   | `#0f6894` | `color.cerulean.10`, `color.cerulean.12`                                                     | —                      |
| `palette.cerulean.3`   | `#147eb3` | `color.cerulean.9`                                                                           | —                      |
| `palette.cerulean.4`   | `#3fa6da` | —                                                                                            | —                      |
| `palette.cerulean.5`   | `#68c1ee` | —                                                                                            | —                      |
| `palette.turquoise.1`  | `#004d46` | `color.turquoise.11`, `color.turquoise.13`                                                   | —                      |
| `palette.turquoise.2`  | `#007067` | `color.turquoise.10`, `color.turquoise.12`                                                   | —                      |
| `palette.turquoise.3`  | `#00a396` | `color.turquoise.9`                                                                          | —                      |
| `palette.turquoise.4`  | `#13c9ba` | —                                                                                            | —                      |
| `palette.turquoise.5`  | `#7ae1d8` | —                                                                                            | —                      |
| `palette.forest.1`     | `#1d7324` | `color.forest.11`, `color.forest.13`                                                         | —                      |
| `palette.forest.2`     | `#238c2c` | `color.forest.10`, `color.forest.12`                                                         | —                      |
| `palette.forest.3`     | `#29a634` | `color.forest.9`                                                                             | —                      |
| `palette.forest.4`     | `#43bf4d` | —                                                                                            | —                      |
| `palette.forest.5`     | `#62d96b` | —                                                                                            | —                      |
| `palette.lime.1`       | `#43501b` | `color.lime.11`, `color.lime.13`                                                             | —                      |
| `palette.lime.2`       | `#5a701a` | `color.lime.10`, `color.lime.12`                                                             | —                      |
| `palette.lime.3`       | `#8eb125` | `color.lime.9`                                                                               | —                      |
| `palette.lime.4`       | `#b6d94c` | —                                                                                            | —                      |
| `palette.lime.5`       | `#d4f17e` | —                                                                                            | —                      |
| `palette.gold.1`       | `#5c4405` | `color.gold.11`, `color.gold.13`                                                             | —                      |
| `palette.gold.2`       | `#866103` | `color.gold.10`, `color.gold.12`                                                             | —                      |
| `palette.gold.3`       | `#d1980b` | `color.gold.9`                                                                               | —                      |
| `palette.gold.4`       | `#f0b726` | —                                                                                            | —                      |
| `palette.gold.5`       | `#fbd065` | —                                                                                            | —                      |
| `palette.sepia.1`      | `#5e4123` | `color.sepia.11`, `color.sepia.13`                                                           | —                      |
| `palette.sepia.2`      | `#7a542e` | `color.sepia.10`, `color.sepia.12`                                                           | —                      |
| `palette.sepia.3`      | `#946638` | `color.sepia.9`                                                                              | —                      |
| `palette.sepia.4`      | `#af855a` | —                                                                                            | —                      |
| `palette.sepia.5`      | `#d0b090` | —                                                                                            | —                      |

`color.orange.9` now stores legacy `palette.orange.5` (`#fbb360`) exactly. The warning Button’s modern relative rest color only rounds to that value; `color.orange.10` and `color.orange.11` retain browser-evaluated hover/active mixes based on that modern rest color.
