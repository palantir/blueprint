"use strict";(self.webpackChunk_blueprintjs_docs_app=self.webpackChunk_blueprintjs_docs_app||[]).push([[66936,44388,70481,87860,17819,8314],{73003:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={lessThanXSeconds:{one:"פחות משנייה",two:"פחות משתי שניות",other:"פחות מ־{{count}} שניות"},xSeconds:{one:"שנייה",two:"שתי שניות",other:"{{count}} שניות"},halfAMinute:"חצי דקה",lessThanXMinutes:{one:"פחות מדקה",two:"פחות משתי דקות",other:"פחות מ־{{count}} דקות"},xMinutes:{one:"דקה",two:"שתי דקות",other:"{{count}} דקות"},aboutXHours:{one:"כשעה",two:"כשעתיים",other:"כ־{{count}} שעות"},xHours:{one:"שעה",two:"שעתיים",other:"{{count}} שעות"},xDays:{one:"יום",two:"יומיים",other:"{{count}} ימים"},aboutXWeeks:{one:"כשבוע",two:"כשבועיים",other:"כ־{{count}} שבועות"},xWeeks:{one:"שבוע",two:"שבועיים",other:"{{count}} שבועות"},aboutXMonths:{one:"כחודש",two:"כחודשיים",other:"כ־{{count}} חודשים"},xMonths:{one:"חודש",two:"חודשיים",other:"{{count}} חודשים"},aboutXYears:{one:"כשנה",two:"כשנתיים",other:"כ־{{count}} שנים"},xYears:{one:"שנה",two:"שנתיים",other:"{{count}} שנים"},overXYears:{one:"יותר משנה",two:"יותר משנתיים",other:"יותר מ־{{count}} שנים"},almostXYears:{one:"כמעט שנה",two:"כמעט שנתיים",other:"כמעט {{count}} שנים"}},i=function(e,t,i){if("xDays"===e&&null!=i&&i.addSuffix&&t<=2)return i.comparison&&i.comparison>0?1===t?"מחר":"מחרתיים":1===t?"אתמול":"שלשום";var n,o=a[e];return n="string"==typeof o?o:1===t?o.one:2===t?o.two:o.other.replace("{{count}}",String(t)),null!=i&&i.addSuffix?i.comparison&&i.comparison>0?"בעוד "+n:"לפני "+n:n};t.default=i,e.exports=t.default},56729:function(e,t,a){var i=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=i(a(62750)),o={date:(0,n.default)({formats:{full:"EEEE, d בMMMM y",long:"d בMMMM y",medium:"d בMMM y",short:"d.M.y"},defaultWidth:"full"}),time:(0,n.default)({formats:{full:"H:mm:ss zzzz",long:"H:mm:ss z",medium:"H:mm:ss",short:"H:mm"},defaultWidth:"full"}),dateTime:(0,n.default)({formats:{full:"{{date}} 'בשעה' {{time}}",long:"{{date}} 'בשעה' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},defaultWidth:"full"})};t.default=o,e.exports=t.default},392:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={lastWeek:"eeee 'שעבר בשעה' p",yesterday:"'אתמול בשעה' p",today:"'היום בשעה' p",tomorrow:"'מחר בשעה' p",nextWeek:"eeee 'בשעה' p",other:"P"},i=function(e,t,i,n){return a[e]};t.default=i,e.exports=t.default},23287:function(e,t,a){var i=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=i(a(93572)),o={ordinalNumber:function(e,t){var a=Number(e);if(a<=0||a>10)return String(a);var i=String(null==t?void 0:t.unit),n=a-1;return["year","hour","minute","second"].indexOf(i)>=0?["ראשונה","שנייה","שלישית","רביעית","חמישית","שישית","שביעית","שמינית","תשיעית","עשירית"][n]:["ראשון","שני","שלישי","רביעי","חמישי","שישי","שביעי","שמיני","תשיעי","עשירי"][n]},era:(0,n.default)({values:{narrow:["לפנה״ס","לספירה"],abbreviated:["לפנה״ס","לספירה"],wide:["לפני הספירה","לספירה"]},defaultWidth:"wide"}),quarter:(0,n.default)({values:{narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["רבעון 1","רבעון 2","רבעון 3","רבעון 4"]},defaultWidth:"wide",argumentCallback:function(e){return e-1}}),month:(0,n.default)({values:{narrow:["1","2","3","4","5","6","7","8","9","10","11","12"],abbreviated:["ינו׳","פבר׳","מרץ","אפר׳","מאי","יוני","יולי","אוג׳","ספט׳","אוק׳","נוב׳","דצמ׳"],wide:["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"]},defaultWidth:"wide"}),day:(0,n.default)({values:{narrow:["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"],short:["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"],abbreviated:["יום א׳","יום ב׳","יום ג׳","יום ד׳","יום ה׳","יום ו׳","שבת"],wide:["יום ראשון","יום שני","יום שלישי","יום רביעי","יום חמישי","יום שישי","יום שבת"]},defaultWidth:"wide"}),dayPeriod:(0,n.default)({values:{narrow:{am:"לפנה״צ",pm:"אחה״צ",midnight:"חצות",noon:"צהריים",morning:"בוקר",afternoon:"אחר הצהריים",evening:"ערב",night:"לילה"},abbreviated:{am:"לפנה״צ",pm:"אחה״צ",midnight:"חצות",noon:"צהריים",morning:"בוקר",afternoon:"אחר הצהריים",evening:"ערב",night:"לילה"},wide:{am:"לפנה״צ",pm:"אחה״צ",midnight:"חצות",noon:"צהריים",morning:"בוקר",afternoon:"אחר הצהריים",evening:"ערב",night:"לילה"}},defaultWidth:"wide",formattingValues:{narrow:{am:"לפנה״צ",pm:"אחה״צ",midnight:"חצות",noon:"צהריים",morning:"בבוקר",afternoon:"בצהריים",evening:"בערב",night:"בלילה"},abbreviated:{am:"לפנה״צ",pm:"אחה״צ",midnight:"חצות",noon:"צהריים",morning:"בבוקר",afternoon:"אחר הצהריים",evening:"בערב",night:"בלילה"},wide:{am:"לפנה״צ",pm:"אחה״צ",midnight:"חצות",noon:"צהריים",morning:"בבוקר",afternoon:"אחר הצהריים",evening:"בערב",night:"בלילה"}},defaultFormattingWidth:"wide"})};t.default=o,e.exports=t.default},74881:function(e,t,a){var i=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=i(a(7998)),o=i(a(9254)),r=["רא","שנ","של","רב","ח","שי","שב","שמ","ת","ע"],d={ordinalNumber:(0,o.default)({matchPattern:/^(\d+|(ראשון|שני|שלישי|רביעי|חמישי|שישי|שביעי|שמיני|תשיעי|עשירי|ראשונה|שנייה|שלישית|רביעית|חמישית|שישית|שביעית|שמינית|תשיעית|עשירית))/i,parsePattern:/^(\d+|רא|שנ|של|רב|ח|שי|שב|שמ|ת|ע)/i,valueCallback:function(e){var t=parseInt(e,10);return isNaN(t)?r.indexOf(e)+1:t}}),era:(0,n.default)({matchPatterns:{narrow:/^ל(ספירה|פנה״ס)/i,abbreviated:/^ל(ספירה|פנה״ס)/i,wide:/^ל(פני ה)?ספירה/i},defaultMatchWidth:"wide",parsePatterns:{any:[/^לפ/i,/^לס/i]},defaultParseWidth:"any"}),quarter:(0,n.default)({matchPatterns:{narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^רבעון [1234]/i},defaultMatchWidth:"wide",parsePatterns:{any:[/1/i,/2/i,/3/i,/4/i]},defaultParseWidth:"any",valueCallback:function(e){return e+1}}),month:(0,n.default)({matchPatterns:{narrow:/^\d+/i,abbreviated:/^(ינו|פבר|מרץ|אפר|מאי|יוני|יולי|אוג|ספט|אוק|נוב|דצמ)׳?/i,wide:/^(ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^1$/i,/^2/i,/^3/i,/^4/i,/^5/i,/^6/i,/^7/i,/^8/i,/^9/i,/^10/i,/^11/i,/^12/i],any:[/^ינ/i,/^פ/i,/^מר/i,/^אפ/i,/^מא/i,/^יונ/i,/^יול/i,/^אוג/i,/^ס/i,/^אוק/i,/^נ/i,/^ד/i]},defaultParseWidth:"any"}),day:(0,n.default)({matchPatterns:{narrow:/^[אבגדהוש]׳/i,short:/^[אבגדהוש]׳/i,abbreviated:/^(שבת|יום (א|ב|ג|ד|ה|ו)׳)/i,wide:/^יום (ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת)/i},defaultMatchWidth:"wide",parsePatterns:{abbreviated:[/א׳$/i,/ב׳$/i,/ג׳$/i,/ד׳$/i,/ה׳$/i,/ו׳$/i,/^ש/i],wide:[/ן$/i,/ני$/i,/לישי$/i,/עי$/i,/מישי$/i,/שישי$/i,/ת$/i],any:[/^א/i,/^ב/i,/^ג/i,/^ד/i,/^ה/i,/^ו/i,/^ש/i]},defaultParseWidth:"any"}),dayPeriod:(0,n.default)({matchPatterns:{any:/^(אחר ה|ב)?(חצות|צהריים|בוקר|ערב|לילה|אחה״צ|לפנה״צ)/i},defaultMatchWidth:"any",parsePatterns:{any:{am:/^לפ/i,pm:/^אחה/i,midnight:/^ח/i,noon:/^צ/i,morning:/בוקר/i,afternoon:/בצ|אחר/i,evening:/ערב/i,night:/לילה/i}},defaultParseWidth:"any"})};t.default=d,e.exports=t.default},23510:function(e,t,a){var i=a(57739).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=i(a(73003)),o=i(a(56729)),r=i(a(392)),d=i(a(23287)),u=i(a(74881)),l={code:"he",formatDistance:n.default,formatLong:o.default,formatRelative:r.default,localize:d.default,match:u.default,options:{weekStartsOn:0,firstWeekContainsDate:1}};t.default=l,e.exports=t.default}}]);