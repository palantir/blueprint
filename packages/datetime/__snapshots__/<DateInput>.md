# `<DateInput>`

#### `renders`

```
<Blueprint3.DateInput
  closeOnSelection={true}
  dayPickerProps={Object {}}
  disabled={false}
  formatDate={[Function]}
  invalidDateMessage="Invalid date"
  maxDate={2018-02-01T00:00:00.000Z}
  minDate={2019-02-01T00:00:00.000Z}
  outOfRangeMessage="Out of range"
  parseDate={[Function]}
  placeholder="M/D/YYYY"
  popoverProps={
    Object {
      "usePortal": false,
    }
  }
  reverseMonthAndYearMenus={false}
  value={2018-07-01T00:00:00.000Z}
>
  <Blueprint3.Popover
    autoFocus={false}
    captureDismiss={false}
    className=""
    content={
      <div>
        <Blueprint3.DatePicker
          canClearSelection={true}
          closeOnSelection={true}
          dayPickerProps={
            Object {
              "onMonthChange": [Function],
            }
          }
          disabled={false}
          formatDate={[Function]}
          invalidDateMessage="Invalid date"
          maxDate={2018-02-01T00:00:00.000Z}
          minDate={2019-02-01T00:00:00.000Z}
          onChange={[Function]}
          outOfRangeMessage="Out of range"
          parseDate={[Function]}
          placeholder="M/D/YYYY"
          popoverProps={
            Object {
              "usePortal": false,
            }
          }
          reverseMonthAndYearMenus={false}
          showActionsBar={false}
          timePickerProps={Object {}}
          value={2018-07-01T00:00:00.000Z}
        />
      </div>
    }
    defaultIsOpen={false}
    disabled={false}
    enforceFocus={false}
    hasBackdrop={false}
    hoverCloseDelay={300}
    hoverOpenDelay={150}
    inheritDarkTheme={true}
    interactionKind="click"
    isOpen={false}
    minimal={false}
    modifiers={Object {}}
    onClose={[Function]}
    openOnTargetFocus={true}
    popoverClassName="bp3-dateinput-popover"
    position="auto"
    targetTagName="span"
    transitionDuration={300}
    usePortal={false}
    wrapperTagName="span"
  >
    <Manager>
      <Provider
        value={
          Object {
            "getReferenceRef": [Function],
            "referenceNode": <span
              class="bp3-popover-target"
            >
              <div
                class="bp3-input-group bp3-intent-danger"
              >
                <input
                  autocomplete="off"
                  class="bp3-input"
                  placeholder="M/D/YYYY"
                  style="padding-right: 10px;"
                  type="text"
                  value="Out of range"
                />
              </div>
            </span>,
          }
        }
      >
        <span
          className="bp3-popover-wrapper"
        >
          <Reference
            innerRef={[Function]}
          >
            <Consumer>
              <InnerReference
                getReferenceRef={[Function]}
                innerRef={[Function]}
              >
                <Blueprint3.ResizeSensor
                  onResize={[Function]}
                >
                  <span
                    className="bp3-popover-target"
                    onClick={[Function]}
                  >
                    <Blueprint3.InputGroup
                      autoComplete="off"
                      className=""
                      disabled={false}
                      inputRef={[Function]}
                      intent="danger"
                      key=".0"
                      onBlur={[Function]}
                      onChange={[Function]}
                      onClick={[Function]}
                      onFocus={[Function]}
                      onKeyDown={[Function]}
                      placeholder="M/D/YYYY"
                      type="text"
                      value="Out of range"
                    >
                      <div
                        className="bp3-input-group bp3-intent-danger"
                      >
                        <Blueprint3.Icon />
                        <input
                          autoComplete="off"
                          className="bp3-input"
                          disabled={false}
                          onBlur={[Function]}
                          onChange={[Function]}
                          onClick={[Function]}
                          onFocus={[Function]}
                          onKeyDown={[Function]}
                          placeholder="M/D/YYYY"
                          style={
                            Object {
                              "paddingRight": 10,
                            }
                          }
                          type="text"
                          value="Out of range"
                        />
                      </div>
                    </Blueprint3.InputGroup>
                  </span>
                </Blueprint3.ResizeSensor>
              </InnerReference>
            </Consumer>
          </Reference>
          <Blueprint3.Overlay
            autoFocus={false}
            backdropClassName="bp3-popover-backdrop"
            backdropProps={Object {}}
            canEscapeKeyClose={true}
            canOutsideClickClose={true}
            enforceFocus={false}
            hasBackdrop={false}
            isOpen={false}
            lazy={true}
            onClose={[Function]}
            transitionDuration={300}
            transitionName="bp3-popover"
            usePortal={false}
          />
        </span>
      </Provider>
    </Manager>
  </Blueprint3.Popover>
</Blueprint3.DateInput>
```

