# Blueprint CSS default parity

- Baseline: rollback-643ec05ce
- Current: docs-sass-current
- Browser: Chrome/154.0.8037.58
- Computed-style checks: 8040
- Computed-style mismatches: 0
- Existing token-default checks after alias resolution: 2460
- Existing token-default mismatches: 0
- Existing tokens missing from current CSS: 0
- Raw literal-to-alias changes with equivalent resolved defaults: 0
- Theme contract checks passed: 4/4
- Customization contract checks passed: 4/4
- Breadcrumb mask checks passed: 4/4
- Package independence/ownership checks passed: 11/11
- Protected artifact checks passed: 1/1
- Unresolved current token references: 0
- Overall: PASS

## Package summary

| Profile   | Mismatches | Probes with mismatches |
| --------- | ---------: | ---------------------- |
| core      |          0 | None                   |
| datetime  |          0 | None                   |
| datetime2 |          0 | None                   |
| select    |          0 | None                   |
| table     |          0 | None                   |
| docs      |          0 | None                   |

## Theme and portal contracts

- PASS: contract-explicit-dark matches rollback dark/button-rest (0 mismatches)
- PASS: contract-nested-light matches rollback light/button-rest (0 mismatches)
- PASS: contract-class-dark-explicit-light matches rollback light/button-rest (0 mismatches)
- PASS: contract-unscoped-portal matches rollback contract-unscoped-portal (0 mismatches)
- PASS: scoped portal container inherits canonical popover override; expected `rgb(1, 2, 3)`, got `rgb(1, 2, 3)`
- PASS: legacy radius alias works at explicit theme boundary; expected `17px`, got `17px`
- PASS: legacy radius alias does not retarget an arbitrary subtree; expected `4px`, got `4px`
- PASS: canonical radius token works at arbitrary subtree; expected `19px`, got `19px`
- PASS: light breadcrumb-separator preserves the rollback SVG path, 16px geometry, and `rgb(95, 107, 124)` fill through a centered, contained, non-repeating CSS mask
- PASS: light breadcrumb-collapsed preserves the rollback SVG path, 16px geometry, and `rgb(95, 107, 124)` fill through a centered, contained, non-repeating CSS mask
- PASS: dark breadcrumb-separator preserves the rollback SVG path, 16px geometry, and `rgb(171, 179, 191)` fill through a centered, contained, non-repeating CSS mask
- PASS: dark breadcrumb-collapsed preserves the rollback SVG path, 16px geometry, and `rgb(171, 179, 191)` fill through a centered, contained, non-repeating CSS mask
- PASS: DateTime2 profile does not load DateTime component CSS; expected `false`, got `false`
- PASS: DateTime2 standalone profile includes DateTime token-only defaults; expected `true`, got `true`
- PASS: datetime profile explicitly loads the Core prerequisite; expected `true`, got `true`
- PASS: datetime2 profile explicitly loads the Core prerequisite; expected `true`, got `true`
- PASS: select profile explicitly loads the Core prerequisite; expected `true`, got `true`
- PASS: table profile explicitly loads the Core prerequisite; expected `true`, got `true`
- PASS: docs profile explicitly loads the Core prerequisite; expected `true`, got `true`
- PASS: datetime profile emits package-owned --bp-datetime- tokens; expected `true`, got `true`
- PASS: select profile emits package-owned --bp-select- tokens; expected `true`, got `true`
- PASS: table profile emits package-owned --bp-table- tokens; expected `true`, got `true`
- PASS: docs profile emits no docs-owned tokens; expected `false`, got `false`
- PASS: generated Icons CSS remains byte-for-byte unchanged; expected `1eb7489e2ecc968b19a227ca5e3e05f3fcb9fa2544e2a1bd1af662f4a6d032ab`, got `1eb7489e2ecc968b19a227ca5e3e05f3fcb9fa2544e2a1bd1af662f4a6d032ab`

## First 100 computed-style mismatches

None.
