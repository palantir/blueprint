"use strict";(self.webpackChunk_blueprintjs_docs_app=self.webpackChunk_blueprintjs_docs_app||[]).push([[6915],{77923:function(e,t,a){var r=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,a){(0,u.default)(2,arguments);var r=(0,n.default)(e,a),c=(0,n.default)(t,a);return r.getTime()===c.getTime()};var u=r(a(91562)),n=r(a(60670));e.exports=t.default},42846:function(e,t,a){var r=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u=r(a(25907)),n=r(a(77923)),c=["неделя","понеделник","вторник","сряда","четвъртък","петък","събота"];function s(e){var t=c[e];return 2===e?"'във "+t+" в' p":"'в "+t+" в' p"}var f={lastWeek:function(e,t,a){var r=(0,u.default)(e),f=r.getUTCDay();return(0,n.default)(r,t,a)?s(f):function(e){var t=c[e];switch(e){case 0:case 3:case 6:return"'миналата "+t+" в' p";case 1:case 2:case 4:case 5:return"'миналия "+t+" в' p"}}(f)},yesterday:"'вчера в' p",today:"'днес в' p",tomorrow:"'утре в' p",nextWeek:function(e,t,a){var r=(0,u.default)(e),f=r.getUTCDay();return(0,n.default)(r,t,a)?s(f):function(e){var t=c[e];switch(e){case 0:case 3:case 6:return"'следващата "+t+" в' p";case 1:case 2:case 4:case 5:return"'следващия "+t+" в' p"}}(f)},other:"P"},o=function(e,t,a,r){var u=f[e];return"function"==typeof u?u(t,a,r):u};t.default=o,e.exports=t.default}}]);