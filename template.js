function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)(s=pug_classes(r[g]))&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (catClass, categoryFull, cats, colClass, colSpan, cols, dmgType, dmgTypeClass, dmgTypeText, dps, effectDescription, effectName, effectParams, effectValue, getWeapons, hasTag, header, magDmg, nerdMode, nerdValue, roundStart, sourceClass, sourceFull, sourceLabels, sourceOrder, tdps, totalDmg, wikiLink) {pug_html = pug_html + "\u003Cheader class=\"menu\"\u003E\u003Cdiv class=\"filters\"\u003E\u003Cul class=\"sources\"\u003E";
// iterate sourceOrder
;(function(){
  var $$obj = sourceOrder;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var source = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli" + (pug_attr("class", pug_classes(["source",sourceClass(source)], [false,true]), false, false)+pug_attr("title", sourceFull(source), true, false)+pug_attr("onclick", `toggleSource('${source}')`, true, false)) + "\u003E" + (pug_escape(null == (pug_interp = sourceLabels[source]) ? "" : pug_interp)) + "\u003C\u002Fli\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var source = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli" + (pug_attr("class", pug_classes(["source",sourceClass(source)], [false,true]), false, false)+pug_attr("title", sourceFull(source), true, false)+pug_attr("onclick", `toggleSource('${source}')`, true, false)) + "\u003E" + (pug_escape(null == (pug_interp = sourceLabels[source]) ? "" : pug_interp)) + "\u003C\u002Fli\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ful\u003E\u003Cul class=\"categories\"\u003E";
// iterate cats
;(function(){
  var $$obj = cats;
  if ('number' == typeof $$obj.length) {
      for (var pug_index1 = 0, $$l = $$obj.length; pug_index1 < $$l; pug_index1++) {
        var cat = $$obj[pug_index1];
pug_html = pug_html + "\u003Cli" + (pug_attr("class", pug_classes(["category",catClass(cat)], [false,true]), false, false)+pug_attr("title", categoryFull(cat), true, false)+pug_attr("onclick", `toggleCategory('${cat}')`, true, false)) + "\u003E" + (pug_escape(null == (pug_interp = cat) ? "" : pug_interp)) + "\u003C\u002Fli\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index1 in $$obj) {
      $$l++;
      var cat = $$obj[pug_index1];
pug_html = pug_html + "\u003Cli" + (pug_attr("class", pug_classes(["category",catClass(cat)], [false,true]), false, false)+pug_attr("title", categoryFull(cat), true, false)+pug_attr("onclick", `toggleCategory('${cat}')`, true, false)) + "\u003E" + (pug_escape(null == (pug_interp = cat) ? "" : pug_interp)) + "\u003C\u002Fli\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"side-menu\"\u003E\u003Clabel\u003E\u003Cinput" + (" id=\"nerd-mode\" type=\"checkbox\""+pug_attr("checked", nerdMode, true, false)+" onclick=\"toggleNerdMode()\"") + "\u002F\u003E";
if (nerdMode) {
pug_html = pug_html + "🤓";
}
else {
pug_html = pug_html + "Nerd Mode";
}
pug_html = pug_html + "\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fheader\u003E\u003Ctable\u003E\u003Cthead\u003E\u003Ctr\u003E";
// iterate cols()
;(function(){
  var $$obj = cols();
  if ('number' == typeof $$obj.length) {
      for (var pug_index2 = 0, $$l = $$obj.length; pug_index2 < $$l; pug_index2++) {
        var col = $$obj[pug_index2];
pug_html = pug_html + "\u003Cth" + (pug_attr("class", pug_classes([colClass(col)], [true]), false, false)+pug_attr("colspan", colSpan(col), true, false)+pug_attr("onclick", `sortBy('${col}')`, true, false)) + "\u003E\u003Cspan class=\"sorter\"\u003E▼\u003C\u002Fspan\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = header(col)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fth\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index2 in $$obj) {
      $$l++;
      var col = $$obj[pug_index2];
pug_html = pug_html + "\u003Cth" + (pug_attr("class", pug_classes([colClass(col)], [true]), false, false)+pug_attr("colspan", colSpan(col), true, false)+pug_attr("onclick", `sortBy('${col}')`, true, false)) + "\u003E\u003Cspan class=\"sorter\"\u003E▼\u003C\u002Fspan\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = header(col)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fth\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E";
if (nerdMode) {
pug_html = pug_html + "\u003Ctbody\u003E";
// iterate getWeapons()
;(function(){
  var $$obj = getWeapons();
  if ('number' == typeof $$obj.length) {
      for (var pug_index3 = 0, $$l = $$obj.length; pug_index3 < $$l; pug_index3++) {
        var wpn = $$obj[pug_index3];
pug_html = pug_html + "\u003Ctr class=\"nerd-row\"\u003E";
// iterate cols()
;(function(){
  var $$obj = cols();
  if ('number' == typeof $$obj.length) {
      for (var pug_index4 = 0, $$l = $$obj.length; pug_index4 < $$l; pug_index4++) {
        var col = $$obj[pug_index4];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([col], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = nerdValue(col, wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index4 in $$obj) {
      $$l++;
      var col = $$obj[pug_index4];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([col], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = nerdValue(col, wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E";
if (wpn.xdamage) {
pug_html = pug_html + "\u003Ctr class=\"x-nerd-row\"\u003E";
// iterate cols()
;(function(){
  var $$obj = cols();
  if ('number' == typeof $$obj.length) {
      for (var pug_index5 = 0, $$l = $$obj.length; pug_index5 < $$l; pug_index5++) {
        var col = $$obj[pug_index5];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([`x-${col}`], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = nerdValue(col, wpn, 'x')) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index5 in $$obj) {
      $$l++;
      var col = $$obj[pug_index5];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([`x-${col}`], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = nerdValue(col, wpn, 'x')) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index3 in $$obj) {
      $$l++;
      var wpn = $$obj[pug_index3];
pug_html = pug_html + "\u003Ctr class=\"nerd-row\"\u003E";
// iterate cols()
;(function(){
  var $$obj = cols();
  if ('number' == typeof $$obj.length) {
      for (var pug_index6 = 0, $$l = $$obj.length; pug_index6 < $$l; pug_index6++) {
        var col = $$obj[pug_index6];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([col], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = nerdValue(col, wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index6 in $$obj) {
      $$l++;
      var col = $$obj[pug_index6];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([col], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = nerdValue(col, wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E";
if (wpn.xdamage) {
pug_html = pug_html + "\u003Ctr class=\"x-nerd-row\"\u003E";
// iterate cols()
;(function(){
  var $$obj = cols();
  if ('number' == typeof $$obj.length) {
      for (var pug_index7 = 0, $$l = $$obj.length; pug_index7 < $$l; pug_index7++) {
        var col = $$obj[pug_index7];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([`x-${col}`], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = nerdValue(col, wpn, 'x')) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index7 in $$obj) {
      $$l++;
      var col = $$obj[pug_index7];
pug_html = pug_html + "\u003Ctd" + (pug_attr("class", pug_classes([`x-${col}`], [true]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = nerdValue(col, wpn, 'x')) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftr\u003E";
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftbody\u003E";
}
else {
pug_html = pug_html + "\u003Ctbody\u003E";
// iterate getWeapons()
;(function(){
  var $$obj = getWeapons();
  if ('number' == typeof $$obj.length) {
      for (var pug_index8 = 0, $$l = $$obj.length; pug_index8 < $$l; pug_index8++) {
        var wpn = $$obj[pug_index8];
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd" + (" class=\"source\""+pug_attr("title", sourceFull(wpn), true, false)) + "\u003E\u003Cspan" + (pug_attr("class", pug_classes([wpn.source,"source-main","source"], [true,false,false]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = sourceLabels[wpn.source]) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.sourcepage) {
pug_html = pug_html + "\u003Cspan class=\"source-page\"\u003E" + (pug_escape(null == (pug_interp = wpn.sourcepage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd" + (pug_attr("class", pug_classes([wpn.category,"category"], [true,false]), false, false)+pug_attr("title", categoryFull(wpn), true, false)) + "\u003E" + (pug_escape(null == (pug_interp = wpn.category) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"code\"\u003E\u003Ca" + (pug_attr("href", wikiLink(wpn), true, false)+" target=\"_blank\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.code) ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"name\"\u003E\u003Ca" + (pug_attr("href", wikiLink(wpn), true, false)+" target=\"_blank\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.name) ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"damage\"\u003E";
if (wpn.dmgtype) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["damage-type",dmgTypeClass(wpn)], [false,true]), false, false)+pug_attr("title", dmgTypeText(wpn), true, false)) + "\u003E" + (pug_escape(null == (pug_interp = dmgType(wpn)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.pellets) {
pug_html = pug_html + "\u003Cspan class=\"pellets\" title=\"Projectiles\"\u003E" + (pug_escape(null == (pug_interp = wpn.pellets) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003Cspan class=\"damage-main\" title=\"Direct Hit\"\u003E" + (pug_escape(null == (pug_interp = wpn.damage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"durable\" title=\"Direct Hit (vs Massive)\"\u003E" + (pug_escape(null == (pug_interp = wpn.durable) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"ap\"\u003E\u003Cspan" + (pug_attr("class", pug_classes([`ap-${wpn.ap}`], [true]), false, false)+" title=\"Direct Hit\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.ap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"effect\"\u003E";
if (wpn.xdamage) {
pug_html = pug_html + "\u003Cspan class=\"damage-x\" title=\"Explosion\"\u003E" + (pug_escape(null == (pug_interp = wpn.xdamage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
// iterate effectParams
;(function(){
  var $$obj = effectParams;
  if ('number' == typeof $$obj.length) {
      for (var pug_index9 = 0, $$l = $$obj.length; pug_index9 < $$l; pug_index9++) {
        var p = $$obj[pug_index9];
if (wpn[p.prop]) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["effect-main",p.prop], [false,true]), false, false)+pug_attr("title", effectDescription(wpn, p), true, false)) + "\u003E\u003Cspan class=\"effect-name\"\u003E" + (pug_escape(null == (pug_interp = effectName(wpn, p)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"effect-value\"\u003E" + (pug_escape(null == (pug_interp = effectValue(wpn, p)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index9 in $$obj) {
      $$l++;
      var p = $$obj[pug_index9];
if (wpn[p.prop]) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["effect-main",p.prop], [false,true]), false, false)+pug_attr("title", effectDescription(wpn, p), true, false)) + "\u003E\u003Cspan class=\"effect-name\"\u003E" + (pug_escape(null == (pug_interp = effectName(wpn, p)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"effect-value\"\u003E" + (pug_escape(null == (pug_interp = effectValue(wpn, p)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"xap\"\u003E";
if (wpn.xap) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes([`ap-${wpn.xap}`,"ap-x"], [true,false]), false, false)+" title=\"Explosion AP\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.xap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.effect === 6) {
pug_html = pug_html + "\u003Cspan class=\"ap-4 ap-fire\" title=\"Status AP\"\u003E" + (pug_escape(null == (pug_interp = wpn.statusap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"demo\"\u003E\u003Cspan class=\"demo-main\" title=\"Demolition Force\"\u003E" + (pug_escape(null == (pug_interp = wpn.demo) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xdemo) {
pug_html = pug_html + "\u003Cspan class=\"demo-x\" title=\"Explosion Demolision\"\u003E" + (pug_escape(null == (pug_interp = wpn.xdemo) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"stun\"\u003E\u003Cspan class=\"stun-main\" title=\"Direct Hit Stagger\"\u003E" + (pug_escape(null == (pug_interp = wpn.stun) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xstun) {
pug_html = pug_html + "\u003Cspan class=\"stun-x\" title=\"Explosion Stagger\"\u003E" + (pug_escape(null == (pug_interp = wpn.xstun) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"push\"\u003E\u003Cspan class=\"push-main\" title=\"Direct Hit Knockback\"\u003E" + (pug_escape(null == (pug_interp = wpn.push) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xpush) {
pug_html = pug_html + "\u003Cspan class=\"push-x\" title=\"Explosion Knockback\"\u003E" + (pug_escape(null == (pug_interp = wpn.xpush) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"recoil\"\u003E" + (pug_escape(null == (pug_interp = wpn.recoil) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"rpm\"\u003E";
if (hasTag(wpn, 'laser')) {
pug_html = pug_html + "\u003Cspan class=\"rpm-laser\"\u003EBeam\u003C\u002Fspan\u003E";
}
if (wpn.charge) {
pug_html = pug_html + "\u003Cspan class=\"rpm-charge\" title=\"Charge time\"\u003E\u003Csup class=\"one-over\"\u003E1\u002F\u003C\u002Fsup\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = wpn.charge) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
else {
pug_html = pug_html + "\u003Cspan class=\"rpm-main\"\u003E" + (pug_escape(null == (pug_interp = wpn.rpm) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"reload\"\u003E";
if (wpn.reloadone) {
pug_html = pug_html + "\u003Cspan class=\"reload-one\" title=\"Reload 1 round\"\u003E" + (pug_escape(null == (pug_interp = wpn.reloadone.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reloadx) {
pug_html = pug_html + "\u003Cspan" + (" class=\"reload-x\""+pug_attr("title", `Reload ${wpn.reloadxnum} rounds`, true, false)) + "\u003E" + (pug_escape(null == (pug_interp = wpn.reloadx.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reload) {
pug_html = pug_html + "\u003Cspan class=\"reload-main\" title=\"Reload from empty\"\u003E" + (pug_escape(null == (pug_interp = wpn.reload.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reloadearly) {
pug_html = pug_html + "\u003Cspan class=\"reload-early\" title=\"Early Reload (not empty)\"\u003E" + (pug_escape(null == (pug_interp = wpn.reloadearly.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"cap\"\u003E" + (pug_escape(null == (pug_interp = wpn.cap || wpn.limit) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"capextra\"\u003E";
if (wpn.limit) {
pug_html = pug_html + "\u003Cspan class=\"cap-limit\"\u003Es\u003C\u002Fspan\u003E";
}
else
if (wpn.capplus) {
pug_html = pug_html + "\u003Csup class=\"cap-post cap-plus\" title=\"Chambered Round from reloading early\"\u003E" + (pug_escape(null == (pug_interp = wpn.capplus) ? "" : pug_interp)) + "\u003C\u002Fsup\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"spare\"\u003E";
if (wpn.clips) {
pug_html = pug_html + "\u003Cspan class=\"clipsize\" title=\"Rounds in Clip\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipsize) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clipstart\" title=\"Starting Clips\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipstart) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clips\" title=\"Max Clips\"\u003E" + (pug_escape(null == (pug_interp = wpn.clips) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.rounds) {
pug_html = pug_html + "\u003Cspan class=\"roundstart\" title=\"Starting Rounds\"\u003E" + (pug_escape(null == (pug_interp = roundStart(wpn)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"rounds\" title=\"Max Spare Rounds\"\u003E" + (pug_escape(null == (pug_interp = wpn.rounds) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
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
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"dps\" title=\"Damage Per Second\"\u003E" + (pug_escape(null == (pug_interp = dps(wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"tdps\" title=\"Damage Per Second (Including Reload Time)\"\u003E" + (pug_escape(null == (pug_interp = tdps(wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"magdmg\" title=\"Damage From Magdump\"\u003E" + (pug_escape(null == (pug_interp = magDmg(wpn) || '') ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"total\" title=\"Damage From All Ammo Expended\"\u003E" + (pug_escape(null == (pug_interp = totalDmg(wpn) || '') ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index8 in $$obj) {
      $$l++;
      var wpn = $$obj[pug_index8];
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd" + (" class=\"source\""+pug_attr("title", sourceFull(wpn), true, false)) + "\u003E\u003Cspan" + (pug_attr("class", pug_classes([wpn.source,"source-main","source"], [true,false,false]), false, false)) + "\u003E" + (pug_escape(null == (pug_interp = sourceLabels[wpn.source]) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.sourcepage) {
pug_html = pug_html + "\u003Cspan class=\"source-page\"\u003E" + (pug_escape(null == (pug_interp = wpn.sourcepage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd" + (pug_attr("class", pug_classes([wpn.category,"category"], [true,false]), false, false)+pug_attr("title", categoryFull(wpn), true, false)) + "\u003E" + (pug_escape(null == (pug_interp = wpn.category) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"code\"\u003E\u003Ca" + (pug_attr("href", wikiLink(wpn), true, false)+" target=\"_blank\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.code) ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"name\"\u003E\u003Ca" + (pug_attr("href", wikiLink(wpn), true, false)+" target=\"_blank\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.name) ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"damage\"\u003E";
if (wpn.dmgtype) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["damage-type",dmgTypeClass(wpn)], [false,true]), false, false)+pug_attr("title", dmgTypeText(wpn), true, false)) + "\u003E" + (pug_escape(null == (pug_interp = dmgType(wpn)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.pellets) {
pug_html = pug_html + "\u003Cspan class=\"pellets\" title=\"Projectiles\"\u003E" + (pug_escape(null == (pug_interp = wpn.pellets) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003Cspan class=\"damage-main\" title=\"Direct Hit\"\u003E" + (pug_escape(null == (pug_interp = wpn.damage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"durable\" title=\"Direct Hit (vs Massive)\"\u003E" + (pug_escape(null == (pug_interp = wpn.durable) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"ap\"\u003E\u003Cspan" + (pug_attr("class", pug_classes([`ap-${wpn.ap}`], [true]), false, false)+" title=\"Direct Hit\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.ap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Ftd\u003E\u003Ctd class=\"effect\"\u003E";
if (wpn.xdamage) {
pug_html = pug_html + "\u003Cspan class=\"damage-x\" title=\"Explosion\"\u003E" + (pug_escape(null == (pug_interp = wpn.xdamage) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
// iterate effectParams
;(function(){
  var $$obj = effectParams;
  if ('number' == typeof $$obj.length) {
      for (var pug_index10 = 0, $$l = $$obj.length; pug_index10 < $$l; pug_index10++) {
        var p = $$obj[pug_index10];
if (wpn[p.prop]) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["effect-main",p.prop], [false,true]), false, false)+pug_attr("title", effectDescription(wpn, p), true, false)) + "\u003E\u003Cspan class=\"effect-name\"\u003E" + (pug_escape(null == (pug_interp = effectName(wpn, p)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"effect-value\"\u003E" + (pug_escape(null == (pug_interp = effectValue(wpn, p)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index10 in $$obj) {
      $$l++;
      var p = $$obj[pug_index10];
if (wpn[p.prop]) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["effect-main",p.prop], [false,true]), false, false)+pug_attr("title", effectDescription(wpn, p), true, false)) + "\u003E\u003Cspan class=\"effect-name\"\u003E" + (pug_escape(null == (pug_interp = effectName(wpn, p)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"effect-value\"\u003E" + (pug_escape(null == (pug_interp = effectValue(wpn, p)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"xap\"\u003E";
if (wpn.xap) {
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes([`ap-${wpn.xap}`,"ap-x"], [true,false]), false, false)+" title=\"Explosion AP\"") + "\u003E" + (pug_escape(null == (pug_interp = wpn.xap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.effect === 6) {
pug_html = pug_html + "\u003Cspan class=\"ap-4 ap-fire\" title=\"Status AP\"\u003E" + (pug_escape(null == (pug_interp = wpn.statusap) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"demo\"\u003E\u003Cspan class=\"demo-main\" title=\"Demolition Force\"\u003E" + (pug_escape(null == (pug_interp = wpn.demo) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xdemo) {
pug_html = pug_html + "\u003Cspan class=\"demo-x\" title=\"Explosion Demolision\"\u003E" + (pug_escape(null == (pug_interp = wpn.xdemo) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"stun\"\u003E\u003Cspan class=\"stun-main\" title=\"Direct Hit Stagger\"\u003E" + (pug_escape(null == (pug_interp = wpn.stun) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xstun) {
pug_html = pug_html + "\u003Cspan class=\"stun-x\" title=\"Explosion Stagger\"\u003E" + (pug_escape(null == (pug_interp = wpn.xstun) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"push\"\u003E\u003Cspan class=\"push-main\" title=\"Direct Hit Knockback\"\u003E" + (pug_escape(null == (pug_interp = wpn.push) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
if (wpn.xpush) {
pug_html = pug_html + "\u003Cspan class=\"push-x\" title=\"Explosion Knockback\"\u003E" + (pug_escape(null == (pug_interp = wpn.xpush) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"recoil\"\u003E" + (pug_escape(null == (pug_interp = wpn.recoil) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"rpm\"\u003E";
if (hasTag(wpn, 'laser')) {
pug_html = pug_html + "\u003Cspan class=\"rpm-laser\"\u003EBeam\u003C\u002Fspan\u003E";
}
if (wpn.charge) {
pug_html = pug_html + "\u003Cspan class=\"rpm-charge\" title=\"Charge time\"\u003E\u003Csup class=\"one-over\"\u003E1\u002F\u003C\u002Fsup\u003E\u003Cspan\u003E" + (pug_escape(null == (pug_interp = wpn.charge) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
else {
pug_html = pug_html + "\u003Cspan class=\"rpm-main\"\u003E" + (pug_escape(null == (pug_interp = wpn.rpm) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"reload\"\u003E";
if (wpn.reloadone) {
pug_html = pug_html + "\u003Cspan class=\"reload-one\" title=\"Reload 1 round\"\u003E" + (pug_escape(null == (pug_interp = wpn.reloadone.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reloadx) {
pug_html = pug_html + "\u003Cspan" + (" class=\"reload-x\""+pug_attr("title", `Reload ${wpn.reloadxnum} rounds`, true, false)) + "\u003E" + (pug_escape(null == (pug_interp = wpn.reloadx.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reload) {
pug_html = pug_html + "\u003Cspan class=\"reload-main\" title=\"Reload from empty\"\u003E" + (pug_escape(null == (pug_interp = wpn.reload.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.reloadearly) {
pug_html = pug_html + "\u003Cspan class=\"reload-early\" title=\"Early Reload (not empty)\"\u003E" + (pug_escape(null == (pug_interp = wpn.reloadearly.toFixed(1)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"cap\"\u003E" + (pug_escape(null == (pug_interp = wpn.cap || wpn.limit) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"capextra\"\u003E";
if (wpn.limit) {
pug_html = pug_html + "\u003Cspan class=\"cap-limit\"\u003Es\u003C\u002Fspan\u003E";
}
else
if (wpn.capplus) {
pug_html = pug_html + "\u003Csup class=\"cap-post cap-plus\" title=\"Chambered Round from reloading early\"\u003E" + (pug_escape(null == (pug_interp = wpn.capplus) ? "" : pug_interp)) + "\u003C\u002Fsup\u003E";
}
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"spare\"\u003E";
if (wpn.clips) {
pug_html = pug_html + "\u003Cspan class=\"clipsize\" title=\"Rounds in Clip\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipsize) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clipstart\" title=\"Starting Clips\"\u003E" + (pug_escape(null == (pug_interp = wpn.clipstart) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"clips\" title=\"Max Clips\"\u003E" + (pug_escape(null == (pug_interp = wpn.clips) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (wpn.rounds) {
pug_html = pug_html + "\u003Cspan class=\"roundstart\" title=\"Starting Rounds\"\u003E" + (pug_escape(null == (pug_interp = roundStart(wpn)) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cspan class=\"rounds\" title=\"Max Spare Rounds\"\u003E" + (pug_escape(null == (pug_interp = wpn.rounds) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
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
pug_html = pug_html + "\u003C\u002Ftd\u003E\u003Ctd class=\"dps\" title=\"Damage Per Second\"\u003E" + (pug_escape(null == (pug_interp = dps(wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"tdps\" title=\"Damage Per Second (Including Reload Time)\"\u003E" + (pug_escape(null == (pug_interp = tdps(wpn)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"magdmg\" title=\"Damage From Magdump\"\u003E" + (pug_escape(null == (pug_interp = magDmg(wpn) || '') ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd class=\"total\" title=\"Damage From All Ammo Expended\"\u003E" + (pug_escape(null == (pug_interp = totalDmg(wpn) || '') ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftbody\u003E";
}
pug_html = pug_html + "\u003C\u002Ftable\u003E\u003Cul\u003E\u003Cli\u003EExact details of effects are not verified.\u003C\u002Fli\u003E\u003Cli\u003EMass damage, stun, and push are puzzled together from an unsorted pile of numbers and guesswork. Take them with a heaping of salt.\u003C\u002Fli\u003E\u003Cli\u003EReload is measured from when reticle disappears to when it comes back. Not all weapons had a reticle. Timing may be off by up to 0.1s.\u003C\u002Fli\u003E\u003Cli\u003EStarting mags for support weapons are currently unmeasured, but become max after the ship module upgrade.\u003C\u002Fli\u003E\u003C\u002Ful\u003E";}.call(this,"catClass" in locals_for_with?locals_for_with.catClass:typeof catClass!=="undefined"?catClass:undefined,"categoryFull" in locals_for_with?locals_for_with.categoryFull:typeof categoryFull!=="undefined"?categoryFull:undefined,"cats" in locals_for_with?locals_for_with.cats:typeof cats!=="undefined"?cats:undefined,"colClass" in locals_for_with?locals_for_with.colClass:typeof colClass!=="undefined"?colClass:undefined,"colSpan" in locals_for_with?locals_for_with.colSpan:typeof colSpan!=="undefined"?colSpan:undefined,"cols" in locals_for_with?locals_for_with.cols:typeof cols!=="undefined"?cols:undefined,"dmgType" in locals_for_with?locals_for_with.dmgType:typeof dmgType!=="undefined"?dmgType:undefined,"dmgTypeClass" in locals_for_with?locals_for_with.dmgTypeClass:typeof dmgTypeClass!=="undefined"?dmgTypeClass:undefined,"dmgTypeText" in locals_for_with?locals_for_with.dmgTypeText:typeof dmgTypeText!=="undefined"?dmgTypeText:undefined,"dps" in locals_for_with?locals_for_with.dps:typeof dps!=="undefined"?dps:undefined,"effectDescription" in locals_for_with?locals_for_with.effectDescription:typeof effectDescription!=="undefined"?effectDescription:undefined,"effectName" in locals_for_with?locals_for_with.effectName:typeof effectName!=="undefined"?effectName:undefined,"effectParams" in locals_for_with?locals_for_with.effectParams:typeof effectParams!=="undefined"?effectParams:undefined,"effectValue" in locals_for_with?locals_for_with.effectValue:typeof effectValue!=="undefined"?effectValue:undefined,"getWeapons" in locals_for_with?locals_for_with.getWeapons:typeof getWeapons!=="undefined"?getWeapons:undefined,"hasTag" in locals_for_with?locals_for_with.hasTag:typeof hasTag!=="undefined"?hasTag:undefined,"header" in locals_for_with?locals_for_with.header:typeof header!=="undefined"?header:undefined,"magDmg" in locals_for_with?locals_for_with.magDmg:typeof magDmg!=="undefined"?magDmg:undefined,"nerdMode" in locals_for_with?locals_for_with.nerdMode:typeof nerdMode!=="undefined"?nerdMode:undefined,"nerdValue" in locals_for_with?locals_for_with.nerdValue:typeof nerdValue!=="undefined"?nerdValue:undefined,"roundStart" in locals_for_with?locals_for_with.roundStart:typeof roundStart!=="undefined"?roundStart:undefined,"sourceClass" in locals_for_with?locals_for_with.sourceClass:typeof sourceClass!=="undefined"?sourceClass:undefined,"sourceFull" in locals_for_with?locals_for_with.sourceFull:typeof sourceFull!=="undefined"?sourceFull:undefined,"sourceLabels" in locals_for_with?locals_for_with.sourceLabels:typeof sourceLabels!=="undefined"?sourceLabels:undefined,"sourceOrder" in locals_for_with?locals_for_with.sourceOrder:typeof sourceOrder!=="undefined"?sourceOrder:undefined,"tdps" in locals_for_with?locals_for_with.tdps:typeof tdps!=="undefined"?tdps:undefined,"totalDmg" in locals_for_with?locals_for_with.totalDmg:typeof totalDmg!=="undefined"?totalDmg:undefined,"wikiLink" in locals_for_with?locals_for_with.wikiLink:typeof wikiLink!=="undefined"?wikiLink:undefined));;return pug_html;}