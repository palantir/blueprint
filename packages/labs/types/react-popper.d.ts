declare module "react-popper" {
  import * as React from "react";
  import * as PopperJS from "popper.js";

  interface IRestProps {
    restProps: {
      [prop: string]: any;
    },
  }

  interface IComponentProps<T> {
    children?: React.ReactNode | React.SFC<T & IRestProps>;
    component?: React.ReactType;
    innerRef?: (ref: HTMLElement) => void;
    [prop: string]: any;
  }

  interface IManagerProps {
    tag?: string | boolean;
    [prop: string]: any;
  }

  class Manager extends React.Component<IManagerProps, {}> {
  }

  interface IPopperChildrenProps extends IRestProps {
    popperProps: {
      ref: (ref: HTMLElement) => void;
      style: React.CSSProperties;
      ["data-placement"]: PopperJS.Placement;
    }
  }

  interface IPopperProps extends IComponentProps<IPopperChildrenProps> {
    eventsEnabled?: boolean;
    modifiers?: PopperJS.Modifiers;
    placement?: PopperJS.Placement;
  }

  class Popper extends React.Component<IPopperProps, {}> {
  }

  interface ITargetChildrenProps extends IRestProps {
    targetProps: {
      ref: (ref: HTMLElement) => void;
    }
  }

  class Target extends React.Component<IComponentProps<ITargetChildrenProps>, {}> {
  }

  interface IArrowChildrenProps extends IRestProps {
    arrowProps: {
      ref: (ref: HTMLElement) => void;
      style: React.CSSProperties;
    }
  }

  class Arrow extends React.Component<IComponentProps<IArrowChildrenProps>, {}> {
  }
}
