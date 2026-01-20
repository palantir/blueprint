"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "blueprint-icons-all-paths-loader";
exports.ids = ["blueprint-icons-all-paths-loader"];
exports.modules = {

/***/ "(ssr)/../icons/lib/esm/paths-loaders/allPathsLoader.js":
/*!********************************************************!*\
  !*** ../icons/lib/esm/paths-loaders/allPathsLoader.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   allPathsLoader: () => (/* binding */ allPathsLoader)\n/* harmony export */ });\n/*\n * Copyright 2023 Palantir Technologies, Inc. All rights reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */ /**\n * A simple module loader which concatenates all icon paths into a single chunk.\n */ const allPathsLoader = async (name, size)=>{\n    const { getIconPaths } = await __webpack_require__.e(/*! import() | blueprint-icons-all-paths */ \"blueprint-icons-all-paths\").then(__webpack_require__.bind(__webpack_require__, /*! ../allPaths */ \"(ssr)/../icons/lib/esm/allPaths.js\"));\n    return getIconPaths(name, size);\n}; //# sourceMappingURL=allPathsLoader.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vaWNvbnMvbGliL2VzbS9wYXRocy1sb2FkZXJzL2FsbFBhdGhzTG9hZGVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRyxDQUlIOztHQUVHLENBQ0ksTUFBTSxjQUFjLEdBQW9CLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDaEUsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sMk1BRzlCLENBQUM7SUFDRixPQUFPLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyIvVm9sdW1lcy9naXQvc3JjL3BhdGhzLWxvYWRlcnMvYWxsUGF0aHNMb2FkZXIudHMiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../icons/lib/esm/paths-loaders/allPathsLoader.js\n");

/***/ })

};
;