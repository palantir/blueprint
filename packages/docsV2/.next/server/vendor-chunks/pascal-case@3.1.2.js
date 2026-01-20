"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/pascal-case@3.1.2";
exports.ids = ["vendor-chunks/pascal-case@3.1.2"];
exports.modules = {

/***/ "(ssr)/../../node_modules/.pnpm/pascal-case@3.1.2/node_modules/pascal-case/dist.es2015/index.js":
/*!************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/pascal-case@3.1.2/node_modules/pascal-case/dist.es2015/index.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pascalCase: () => (/* binding */ pascalCase),\n/* harmony export */   pascalCaseTransform: () => (/* binding */ pascalCaseTransform),\n/* harmony export */   pascalCaseTransformMerge: () => (/* binding */ pascalCaseTransformMerge)\n/* harmony export */ });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ \"(ssr)/../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs\");\n/* harmony import */ var no_case__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! no-case */ \"(ssr)/../../node_modules/.pnpm/no-case@3.0.4/node_modules/no-case/dist.es2015/index.js\");\n\n\nfunction pascalCaseTransform(input, index) {\n    var firstChar = input.charAt(0);\n    var lowerChars = input.substr(1).toLowerCase();\n    if (index > 0 && firstChar >= \"0\" && firstChar <= \"9\") {\n        return \"_\" + firstChar + lowerChars;\n    }\n    return \"\" + firstChar.toUpperCase() + lowerChars;\n}\nfunction pascalCaseTransformMerge(input) {\n    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();\n}\nfunction pascalCase(input, options) {\n    if (options === void 0) { options = {}; }\n    return (0,no_case__WEBPACK_IMPORTED_MODULE_0__.noCase)(input, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({ delimiter: \"\", transform: pascalCaseTransform }, options));\n}\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bhc2NhbC1jYXNlQDMuMS4yL25vZGVfbW9kdWxlcy9wYXNjYWwtY2FzZS9kaXN0LmVzMjAxNS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFpQztBQUNBO0FBQzFCO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDTztBQUNQLDhCQUE4QjtBQUM5QixXQUFXLCtDQUFNLFFBQVEsK0NBQVEsR0FBRywrQ0FBK0M7QUFDbkY7QUFDQSIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvZ2l0L2JsdWVwcmludC9ub2RlX21vZHVsZXMvLnBucG0vcGFzY2FsLWNhc2VAMy4xLjIvbm9kZV9tb2R1bGVzL3Bhc2NhbC1jYXNlL2Rpc3QuZXMyMDE1L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IF9fYXNzaWduIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBub0Nhc2UgfSBmcm9tIFwibm8tY2FzZVwiO1xuZXhwb3J0IGZ1bmN0aW9uIHBhc2NhbENhc2VUcmFuc2Zvcm0oaW5wdXQsIGluZGV4KSB7XG4gICAgdmFyIGZpcnN0Q2hhciA9IGlucHV0LmNoYXJBdCgwKTtcbiAgICB2YXIgbG93ZXJDaGFycyA9IGlucHV0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChpbmRleCA+IDAgJiYgZmlyc3RDaGFyID49IFwiMFwiICYmIGZpcnN0Q2hhciA8PSBcIjlcIikge1xuICAgICAgICByZXR1cm4gXCJfXCIgKyBmaXJzdENoYXIgKyBsb3dlckNoYXJzO1xuICAgIH1cbiAgICByZXR1cm4gXCJcIiArIGZpcnN0Q2hhci50b1VwcGVyQ2FzZSgpICsgbG93ZXJDaGFycztcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXNjYWxDYXNlVHJhbnNmb3JtTWVyZ2UoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhc2NhbENhc2UoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHJldHVybiBub0Nhc2UoaW5wdXQsIF9fYXNzaWduKHsgZGVsaW1pdGVyOiBcIlwiLCB0cmFuc2Zvcm06IHBhc2NhbENhc2VUcmFuc2Zvcm0gfSwgb3B0aW9ucykpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/pascal-case@3.1.2/node_modules/pascal-case/dist.es2015/index.js\n");

/***/ })

};
;