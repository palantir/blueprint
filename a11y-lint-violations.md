# JSX A11y Lint Violations Report

Generated with `eslint-plugin-jsx-a11y` recommended preset.

## Summary

| Package | Errors |
|---------|--------|
| @blueprintjs/core | 49 |
| @blueprintjs/select | 7 |
| @blueprintjs/datetime | 7 |
| @blueprintjs/table | 5 |
| @blueprintjs/docs-theme | 4 |
| @blueprintjs/docs-app | 20 |
| @blueprintjs/table-dev-app | 1 |
| **Total** | **93** |

---

## @blueprintjs/select (7 errors)

### jsx-a11y/no-autofocus (4)
| File | Line |
|------|------|
| src/components/multi-select/multiSelect.tsx | 221 |
| src/components/omnibar/omnibar.tsx | 101 |
| src/components/select/select.tsx | 198 |
| src/components/suggest/suggest.tsx | 201 |

### jsx-a11y/no-static-element-interactions (3)
| File | Line |
|------|------|
| src/components/multi-select/multiSelect.tsx | 230 |
| src/components/select/select.tsx | 206 |
| src/components/suggest/suggest.tsx | 208 |

---

## @blueprintjs/core (49 errors)

### Source Files

#### jsx-a11y/no-static-element-interactions (9)
| File | Line |
|------|------|
| src/components/dialog/multistepDialog.tsx | 188 |
| src/components/overlay/overlay.tsx | 139 |
| src/components/overlay/overlay.tsx | 259 |
| src/components/overlay2/overlay2.tsx | 635 |
| src/components/overlay2/overlay2.tsx | 690 |
| src/components/section/section.tsx | 179 |
| src/components/slider/multiSlider.tsx | 208 |
| src/components/tag-input/tagInput.tsx | 318 |

#### jsx-a11y/no-noninteractive-tabindex (4)
| File | Line |
|------|------|
| src/components/dialog/multistepDialog.tsx | 191 |
| src/components/overlay/overlay.tsx | 281 |
| src/components/overlay2/overlay2.tsx | 531 |
| src/components/toast/toast.tsx | 93 |

#### jsx-a11y/no-autofocus (5)
| File | Line |
|------|------|
| src/components/menu/menuItem.tsx | 287 |
| src/components/popover/popover.tsx | 425 |
| src/components/toast/overlayToaster.tsx | 262 |
| src/components/tooltip/tooltip.tsx | 137 |

#### jsx-a11y/click-events-have-key-events (4)
| File | Line |
|------|------|
| src/components/section/section.tsx | 179 |
| src/components/tabs/tabTitle.tsx | 62 |
| src/components/tag-input/tagInput.tsx | 318 |

#### jsx-a11y/interactive-supports-focus (2)
| File | Line |
|------|------|
| src/components/tabs/tabTitle.tsx | 62 |
| src/components/tabs/tabs.tsx | 201 |

### Test Files

#### jsx-a11y/tabindex-no-positive (3)
| File | Line |
|------|------|
| test/card/cardTests.tsx | 64 |
| test/controls/inputGroupTests.tsx | 38 |
| test/menu/menuItemTests.tsx | 268 |

#### jsx-a11y/no-static-element-interactions (1)
| File | Line |
|------|------|
| test/hooks/useHotkeysTests.tsx | 76 |

#### jsx-a11y/click-events-have-key-events (1)
| File | Line |
|------|------|
| test/icon/iconTests.tsx | 89 |

#### jsx-a11y/no-noninteractive-element-interactions (1)
| File | Line |
|------|------|
| test/icon/iconTests.tsx | 89 |

#### jsx-a11y/no-autofocus (8)
| File | Line |
|------|------|
| test/overlay/overlayTests.tsx | 268 |
| test/overlay/overlayTests.tsx | 281 |
| test/overlay/overlayTests.tsx | 298 |
| test/overlay/overlayTests.tsx | 311 |
| test/overlay2/overlay2Tests.tsx | 371 |
| test/overlay2/overlay2Tests.tsx | 392 |
| test/overlay2/overlay2Tests.tsx | 410 |
| test/overlay2/overlay2Tests.tsx | 431 |
| test/popover/popoverTests.tsx | 1422 |
| test/popover/popoverTests.tsx | 1439 |

#### jsx-a11y/no-noninteractive-tabindex (6)
| File | Line |
|------|------|
| test/overlay/overlayTests.tsx | 573 |
| test/overlay2/overlay2Tests.tsx | 481 |
| test/overlay2/overlay2Tests.tsx | 610 |
| test/overlay2/overlay2Tests.tsx | 810 |
| test/overlay2/overlay2Tests.tsx | 834 |

---

## @blueprintjs/datetime (7 errors)

#### jsx-a11y/no-noninteractive-tabindex (2)
| File | Line |
|------|------|
| src/components/date-input/dateInput.tsx | 265 |
| src/components/date-input/dateInput.tsx | 282 |

