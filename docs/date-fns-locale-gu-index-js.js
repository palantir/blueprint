"use strict";(self.webpackChunk_blueprintjs_docs_app=self.webpackChunk_blueprintjs_docs_app||[]).push([[11455,7606,21603,10399,26640,96605],{53278:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={lessThanXSeconds:{one:"હમણાં",other:"​આશરે {{count}} સેકંડ"},xSeconds:{one:"1 સેકંડ",other:"{{count}} સેકંડ"},halfAMinute:"અડધી મિનિટ",lessThanXMinutes:{one:"આ મિનિટ",other:"​આશરે {{count}} મિનિટ"},xMinutes:{one:"1 મિનિટ",other:"{{count}} મિનિટ"},aboutXHours:{one:"​આશરે 1 કલાક",other:"​આશરે {{count}} કલાક"},xHours:{one:"1 કલાક",other:"{{count}} કલાક"},xDays:{one:"1 દિવસ",other:"{{count}} દિવસ"},aboutXWeeks:{one:"આશરે 1 અઠવાડિયું",other:"આશરે {{count}} અઠવાડિયા"},xWeeks:{one:"1 અઠવાડિયું",other:"{{count}} અઠવાડિયા"},aboutXMonths:{one:"આશરે 1 મહિનો",other:"આશરે {{count}} મહિના"},xMonths:{one:"1 મહિનો",other:"{{count}} મહિના"},aboutXYears:{one:"આશરે 1 વર્ષ",other:"આશરે {{count}} વર્ષ"},xYears:{one:"1 વર્ષ",other:"{{count}} વર્ષ"},overXYears:{one:"1 વર્ષથી વધુ",other:"{{count}} વર્ષથી વધુ"},almostXYears:{one:"લગભગ 1 વર્ષ",other:"લગભગ {{count}} વર્ષ"}},n=function(e,t,n){var i,o=a[e];return i="string"==typeof o?o:1===t?o.one:o.other.replace("{{count}}",String(t)),null!=n&&n.addSuffix?n.comparison&&n.comparison>0?i+"માં":i+" પહેલાં":i};t.default=n,e.exports=t.default},40047:function(e,t,a){var n=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(a(62750)),o={date:(0,i.default)({formats:{full:"EEEE, d MMMM, y",long:"d MMMM, y",medium:"d MMM, y",short:"d/M/yy"},defaultWidth:"full"}),time:(0,i.default)({formats:{full:"hh:mm:ss a zzzz",long:"hh:mm:ss a z",medium:"hh:mm:ss a",short:"hh:mm a"},defaultWidth:"full"}),dateTime:(0,i.default)({formats:{full:"{{date}} {{time}}",long:"{{date}} {{time}}",medium:"{{date}} {{time}}",short:"{{date}} {{time}}"},defaultWidth:"full"})};t.default=o,e.exports=t.default},85110:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={lastWeek:"'પાછલા' eeee p",yesterday:"'ગઈકાલે' p",today:"'આજે' p",tomorrow:"'આવતીકાલે' p",nextWeek:"eeee p",other:"P"},n=function(e,t,n,i){return a[e]};t.default=n,e.exports=t.default},57032:function(e,t,a){var n=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(a(93572)),o={ordinalNumber:function(e,t){return String(e)},era:(0,i.default)({values:{narrow:["ઈસપૂ","ઈસ"],abbreviated:["ઈ.સ.પૂર્વે","ઈ.સ."],wide:["ઈસવીસન પૂર્વે","ઈસવીસન"]},defaultWidth:"wide"}),quarter:(0,i.default)({values:{narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1લો ત્રિમાસ","2જો ત્રિમાસ","3જો ત્રિમાસ","4થો ત્રિમાસ"]},defaultWidth:"wide",argumentCallback:function(e){return e-1}}),month:(0,i.default)({values:{narrow:["જા","ફે","મા","એ","મે","જૂ","જુ","ઓ","સ","ઓ","ન","ડિ"],abbreviated:["જાન્યુ","ફેબ્રુ","માર્ચ","એપ્રિલ","મે","જૂન","જુલાઈ","ઑગસ્ટ","સપ્ટે","ઓક્ટો","નવે","ડિસે"],wide:["જાન્યુઆરી","ફેબ્રુઆરી","માર્ચ","એપ્રિલ","મે","જૂન","જુલાઇ","ઓગસ્ટ","સપ્ટેમ્બર","ઓક્ટોબર","નવેમ્બર","ડિસેમ્બર"]},defaultWidth:"wide"}),day:(0,i.default)({values:{narrow:["ર","સો","મં","બુ","ગુ","શુ","શ"],short:["ર","સો","મં","બુ","ગુ","શુ","શ"],abbreviated:["રવિ","સોમ","મંગળ","બુધ","ગુરુ","શુક્ર","શનિ"],wide:["રવિવાર","સોમવાર","મંગળવાર","બુધવાર","ગુરુવાર","શુક્રવાર","શનિવાર"]},defaultWidth:"wide"}),dayPeriod:(0,i.default)({values:{narrow:{am:"AM",pm:"PM",midnight:"મ.રાત્રિ",noon:"બ.",morning:"સવારે",afternoon:"બપોરે",evening:"સાંજે",night:"રાત્રે"},abbreviated:{am:"AM",pm:"PM",midnight:"​મધ્યરાત્રિ",noon:"બપોરે",morning:"સવારે",afternoon:"બપોરે",evening:"સાંજે",night:"રાત્રે"},wide:{am:"AM",pm:"PM",midnight:"​મધ્યરાત્રિ",noon:"બપોરે",morning:"સવારે",afternoon:"બપોરે",evening:"સાંજે",night:"રાત્રે"}},defaultWidth:"wide",formattingValues:{narrow:{am:"AM",pm:"PM",midnight:"મ.રાત્રિ",noon:"બપોરે",morning:"સવારે",afternoon:"બપોરે",evening:"સાંજે",night:"રાત્રે"},abbreviated:{am:"AM",pm:"PM",midnight:"મધ્યરાત્રિ",noon:"બપોરે",morning:"સવારે",afternoon:"બપોરે",evening:"સાંજે",night:"રાત્રે"},wide:{am:"AM",pm:"PM",midnight:"​મધ્યરાત્રિ",noon:"બપોરે",morning:"સવારે",afternoon:"બપોરે",evening:"સાંજે",night:"રાત્રે"}},defaultFormattingWidth:"wide"})};t.default=o,e.exports=t.default},94940:function(e,t,a){var n=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(a(7998)),o={ordinalNumber:(0,n(a(9254)).default)({matchPattern:/^(\d+)(લ|જ|થ|ઠ્ઠ|મ)?/i,parsePattern:/\d+/i,valueCallback:function(e){return parseInt(e,10)}}),era:(0,i.default)({matchPatterns:{narrow:/^(ઈસપૂ|ઈસ)/i,abbreviated:/^(ઈ\.સ\.પૂર્વે|ઈ\.સ\.)/i,wide:/^(ઈસવીસન\sપૂર્વે|ઈસવીસન)/i},defaultMatchWidth:"wide",parsePatterns:{any:[/^ઈસપૂ/i,/^ઈસ/i]},defaultParseWidth:"any"}),quarter:(0,i.default)({matchPatterns:{narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](લો|જો|થો)? ત્રિમાસ/i},defaultMatchWidth:"wide",parsePatterns:{any:[/1/i,/2/i,/3/i,/4/i]},defaultParseWidth:"any",valueCallback:function(e){return e+1}}),month:(0,i.default)({matchPatterns:{narrow:/^[જાફેમાએમેજૂજુઓસઓનડિ]/i,abbreviated:/^(જાન્યુ|ફેબ્રુ|માર્ચ|એપ્રિલ|મે|જૂન|જુલાઈ|ઑગસ્ટ|સપ્ટે|ઓક્ટો|નવે|ડિસે)/i,wide:/^(જાન્યુઆરી|ફેબ્રુઆરી|માર્ચ|એપ્રિલ|મે|જૂન|જુલાઇ|ઓગસ્ટ|સપ્ટેમ્બર|ઓક્ટોબર|નવેમ્બર|ડિસેમ્બર)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^જા/i,/^ફે/i,/^મા/i,/^એ/i,/^મે/i,/^જૂ/i,/^જુ/i,/^ઑગ/i,/^સ/i,/^ઓક્ટો/i,/^ન/i,/^ડિ/i],any:[/^જા/i,/^ફે/i,/^મા/i,/^એ/i,/^મે/i,/^જૂ/i,/^જુ/i,/^ઑગ/i,/^સ/i,/^ઓક્ટો/i,/^ન/i,/^ડિ/i]},defaultParseWidth:"any"}),day:(0,i.default)({matchPatterns:{narrow:/^(ર|સો|મં|બુ|ગુ|શુ|શ)/i,short:/^(ર|સો|મં|બુ|ગુ|શુ|શ)/i,abbreviated:/^(રવિ|સોમ|મંગળ|બુધ|ગુરુ|શુક્ર|શનિ)/i,wide:/^(રવિવાર|સોમવાર|મંગળવાર|બુધવાર|ગુરુવાર|શુક્રવાર|શનિવાર)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^ર/i,/^સો/i,/^મં/i,/^બુ/i,/^ગુ/i,/^શુ/i,/^શ/i],any:[/^ર/i,/^સો/i,/^મં/i,/^બુ/i,/^ગુ/i,/^શુ/i,/^શ/i]},defaultParseWidth:"any"}),dayPeriod:(0,i.default)({matchPatterns:{narrow:/^(a|p|મ\.?|સ|બ|સાં|રા)/i,any:/^(a|p|મ\.?|સ|બ|સાં|રા)/i},defaultMatchWidth:"any",parsePatterns:{any:{am:/^a/i,pm:/^p/i,midnight:/^મ\.?/i,noon:/^બ/i,morning:/સ/i,afternoon:/બ/i,evening:/સાં/i,night:/રા/i}},defaultParseWidth:"any"})};t.default=o,e.exports=t.default},35696:function(e,t,a){var n=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(a(53278)),o=n(a(40047)),r=n(a(85110)),d=n(a(57032)),u=n(a(94940)),l={code:"gu",formatDistance:i.default,formatLong:o.default,formatRelative:r.default,localize:d.default,match:u.default,options:{weekStartsOn:1,firstWeekContainsDate:4}};t.default=l,e.exports=t.default}}]);