local getArgs = require("Module:Arguments").getArgs
local getWeightMetric = require("Module:UnitConverter").getWeightMetricLua
local p = {} --p stands for package
local data = mw.loadData("Module:Decodedata-Attacks")

function cbShowAP(value, _, frame)
  return frame.expandTemplate("Armor", { value, "AP" })
end

function cbShowStatus(value, _, frame)
  return "[[Status Effects#" .. value .. "|" .. value .. "]]"
end

function cbShowWeight(value)
  return getWeightMetric(value)
end

function cbShowPercent(value)
  return value * 100 .. "%"
end

function filterNonZero(value)
  return value > 0 or value < 0
end

-- Positional vars:
-- 1: Displayed key in the table
-- 2: Name of user-facing variable
-- 3: Name of corresponding data object in DecodeData-Attacks/data.json
-- If the data name is missing, the two keys are assumed identical
local weapon_setup = {
  { "colspan=2", 1, header = true },
  { "Main Health", "health" },
  { "Main Armor", "armor",
    cb = function(value, _, frame)
      return frame.expandTemplate("Armor", { value })
    end },
  { "Fire Rate", "fire_rate", "rpm", suffix = "RPM" },
  { "Recoil", "recoil" },
  { "Capacity", "capacity", "cap" },
  { "Fire Limit", "fire_limit", "limit", suffix = "sec" },
  { "Reload Time", "reload", suffix = " sec" },
  { "Tactical Reload", "reload_early", "limit" },
  { "Spare Magazines", "magazines_spare", "mags", },
  { "Starting Magazines", "magazines_starting", "magstart", },
  { "Mags from Supply", "magazines_from_supply", "supply" },
  { "Mags from Ammo Box", "magazines_from_box", "box" },
  { "Reloading 1 Round", "reload_one", "reloadone", suffix = "sec" },
  { "Reloading n Rounds", "reload_n", "reloadx",
    cb = function(value, attack, frame, args)
      local n = args["reload_n_count"] or attack["reloadxnum"] or "n"
      return value, "Reloading " .. n .. " Rounds"
    end },
  { "Spare Rounds", "rounds_spare", "rounds", },
  { "Starting Rounds", "rounds_starting", "roundstart", },
  { "Rounds from Supply", "rounds_from_supply", "roundsupply" },
  { "Rounds from Ammo Box", "rounds_from_box", "roundsbox" },
  { "Clip Capacity", "clips_size", "clipsize", },
  { "Spare Clips", "clips_spare", "clips", },
  { "Starting Clips", "clips_starting", "clipstart", },
  { "Clips from Supply", "clips_from_supply", "clipsupply" },
  { "Clips from Ammo Box", "clips_from_box", "clipsbox" },
}

local damage_setup = {
  { "colspan=2", literal = "Damage", header = true },
  { "Element", "element", "element_name" },
  { "Standard", "standard_damage", "dmg" },
  { "vs. Durable", "durable_damage", "dmg2" },
  { "colspan=2", literal = "Penetration", header = true },
  { "Direct", "penetration_direct", "ap1", cb = cbShowAP },
  { "Slight Angle", "penetration_angle_slight", "ap2", cb = cbShowAP },
  { "Large Angle", "penetration_angle_large", "ap3", cb = cbShowAP },
  { "Extreme Angle", "penetration_angle_extreme", "ap4", cb = cbShowAP },
  { "colspan=2", literal = "Special Effects", header = true },
  { "Status", "status", "status_name", cb = cbShowStatus },
  { "Status Strength", "status_strength", "param1", filter = filterNonZero},
  { "Second Status", "status_2", "status_name2", cb = cbShowStatus },
  { "Status Strength", "status_strength_2", "param2" , filter = filterNonZero},
  { "Third Status", "status_3", "status_name3", cb = cbShowStatus },
  { "Status Strength", "status_strength_3", "param3", filter = filterNonZero},
  { "Fourth Status", "status_4", "status_name4", cb = cbShowStatus },
  { "Status Strength", "status_strength_4", "param4", filter = filterNonZero},
  { "Demolition Force", "demolition_force", "demo"},
  { "Stagger Force", "stagger_force", "stun"},
  { "Push Force", "push_force", "push"},
}

