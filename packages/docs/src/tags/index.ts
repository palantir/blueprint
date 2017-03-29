
import { IPageData, ITag } from "documentalist/dist/client";

export type TagRenderer = (tag: ITag, key: React.Key, page: IPageData) => JSX.Element | undefined;

export * from "./css";
export * from "./heading";
export * from "./interface";
export * from "./page";
export * from "./reactDocs";
export * from "./reactExample";

export * from "./defaults";
