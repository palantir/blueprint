// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
var { docs, meta } = defineDocs({
  dir: "content/docs"
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  docs,
  meta
};