local projectile_setup = {
  { "colspan=2", "projectile_name", "name", header = true },
  { "Amount", "attack_count", prefix = "x" },
  { "Pellets", "attack_count", prefix = "x" },
  { "Caliber", "caliber", suffix = "mm" },
  { "Mass", "mass", cb = cbShowWeight },
  { "Initial Velocity", "velocity", suffix = "m/s" },
  { "Drag Factor", "drag", cb = cbShowPercent },
  { "Gravity Factor", "gravity", cb = cbShowPercent },
  { "Lifetime", "lifetime", filter = filterNonZero, suffix = "sec" },
  { "Penetration Slowdown", "penetration_slowdown", "penslow", cb = cbShowPercent },
}

function addRow(row, attack, frame, args)
  local label = row[1]
  local user_key = row[2]
  local data_key = row[3] or user_key
  local value = row.literal

  if not value then
    value = args[user_key] or attack[data_key]
  end
  if not value then -- If value doesn"t exist we omit the table row entirely
    return ""
  end
  if row.cb then
    local newValue, newLabel = row.cb(value, attack, frame, args)
    value = newValue
    if newLabel then label = newLabel end
  end
  if row.filter and not row.filter(value, attack, frame, args) then
    return ""
  end
  if row.prefix then
    value = row.prefix .. " " .. value
  end
  if row.suffix then
    value = value .. " " .. row.suffix
  end

  if row.header then
    -- label is header info, typically colspan=2
    -- value is text to put in header
    return "!" .. label .. "|" .. value .. "\n|-\n"
  else
    return "|" .. label .. "||" .. value .. "\n|-\n"
  end
end

function getAttackTable(table_setup, attack, frame, args)
  local out = "{| class{{=}}\"wikitable tableleftjustified\"\n"
  for i, row in ipairs(table_setup) do
    out = out .. addRow(row, attack, frame, args)
  end
  return out .. "|}"
end

function getProjectileTable(projectile, frame, args)
  local out = "{| class{{=}}\"wikitable tableleftjustified\"\n"
  for i, row in ipairs(projectile_setup) do
    out = out .. addRow(row, projectile, frame, args)
  end
  local damage = data.damage[projectile.damage_name]
  if damage then
    for i, row in ipairs(damage_setup) do
      out = out .. addRow(row, damage, frame, args)
    end
  end
  return out .. "|}"
end

function p.attackDataTemplate(frame)
    local args = getArgs(frame, {
      removeBlanks = false,
      wrappers = "Template:AttackData",
    })

    local weapon_name = args[1] or frame:getParent():getTitle()
    if not args[1] then
      args[1] = weapon_name -- Make name accessible for later display
    end
    local weapon =  data.weapon[weapon_name]
    if not weapon then
      return "Weapon not found: \"" .. weapon_name .. "\""
    end
    local out = ""

    out = out .. getAttackTable(weapon_setup, weapon, frame, args)
    for i, attack in ipairs(weapon.attacks) do
      print(i, attack)
      local medium = data[attack.type][attack.name]
      if attack.type == "projectile" then
        out = out .. getProjectileTable(medium, frame, args)
      elseif medium.damage_name then
        local damage = data.damage[medium.damage_name]
        out = out .. getAttackTable(damage_setup, damage, frame, args)
      end
    end

    return out
end