#### jsx-a11y/no-autofocus (2)
| File | Line |
|------|------|
| src/components/date-input/dateInput.tsx | 544 |
| src/components/date-range-input/dateRangeInput.tsx | 233 |

#### jsx-a11y/click-events-have-key-events (1)
| File | Line |
|------|------|
| src/components/time-picker/timePicker.tsx | 163 |

#### jsx-a11y/no-static-element-interactions (1)
| File | Line |
|------|------|
| src/components/time-picker/timePicker.tsx | 163 |

#### jsx-a11y/no-autofocus (1)
| File | Line |
|------|------|
| src/components/time-picker/timePicker.tsx | 203 |

---

## @blueprintjs/table (5 errors)

#### jsx-a11y/click-events-have-key-events (1)
| File | Line |
|------|------|
| src/cell/formats/truncatedFormat.tsx | 249 |

#### jsx-a11y/no-static-element-interactions (3)
| File | Line |
|------|------|
| src/cell/formats/truncatedFormat.tsx | 249 |
| src/table.tsx | 524 |
| src/table.tsx | 779 |

#### jsx-a11y/no-noninteractive-tabindex (1)
| File | Line |
|------|------|
| src/table.tsx | 530 |

---

## @blueprintjs/docs-theme (4 errors)

#### jsx-a11y/click-events-have-key-events (1)
| File | Line |
|------|------|
| src/components/navButton.tsx | 30 |

#### jsx-a11y/no-static-element-interactions (1)
| File | Line |
|------|------|
| src/components/navButton.tsx | 30 |

#### jsx-a11y/anchor-has-content (1)
| File | Line |
|------|------|
| src/tags/heading.tsx | 34 |

#### jsx-a11y/anchor-is-valid (1)
| File | Line |
|------|------|
| src/tags/heading.tsx | 34 |

---

## @blueprintjs/table-dev-app (1 error)

#### jsx-a11y/mouse-events-have-key-events (1)
| File | Line |
|------|------|
| src/mutableTable.tsx | 365 |

---

## @blueprintjs/docs-app (20 errors)

#### jsx-a11y/click-events-have-key-events (1)
| File | Line |
|------|------|
| src/components/clickToCopy.tsx | 100 |

#### jsx-a11y/no-static-element-interactions (5)
| File | Line |
|------|------|
| src/components/clickToCopy.tsx | 100 |
| src/components/colorSchemes.tsx | 201 |
| src/examples/core-examples/hotkeyTesterExample.tsx | 35 |
| src/examples/core-examples/hotkeysTargetExample.tsx | 240 |
| src/examples/core-examples/useHotkeysExample.tsx | 352 |

#### jsx-a11y/no-noninteractive-tabindex (4)
| File | Line |
|------|------|
| src/components/colorSchemes.tsx | 201 |
| src/examples/core-examples/hotkeyTesterExample.tsx | 39 |
| src/examples/core-examples/hotkeysTargetExample.tsx | 241 |
| src/examples/core-examples/useHotkeysExample.tsx | 353 |

#### jsx-a11y/no-autofocus (7)
| File | Line |
|------|------|
| src/components/icons.tsx | 57 |
| src/examples/core-examples/drawerExample.tsx | 115 |
| src/examples/core-examples/multistepDialogExample.tsx | 152 |
| src/examples/core-examples/popoverDismissExample.tsx | 50 |
| src/examples/core-examples/popoverDismissExample.tsx | 62 |
| src/examples/core-examples/popoverExample.tsx | 278 |
| src/examples/datetime-examples/timePickerExample.tsx | 128 |

#### jsx-a11y/label-has-associated-control (3)
| File | Line |
|------|------|
| src/examples/core-examples/common/iconSelect.tsx | 38 |
| src/examples/datetime-examples/timePickerExample.tsx | 106 |
| src/examples/datetime-examples/timePickerExample.tsx | 113 |

---

## Common Issues & Recommended Fixes

### 1. `jsx-a11y/no-autofocus`
The `autoFocus` prop can reduce usability for screen reader users. Consider:
- Removing autoFocus where not essential
- Using `// eslint-disable-next-line jsx-a11y/no-autofocus` with justification for intentional use

### 2. `jsx-a11y/no-static-element-interactions`
Non-interactive elements (like `<div>`) have event handlers. Fix by:
- Adding `role="button"` or appropriate role
- Using a native `<button>` element instead
- Adding `tabIndex={0}` for keyboard accessibility

### 3. `jsx-a11y/no-noninteractive-tabindex`
`tabIndex` on non-interactive elements. Fix by:
- Adding an appropriate `role` attribute
- Using an interactive element like `<button>`

### 4. `jsx-a11y/click-events-have-key-events`
Click handlers without keyboard support. Fix by:
- Adding `onKeyDown` or `onKeyUp` handlers
- Using a native `<button>` element

### 5. `jsx-a11y/interactive-supports-focus`
Interactive role elements must be focusable. Fix by:
- Adding `tabIndex={0}`

### 6. `jsx-a11y/tabindex-no-positive` (test files)
Positive tabIndex values disrupt natural tab order. Use `0` or `-1` only.
