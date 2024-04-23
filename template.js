function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)(s=pug_classes(r[g]))&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (catClass, categoryFull, cats, dps, header, magDmg, sorted, sourceFull, sourceLabels, totalDmg, weapons) {pug_html = pug_html + "\u003Ctable\u003E\u003Cthead\u003E\u003Ctr\u003E";
// iterate cats
;(function(){
  var $$obj = cats;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var cat = $$obj[pug_index0];
pug_html = pug_html + "\u003Cth" + (pug_attr("class", pug_classes([catClass(cat)], [true]), false, false)+pug_attr("onclick", `sortBy('${cat}')`, true, false)) + "\u003E\u003Cspan class=\"sorter\"\u003E▼\u003C\u002Fspan\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = header(cat)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fth\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var cat = $$obj[pug_index0];
pug_html = pug_html + "\u003Cth" + (pug_attr("class", pug_classes([catClass(cat)], [true]), false, false)+pug_attr("onclick", `sortBy('${cat}')`, true, false)) + "\u003E\u003Cspan class=\"sorter\"\u003E▼\u003C\u002Fspan\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = header(cat)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fth\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E";
// iterate sorted(weapons)
;(function(){
  var $$obj = sorted(weapons);
  if ('number' == typeof $$obj.length) {
      for (var pug_index1 = 0, $$l = $$obj.length; pug_index1 < $$l; pug_index1++) {
        var wpn = $$obj[pug_index1];
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd" + (" class=\"source\""+pug_attr("title", sourceFull(wpn), true, false)) + "\u003E\u003Cspan" + (pug_attr("class", pug_classes([wpn.source,"source-main"], [true,false]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = sourceLabels[wpn.source]) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.sourcepage) {
pug_html = pug_html + "\u003Cspan class=\"source-page\"\u003E" + (pug_escape(null == (pug_interp = wpn.sourcepage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd" + (pug_attr("class", pug_classes([wpn.category,"category"], [true,false]), false, false)+pug_attr("title", categoryFull(wpn), true, false)) + "\u003E" + (pug_escape(null == (pug_interp = wpn.category) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"code\"\u003E" + (pug_escape(null == (pug_interp = wpn.code) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"name\"\u003E" + (pug_escape(null == (pug_interp = wpn.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"damage\"\u003E\u003Cspan class=\"damage-main\" title=\"Direct Hit\"\u003E" + (pug_escape(null == (pug_interp = wpn.damage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xdamage) {
pug_html = pug_html + "\u003Cspan class=\"damage-x\" title=\"Explosion\"\u003E" + (pug_escape(null == (pug_interp = wpn.xdamage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"ap\"\u003E\u003Cspan" + (pug_attr("class", pug_classes([`ap-${wpn.ap}`], [true]), false, false)+" title=\"Direct Hit\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.ap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xap) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes([`ap-${wpn.xap}`,"ap-x"], [true,false]), false, false)+" title=\"Explosion\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.xap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"recoil\"\u003E" + (pug_escape(null == (pug_interp = wpn.recoil) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"rpm\"\u003E";
if (wpn.charge) {
pug_html = pug_html + "\u003Cspan class=\"rpm-charge\" title=\"Charge time\"\u003E\u003Csup class=\"one-over\"\u003E1\u002F\u003C\u002Fsup\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = wpn.charge) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
else {
pug_html = pug_html + "\u003Cspan class=\"rpm-main\"\u003E" + (pug_escape(null == (pug_interp = wpn.rpm) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"dps\"\u003E" + (pug_escape(null == (pug_interp = dps(wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"reload\"\u003E";
if (wpn.reloadone) {
pug_html = pug_html + "\u003Cspan class=\"reload-one\" title=\"Reload 1 round\"\u003E" + (pug_escape(null == (pug_interp = wpn.reloadone.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reload) {
pug_html = pug_html + "\u003Cspan class=\"reload-main\" title=\"Reload from empty\"\u003E" + (pug_escape(null == (pug_interp = wpn.reload.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reloadearly) {
pug_html = pug_html + "\u003Cspan class=\"reload-early\" title=\"Early Reload (not empty)\"\u003E" + (pug_escape(null == (pug_interp = wpn.reloadearly.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"cap\"\u003E";
if (wpn.limit) {
pug_html = pug_html + "\u003Cspan class=\"cap-limit\"\u003E" + (pug_escape(null == (pug_interp = wpn.limit) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
else
if (wpn.cap) {
pug_html = pug_html + "\u003Cspan class=\"cap-rounds\"\u003E" + (pug_escape(null == (pug_interp = wpn.cap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"spare\"\u003E";
if (wpn.clips) {
pug_html = pug_html + "\u003Cspan class=\"clipsize\" title=\"Rounds in Clip\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipsize) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clipstart\" title=\"Starting Clips\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipstart) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clips\" title=\"Max Clips\"\u003E" + (pug_escape(null == (pug_interp = wpn.clips) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.rounds) {
pug_html = pug_html + "\u003Cspan class=\"roundstart\" title=\"Starting Rounds\"\u003E" + (pug_escape(null == (pug_interp = wpn.roundstart) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"rounds\" title=\"Max Spare Rounds\"\u003E" + (pug_escape(null == (pug_interp = wpn.rounds) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.mags) {
pug_html = pug_html + "\u003Cspan class=\"magstart\" title=\"Starting Mags\"\u003E" + (pug_escape(null == (pug_interp = wpn.magstart || wpn.mags) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"mags\" title=\"Max Mags\"\u003E" + (pug_escape(null == (pug_interp = wpn.mags) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"pickup\"\u003E";
if (wpn.clipsupply) {
pug_html = pug_html + "\u003Cspan class=\"clipsupply\" title=\"Clips From Supply\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipsupply) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clipbox\" title=\"Clips From Box\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipbox) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.roundsupply) {
pug_html = pug_html + "\u003Cspan class=\"roundsupply\" title=\"Rounds From Supply\"\u003E" + (pug_escape(null == (pug_interp = wpn.roundsupply) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"roundsbox\" title=\"Rounds From Box\"\u003E" + (pug_escape(null == (pug_interp = wpn.roundsbox) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.supply) {
pug_html = pug_html + "\u003Cspan class=\"supply\" title=\"Rounds From Supply\"\u003E" + (pug_escape(null == (pug_interp = wpn.supply) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"box\" title=\"Rounds From Box\"\u003E" + (pug_escape(null == (pug_interp = wpn.box) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"magdmg\" title=\"Damage From Magdump\"\u003E" + (pug_escape(null == (pug_interp = magDmg(wpn) || '') ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"total\" title=\"Damage From All Ammo Expended\"\u003E" + (pug_escape(null == (pug_interp = totalDmg(wpn) || '') ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index1 in $$obj) {
      $$l++;
      var wpn = $$obj[pug_index1];
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd" + (" class=\"source\""+pug_attr("title", sourceFull(wpn), true, false)) + "\u003E\u003Cspan" + (pug_attr("class", pug_classes([wpn.source,"source-main"], [true,false]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = sourceLabels[wpn.source]) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.sourcepage) {
pug_html = pug_html + "\u003Cspan class=\"source-page\"\u003E" + (pug_escape(null == (pug_interp = wpn.sourcepage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd" + (pug_attr("class", pug_classes([wpn.category,"category"], [true,false]), false, false)+pug_attr("title", categoryFull(wpn), true, false)) + "\u003E" + (pug_escape(null == (pug_interp = wpn.category) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"code\"\u003E" + (pug_escape(null == (pug_interp = wpn.code) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"name\"\u003E" + (pug_escape(null == (pug_interp = wpn.name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"damage\"\u003E\u003Cspan class=\"damage-main\" title=\"Direct Hit\"\u003E" + (pug_escape(null == (pug_interp = wpn.damage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xdamage) {
pug_html = pug_html + "\u003Cspan class=\"damage-x\" title=\"Explosion\"\u003E" + (pug_escape(null == (pug_interp = wpn.xdamage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"ap\"\u003E\u003Cspan" + (pug_attr("class", pug_classes([`ap-${wpn.ap}`], [true]), false, false)+" title=\"Direct Hit\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.ap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xap) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes([`ap-${wpn.xap}`,"ap-x"], [true,false]), false, false)+" title=\"Explosion\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.xap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"recoil\"\u003E" + (pug_escape(null == (pug_interp = wpn.recoil) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"rpm\"\u003E";
if (wpn.charge) {
pug_html = pug_html + "\u003Cspan class=\"rpm-charge\" title=\"Charge time\"\u003E\u003Csup class=\"one-over\"\u003E1\u002F\u003C\u002Fsup\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = wpn.charge) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
else {
pug_html = pug_html + "\u003Cspan class=\"rpm-main\"\u003E" + (pug_escape(null == (pug_interp = wpn.rpm) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"dps\"\u003E" + (pug_escape(null == (pug_interp = dps(wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"reload\"\u003E";
if (wpn.reloadone) {
pug_html = pug_html + "\u003Cspan class=\"reload-one\" title=\"Reload 1 round\"\u003E" + (pug_escape(null == (pug_interp = wpn.reloadone.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reload) {
pug_html = pug_html + "\u003Cspan class=\"reload-main\" title=\"Reload from empty\"\u003E" + (pug_escape(null == (pug_interp = wpn.reload.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reloadearly) {
pug_html = pug_html + "\u003Cspan class=\"reload-early\" title=\"Early Reload (not empty)\"\u003E" + (pug_escape(null == (pug_interp = wpn.reloadearly.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"cap\"\u003E";
if (wpn.limit) {
pug_html = pug_html + "\u003Cspan class=\"cap-limit\"\u003E" + (pug_escape(null == (pug_interp = wpn.limit) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
else
if (wpn.cap) {
pug_html = pug_html + "\u003Cspan class=\"cap-rounds\"\u003E" + (pug_escape(null == (pug_interp = wpn.cap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"spare\"\u003E";
if (wpn.clips) {
pug_html = pug_html + "\u003Cspan class=\"clipsize\" title=\"Rounds in Clip\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipsize) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clipstart\" title=\"Starting Clips\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipstart) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clips\" title=\"Max Clips\"\u003E" + (pug_escape(null == (pug_interp = wpn.clips) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.rounds) {
pug_html = pug_html + "\u003Cspan class=\"roundstart\" title=\"Starting Rounds\"\u003E" + (pug_escape(null == (pug_interp = wpn.roundstart) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"rounds\" title=\"Max Spare Rounds\"\u003E" + (pug_escape(null == (pug_interp = wpn.rounds) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.mags) {
pug_html = pug_html + "\u003Cspan class=\"magstart\" title=\"Starting Mags\"\u003E" + (pug_escape(null == (pug_interp = wpn.magstart || wpn.mags) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"mags\" title=\"Max Mags\"\u003E" + (pug_escape(null == (pug_interp = wpn.mags) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"pickup\"\u003E";
if (wpn.clipsupply) {
pug_html = pug_html + "\u003Cspan class=\"clipsupply\" title=\"Clips From Supply\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipsupply) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clipbox\" title=\"Clips From Box\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipbox) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.roundsupply) {
pug_html = pug_html + "\u003Cspan class=\"roundsupply\" title=\"Rounds From Supply\"\u003E" + (pug_escape(null == (pug_interp = wpn.roundsupply) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"roundsbox\" title=\"Rounds From Box\"\u003E" + (pug_escape(null == (pug_interp = wpn.roundsbox) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.supply) {
pug_html = pug_html + "\u003Cspan class=\"supply\" title=\"Rounds From Supply\"\u003E" + (pug_escape(null == (pug_interp = wpn.supply) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"box\" title=\"Rounds From Box\"\u003E" + (pug_escape(null == (pug_interp = wpn.box) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"magdmg\" title=\"Damage From Magdump\"\u003E" + (pug_escape(null == (pug_interp = magDmg(wpn) || '') ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"total\" title=\"Damage From All Ammo Expended\"\u003E" + (pug_escape(null == (pug_interp = totalDmg(wpn) || '') ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cul\u003E\u003Cli\u003EReload is measured from when reticle disappears to when it comes back. Not all weapons had a reticle. Timing may be off by up to 0.1s.\u003C\u002Fli\u003E\u003Cli\u003ESpare is in the format (Starting mags) \u002F (Max mags)\u003C\u002Fli\u003E\u003Cli\u003EPickup is in the format (Supply box) \u002F (Ammo box)\u003C\u002Fli\u003E\u003C\u002Ful\u003E";}.call(this,"catClass" in locals_for_with?locals_for_with.catClass:typeof catClass!=="undefined"?catClass:undefined,"categoryFull" in locals_for_with?locals_for_with.categoryFull:typeof categoryFull!=="undefined"?categoryFull:undefined,"cats" in locals_for_with?locals_for_with.cats:typeof cats!=="undefined"?cats:undefined,"dps" in locals_for_with?locals_for_with.dps:typeof dps!=="undefined"?dps:undefined,"header" in locals_for_with?locals_for_with.header:typeof header!=="undefined"?header:undefined,"magDmg" in locals_for_with?locals_for_with.magDmg:typeof magDmg!=="undefined"?magDmg:undefined,"sorted" in locals_for_with?locals_for_with.sorted:typeof sorted!=="undefined"?sorted:undefined,"sourceFull" in locals_for_with?locals_for_with.sourceFull:typeof sourceFull!=="undefined"?sourceFull:undefined,"sourceLabels" in locals_for_with?locals_for_with.sourceLabels:typeof sourceLabels!=="undefined"?sourceLabels:undefined,"totalDmg" in locals_for_with?locals_for_with.totalDmg:typeof totalDmg!=="undefined"?totalDmg:undefined,"weapons" in locals_for_with?locals_for_with.weapons:typeof weapons!=="undefined"?weapons:undefined));;return pug_html;}