function p.get(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No scope supplied"
    end
  if not args[2] then
      return "No name supplied"
  end
    if not args[3] then
      return "No property supplied"
  end
    local register = data[args[1]]
    if not register then
      return "Scope not found: " .. args[1] 
    end
    local object = register[args[2]]
    if not object then
      return "Object not found: " ..args[2]
    end
    return object[args[3]]
end

function getAttackCount(weapon)
    local attacks = weapon.attacks
    if not attacks then
      return 0
    end
    local n = 0
    for k, v in pairs(attacks) do -- #attacks returns 0
        n = n + 1
    end
    return n
end

function p.getAttackCount(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No weapon supplied"
    end
    local weapon = data.weapon[args[1]]
    if not weapon then
      return "Weapon not found: \"" ..args[1].."\""
    end
    return getAttackCount(weapon)
end

function p.getAttackTable(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No weapon supplied"
    end
    if not args[2] then
      return "No attack index supplied"
    end
    local weapon = data.weapon[args[1]]
    if not weapon then
      return "Weapon not found: \"" ..args[1].."\""
    end
    local attacks = weapon.attacks
    if not attacks then
      return "Attacks no found for: \"" ..args[1].."\""
    end
    local idx = tonumber(args[2])
    local attack = attacks[idx]
    if not attack then
      return "Attack not found: #" .. args[2]
    end

    return frame:expandTemplate{
      title = "Attack_Data/" .. attack["type"],
      args = { attack["name"], attack_count = attack["count"] },
    } end

function isHybrid(weapon)
    local attacks = weapon.attacks
    if not attacks then
      return false
    end

    local projectile
    if not attacks[2] then
      return false
    end
    if attacks[1]["type"] ~= "projectile" then
      return false
    end
    if attacks[2]["type"] ~= "explosion" then
      return false
    end
    return true
end

function p.getHybridTable(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No weapon supplied"
    end
    local weapon = data.weapon[args[1]]
    if not weapon then
      return "Weapon not found: \"" ..args[1].."\""
    end
    if not isHybrid(weapon) then
      return ""
    end

    local attacks = weapon.attacks
    local projectile_name = attacks[1]["name"]
    local explosion_name = attacks[2]["name"]
    return frame:expandTemplate{
      title = "Attack_Data/hybrid",
      args = { projectile_name, explosion_name },
    }
end

function expandAttackTables(weapon)
    local attacks = weapon.attacks
    if not attacks then
      return ""
    end
    local i = 1
    local output = ""

    while attacks[i] do
      local attack = attacks[i]
      local count = attack["count"]
      local count_arg = ""
      if count then
        count_arg = "|attack_count="..count
      end
      output = output ..
        "{{Attack_Data/" .. attack["type"] ..
        "|"..  attack["name"] ..
        count_arg ..
        "}}"

      if attack["type"] == "weapon" then
        local subweapon = data.weapon[attack["name"]]
        if subweapon then
          output = output .. expandAttackTables(subweapon)
        end
      end

      i = i + 1
    end

    return output
end

function p.getAttackTables(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No weapon supplied"
    end

    local weapon = data.weapon[args[1]]
    if not weapon then
      return "Weapon not found: \"" ..args[1].."\""
    end
    local output = expandAttackTables(weapon)

    return frame:preprocess(output)
end

function variablesTemplate(frame, variables, object, prefix)
    local output = ""
    for varname, dataname in pairs(variables) do
      local k = (prefix or "") .. varname
      local val = object[dataname] or ""
      output = output ..  "{{#vardefine:"..k.."|{{{"..k.."|"..val.."}}}}}"
    end
    return output
end

local weapon_variables = {
  fire_rate = "rpm",
  recoil = "recoil",
  reload = "reload",
  reload_early = "reloadearly",
  reload_n = "reloadx",
  reload_n_count = "reloadxnum",
  reload_one = "reloadone",
  capacity = "cap",
  capacity_chamber = "capplus",
  magazines_spare = "mags",
  magazines_starting = "magstart",
  magazines_from_supply = "supply",
  magazines_from_box = "box",
  fire_limit = "limit",
  rounds_spare = "rounds",
  rounds_starting = "roundstart",
  rounds_from_supply = "roundsupply",
  rounds_from_box = "roundsbox",
  clips_spare = "clips",
  clips_size = "clipsize",
  clips_starting = "clipstart",
  clips_from_supply = "clipsupply",
  clips_from_box = "clipbox",
  charge_time = "charge",
  charge_time_early = "chargeearly",
  charge_factor = "chargefactor",
  shot_count = "count",
  health = "health",
  armor_main = "armor",
}

function p.getWeaponVariables(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No weapon name supplied"
    end
    local obj = data.weapon[args[1]]
    if not obj then
      return "Weapon not found: \"" .. args[1].."\""
    end
    return frame:preprocess(variablesTemplate(frame, weapon_variables, obj, args[2]))
end

local damage_variables = {
  standard_damage = "dmg",
  durable_damage = "dmg2",
  demolition_value = "demo",
  stagger_value = "stun",
  push_value = "push",
  pen1 = "ap1",
  pen2 = "ap2",
  pen3 = "ap3",
  pen4 = "ap4",
  element = "element_name",
  status = "status_name",
  status_strength = "param1",
  status2 = "status_name2",
  status_strength2 = "param2",
  damage_fullname = "name",
}

function p.getDamageVariables(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No damage name supplied"
    end
    local obj = data.damage[args[1]]
    if not obj then
      return "Damage not found: \"" .. args[1].."\""
    end
    return frame:preprocess(variablesTemplate(frame, damage_variables, obj, args[2]))
end

local projectile_variables = {
  caliber = "caliber",
  velocity = "velocity",
  mass = "mass",
  drag = "drag",
  gravity = "gravity",
  penslow = "penslow",
  pellets = "pellets",
  name = "gravity",
  gravity = "gravity",
  gravity = "gravity",
  lifetime = "lifetime",
  projectile_fullname = "name",
  damage_name = "damage_name",
}

function p.getProjectileVariables(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No projectile name supplied"
    end
    local obj = data.projectile[args[1]]
    if not obj then
      return "Projectile not found: " .. args[1]
    end
    return frame:preprocess(variablesTemplate(frame, projectile_variables, obj, args[2]))
end

local explosion_variables = {
  radius_inner = "r1",
  radius_outer = "r2",
  radius_shockwave = "r3",
  explosion_fullname = "name",
  xdamage_name = "damage_name",
}

function p.getExplosionVariables(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No explosion name supplied"
    end
    local obj = data.explosion[args[1]]
    if not obj then
      return "Explosion not found: " .. args[1]
    end
    return frame:preprocess(variablesTemplate(frame, explosion_variables, obj, args[2]))
end

function p.getHybridVariables(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No projectile name supplied"
    end
    if not args[2] then
      return "No explosion name supplied"
    end
    local projectile = data.projectile[args[1]]
    if not projectile then
      return "Projectile not found: \"" .. args[1].."\""
    end
    local explosion = data.explosion[args[2]]
    if not explosion then
      return "Explosion not found: \"" .. args[2].."\""
    end
    local output = ""

    output = output .. variablesTemplate(frame, projectile_variables, projectile)
    output = output .. variablesTemplate(frame, explosion_variables, explosion)
    local prj_damage_name = projectile["damage_name"]
    if prj_damage_name then
      local damage = data.damage[prj_damage_name]
      output = output .. variablesTemplate(frame, damage_variables, damage)
    end
    local aoe_damage_name = explosion["damage_name"]
    if aoe_damage_name then
      local aoe_damage = data.damage[aoe_damage_name]
      output = output .. variablesTemplate(frame, damage_variables, aoe_damage, "aoe_")
    end
    return frame:preprocess(output)
end

local arc_variables = {
  arc_velocity = "velocity",
  arc_range = "range",
  arc_aim_angle = "aimangle",
  arc_fullname = "name",
  arc_damage_name = "damage_name",
}

function p.getArcVariables(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No arc name supplied"
    end
    local obj = data.arc[args[1]]
    if not obj then
      return "Arc not found: \"" .. args[1].."\""
    end
    return frame:preprocess(variablesTemplate(frame, arc_variables, obj, args[2]))
end

local beam_variables = {
  beam_range = "range",
  beam_fullname = "name",
  beam_damage_name = "damage_name",
}

function p.getBeamVariables(frame)
    local args = getArgs(frame)
    if not args[1] then
      return "No beam name supplied"
    end
    local obj = data.beam[args[1]]
    if not obj then
      return "beam not found: \"" .. args[1] .."\""
    end
    return frame:preprocess(variablesTemplate(frame, beam_variables, obj, args[2]))
end

return p
