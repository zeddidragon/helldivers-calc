function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)(s=pug_classes(r[g]))&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (cats, cellClass, header, value, weapons) {pug_html = pug_html + "\u003Chtml\u003E\u003Chead\u003E\u003Cmeta charset=\"UTF-8\"\u002F\u003E\u003Ctitle\u003EHelldivers\u003C\u002Ftitle\u003E\u003Cmeta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"\u002F\u003E\u003Clink href=\"style.css\" rel=\"stylesheet\"\u002F\u003E\u003C\u002Fhead\u003E\u003Cbody\u003E\u003Ctable\u003E\u003Cthead\u003E\u003Ctr\u003E";
// iterate cats
;(function(){
  var $$obj = cats;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var cat = $$obj[pug_index0];
pug_html = pug_html + "\u003Cth" + (pug_attr("class", pug_classes([cat], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = header(cat)) ? "" : pug_interp)) + "\u003C\u002Fth\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var cat = $$obj[pug_index0];
pug_html = pug_html + "\u003Cth" + (pug_attr("class", pug_classes([cat], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = header(cat)) ? "" : pug_interp)) + "\u003C\u002Fth\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E";
// iterate weapons
;(function(){
  var $$obj = weapons;
  if ('number' == typeof $$obj.length) {
      for (var pug_index1 = 0, $$l = $$obj.length; pug_index1 < $$l; pug_index1++) {
        var wpn = $$obj[pug_index1];
pug_html = pug_html + "\u003Ctr\u003E";
// iterate cats
;(function(){
  var $$obj = cats;
  if ('number' == typeof $$obj.length) {
      for (var pug_index2 = 0, $$l = $$obj.length; pug_index2 < $$l; pug_index2++) {
        var cat = $$obj[pug_index2];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([cellClass(cat, wpn)], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = value(cat, wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index2 in $$obj) {
      $$l++;
      var cat = $$obj[pug_index2];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([cellClass(cat, wpn)], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = value(cat, wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index1 in $$obj) {
      $$l++;
      var wpn = $$obj[pug_index1];
pug_html = pug_html + "\u003Ctr\u003E";
// iterate cats
;(function(){
  var $$obj = cats;
  if ('number' == typeof $$obj.length) {
      for (var pug_index3 = 0, $$l = $$obj.length; pug_index3 < $$l; pug_index3++) {
        var cat = $$obj[pug_index3];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([cellClass(cat, wpn)], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = value(cat, wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index3 in $$obj) {
      $$l++;
      var cat = $$obj[pug_index3];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([cellClass(cat, wpn)], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = value(cat, wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cul\u003E\u003Cli\u003EReload is measured from when reticle disappears to when it comes back. Not all weapons had a reticle. Timing may be off by up to 0.1s.\u003C\u002Fli\u003E\u003Cli\u003ESpare is in the format (Starting mags) \u002F (Max mags)\u003C\u002Fli\u003E\u003Cli\u003EPickup is in the format (Supply box) \u002F (Ammo box)\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fbody\u003E\u003C\u002Fhtml\u003E";}.call(this,"cats" in locals_for_with?locals_for_with.cats:typeof cats!=="undefined"?cats:undefined,"cellClass" in locals_for_with?locals_for_with.cellClass:typeof cellClass!=="undefined"?cellClass:undefined,"header" in locals_for_with?locals_for_with.header:typeof header!=="undefined"?header:undefined,"value" in locals_for_with?locals_for_with.value:typeof value!=="undefined"?value:undefined,"weapons" in locals_for_with?locals_for_with.weapons:typeof weapons!=="undefined"?weapons:undefined));;return pug_html;}