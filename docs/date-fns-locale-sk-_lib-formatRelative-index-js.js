"use strict";(self.webpackChunk_blueprintjs_docs_app=self.webpackChunk_blueprintjs_docs_app||[]).push([[7711],{77923:function(e,t,u){var r=u(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,u){(0,a.default)(2,arguments);var r=(0,o.default)(e,u),n=(0,o.default)(t,u);return r.getTime()===n.getTime()};var a=r(u(91562)),o=r(u(60670));e.exports=t.default},31719:function(e,t,u){var r=u(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=r(u(77923)),o=["nedeľu","pondelok","utorok","stredu","štvrtok","piatok","sobotu"];function n(e){return 4===e?"'vo' eeee 'o' p":"'v "+o[e]+" o' p"}var d={lastWeek:function(e,t,u){var r=e.getUTCDay();return(0,a.default)(e,t,u)?n(r):function(e){var t=o[e];switch(e){case 0:case 3:case 6:return"'minulú "+t+" o' p";default:return"'minulý' eeee 'o' p"}}(r)},yesterday:"'včera o' p",today:"'dnes o' p",tomorrow:"'zajtra o' p",nextWeek:function(e,t,u){var r=e.getUTCDay();return(0,a.default)(e,t,u)?n(r):function(e){var t=o[e];switch(e){case 0:case 4:case 6:return"'budúcu "+t+" o' p";default:return"'budúci' eeee 'o' p"}}(r)},other:"P"},f=function(e,t,u,r){var a=d[e];return"function"==typeof a?a(t,u,r):a};t.default=f,e.exports=t.default}}]);