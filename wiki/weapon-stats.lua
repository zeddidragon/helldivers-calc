local getArgs = require("Module:Arguments").getArgs
local getWeightMetric = require("Module:UnitConverter").getWeightMetricLua
local p = {} --p stands for package
local data = mw.loadData("Module:Decodedata-Attacks")

function cbShowAP(value, opts)
  return opts.frame:expandTemplate({
    title = "Armor",
    args = { value, "AP" },
  })
end

function cbShowOuterRadiusAP(value, opts)
  value = value - 1
  if value < 2 then
    value = 2
  end
  return cbShowAP(value, opts)
end

function cbShowStatus(value, opts)
  return "[[Status Effects#" .. value .. "|" .. value .. "]]"
end

function cbShowDecline(value)
  return value - 1 .. " - 0"
end

function cbShowWeight(value)
  return getWeightMetric(value)
end

function cbShowPercent(value)
  return value * 100 .. "%"
end

function cbHalf(value)
  return math.max(1, math.floor(value * 0.5))
end

function filterNonZero(value)
  return value > 0 or value < 0
end

function filterGt(n)
  function filterGtN(value)
    return value > n
  end
  return filterGtN
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
    cb = function(value, opts)
      return opts.frame:expandTemplate({
        title = "Armor", 
        args = { value },
      })
    end },
  { "Shield Capacity", "shield" },
  { "Shield Regen", "shieldregen", suffix = "shield/s" },
  { "Shield Regen Delay", "shielddelay", suffix = "s" },
  { "Shield Broken Delay", "shieldbreakdelay", suffix = "s" },
  { "Shield Radius", "shieldradius", suffix = "m" },
  { "Fire Rate", "fire_rate", "rpm", suffix = "rpm" },
  { "Recoil", "recoil" },
  { "Total Uses", "uses" },
  { "Eagle Stock", "eagle_stock", "eaglestock" },
  { "Cooldown", "cooldown", suffix = "sec" },
  { "Call-in Time", "callin_time", "calltime", suffix = "s"},
  { "Salvos", "salvos" },
  { "Capacity", "capacity", "cap" },
  { "Fire Limit", "fire_limit", "limit", suffix = "s" },
  { "Reload Time", "reload", suffix = " s" },
  { "Tactical Reload", "reload_early", "reloadearly" , suffix = "s" },
  { "Spare Magazines", "magazines_spare", "mags", },
  { "Starting Magazines", "magazines_starting", "magstart", },
  { "Mags from Supply", "magazines_from_supply", "supply" },
  { "Mags from Ammo Box", "magazines_from_box", "supply", cb = cbHalf },
  { "Reloading 1 Round", "reload_one", "reloadone", suffix = "s" },
  { "Reloading n Rounds", "reload_n", "reloadx", suffix = "s",
    cb = function(value, opts)
      local n = opts.args["reload_n_count"] or opts.medium["reloadxnum"] or "n"
      return value, "Reloading " .. n .. " Rounds"
    end },
  { "Spare Rounds", "rounds_spare", "rounds", },
  { "Starting Rounds", "rounds_starting", "roundstart", },
  { "Rounds from Supply", "rounds_from_supply", "roundsupply" },
  { "Rounds from Ammo Box", "rounds_from_box", "roundsupply", cb = cbHalf },
  { "Clip Capacity", "clips_size", "clipsize", },
  { "Spare Clips", "clips_spare", "clips", },
  { "Starting Clips", "clips_starting", "clipstart", },
  { "Clips from Supply", "clips_from_supply", "clipsupply" },
  { "Clips from Ammo Box", "clips_from_box", "clipssupply", cb = cbHalf },
}

local damage_setup = {
  { "colspan=2", "damage_name", header = true }, -- Just there for manual input, really.
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
  { "colspan=2", literal = "Projectile", header = true },
  { "Pellets", "pellets", filter = filterGt(1), prefix = "x" },
  { "Caliber", "caliber", suffix = "mm" },
  { "Mass", "mass", cb = cbShowWeight },
  { "Initial Velocity", "velocity", suffix = "m/s" },
  { "Drag Factor", "drag", cb = cbShowPercent },
  { "Gravity Factor", "gravity", cb = cbShowPercent },
  { "Lifetime", "lifetime", filter = filterNonZero, suffix = "sec" },
  { "Penetration Slowdown", "penetration_slowdown", "penslow", cb = cbShowPercent },
}

local explosion_setup = {
  { "colspan=2", "aoe_name", "name", header = true },
  { "colspan=2", literal = "Area of Effect", header = true },
  { "Inner Radius", "inner_radius", "r1", suffix = "m" },
  { "Outer Radius", "outer_radius", "r2", suffix = "m" },
  { "Shockwave Radius", "shockwave_radius", "r3", suffix = "m" },
}

local explosion_damage_setup = {
  { "colspan=2", literal = "Damage", header = true },
  { "Damage Element", "element", "element_name" },
  { "Inner Radius", "aoe_damage", "dmg" },
  { "Outer Radius", "aoe_falloff", "dmg", filter = filterGt(1), cb = cbShowDecline },
  { "colspan=2", literal = "Penetration", header = true },
  { "Inner Radius", "penetration_direct", "ap1", cb = cbShowAP },
  { "Outer Radius", "aoe_penetration", "ap1", cb = cbShowOuterRadiusAP },
  { "Shockwave", "aoe_penetration", "ap1", cb = cbShowAP },
  { "colspan=2", literal = "AoE Effect", header = true },
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

local beam_setup = {
  { "colspan=2", "beam_name", "name", header = true },
  { "colspan=2", literal = "Beam", header = true },
  { "Beam Range", "range", suffix = "m"},
}

local arc_setup = {
  { "colspan=2", "arc_name", "name", header = true },
  { "colspan=2", literal = "Arc", header = true },
  { "Arc Range", "arc_range", "range", suffix = "m"},
  { "Arc Velocity", "arc_velocity", "velocity", suffix = "m/s"},
  { "Arc Aim Angle", "arc_aim_angle", "aimangle", suffix = "°"},
}

local attack_type = {
  weapon = "Weapon",
  projectile = "Projectile",
  explosion = "Explosion",
  damage = "Damage",
  spray = "Spray",
  beam = "Beam",
  arc = "Arc",
}

local status_damages = {
  [2] = "DPS_Avatar_Bleed",
  [6] = "DPS_Fire",
  [10] = "DPS_Acid_Splash",
  [11] = "DPS_Acid_Stream",
  [12] = "DPS_Thermite",
  [13] = "DPS_Cyborg_Fire",
  [18] = "DPS_Thornbush",
  [22] = "DPS_Pure_Damage",
  [39] = "DPS_Gas",
}

local table_setups = {
  weapon = { weapon_setup, damage_setup },
  damage = { damage_setup },
  projectile = { projectile_setup, damage_setup },
  explosion = { explosion_setup, explosion_damage_setup },
  beam = { beam_setup, damage_setup },
  arc = { arc_setup, damage_setup },
}

function addRow(row, opts)
  local label = row[1]
  local user_key = row[2]
  local data_key = row[3] or user_key
  local value = row.literal
  local user_value = nil

  if not value then
    user_value = opts.args[user_key]
    value = opts.args[user_key] or opts.medium[data_key]
  end
  if not value then -- If value doesn"t exist we omit the table row entirely
    return ""
  end
  if not user_value then
    if row.filter and not row.filter(value, opts) then
      return ""
    end
    if row.cb then
      local newValue, newLabel = row.cb(value, opts)
      value = newValue
      if newLabel then label = newLabel end
    end
    if row.prefix then
      value = row.prefix .. " " .. value
    end
    if row.suffix then
      value = value .. " " .. row.suffix
    end
  end

  if row.header then
    -- label is header info, typically colspan=2
    -- value is text to put in header
    return "!" .. label .. "|" .. value .. row_end()
  else
    return "|" .. label .. "||" .. value .. row_end()
  end
end

function table_start(category)
  return "{| class=\"wikitable tableleftjustified Secondcolumnright table-weapon-stats attack-data-table-"
    .. category .. "\"\n"
end

function table_end()
  return "|}\n"
end

function row_end()
  return "\n|-\n"
end

function unpackTableSetup(opts)
  local out = ""

  if opts.statuses_seen and opts.medium.func1 then
    for i = 1, 4 do -- Track all statuses seen for unrolling later
      local status = opts.medium["func" .. i]
      if status > 0 then
        opts.statuses_seen[status] = true
      end
    end
  end

  for i, row in ipairs(opts.setup) do
    out = out .. addRow(row, opts)
  end
  return out
end

function getAttackTable(opts) 
  local out  = ""
  local table_setup = opts.table_setup
  local damage_table_setup = opts.damage_table_setup or damage_setup
  local attack = opts.attack
  local medium = opts.medium or data[attack.type][attack.name]
  local frame = opts.frame
  local args = opts.args

  out = out .. unpackTableSetup({
    setup = table_setup,
    attack = attack,
    medium = medium,
    frame = frame,
    args = args,
    statuses_seen = opts.statuses_seen,
  })
  if medium.damageid then
    local damage = data.damage[medium.damageid]
    out = out .. unpackTableSetup({
      setup = damage_table_setup,
      attack = attack,
      medium = damage,
      frame = frame,
      args = args,
      statuses_seen = opts.statuses_seen,
    })
  end
  return out
end

function p.attackDataTemplate(frame)
    local args = getArgs(frame, {
      removeBlanks = false,
    })

    local weapon_name = args[1]
    local weapon =  data.weapon[weapon_name]
    local statuses_seen = {}
    if not weapon then
      return "Weapon not found: \"" .. weapon_name .. "\""
    end
    local out = ""

    local weapon_table = getAttackTable({
      table_setup = weapon_setup,
      medium = weapon,
      frame = frame,
      args = args,
      statuses_seen = statuses_seen,
    })

    local attack_rows = ""
    
    local attacks = {}
    local j = 0
    local attack_index = 0 -- For placing the header "Attacks"
    for _, attack in ipairs(weapon.attacks or {}) do
      j = j + 1
      attacks[j] = attack
      if attack.type == "weapon" then
        local subweapon = data[attack.type][attack.name]
        for _, subattack in ipairs(subweapon.attacks or {}) do
          j = j + 1
          attacks[j] = subattack
        end
        attack_index = j
      end
    end

    if attacks[1] and attacks[1].type == "weapon" then
      attack_rows = attack_rows .. "!colspan=2|Weapons" .. row_end()
    end

    for i, attack in ipairs(attacks) do
      if i == attack_index + 1 then
        attack_rows = attack_rows .. "!colspan=2|Attacks" .. row_end()
      end

      local medium = data[attack.type][attack.name]
      local name = medium.fullname or medium.name or ""
      local override_table = args["override_table_" .. i]
      local override_attack = args["override_attack_" .. i]
      local attack_type_name = attack_type[attack.type]

      local attack_row = "|" .. name .. "||" .. attack_type_name
      if override_attack then
        attack_row = "|" .. override_attack
      elseif attack.count then
        attack_row = attack_row .. " x " .. attack.count
      end

      if override_table then
        out = out .. override_table .. "\n"
        attack_rows = attack_rows .. attack_row .. row_end()
      else
        local setup_config = table_setups[attack.type]
        if attack.type == "weapon" then
          args[1] = attack.name
        end
        local attack_table = getAttackTable({
          table_setup = setup_config[1],
          damage_table_setup = setup_config[2],
          attack = attack,
          medium = medium,
          frame = frame,
          args = args,
          statuses_seen = statuses_seen,
        })

        if attack.type == "damage" then
          attack_table = "!colspan=2|"
            .. medium.name
            .. row_end()
            .. attack_table
        end

        if attack.type == "weapon" then
          attack_rows = attack_rows .. attack_table
        else
          attack_rows = attack_rows .. attack_row .. row_end()
          out = out
            .. table_start(attack.type)
            .. attack_table
            .. table_end()
        end
      end
    end

    for status, _ in pairs(statuses_seen) do
      local dps_name = status_damages[status]
      if dps_name then
        j = j + 1
        local override_table = args["override_table_" .. j]
        if override_table then
          out = out .. override_table
        else
          local dps = data.damage[dps_name]
          args["damage_name"] = dps.name
          local attack_table = getAttackTable({
            table_setup = damage_setup,
            medium = dps,
            frame = frame,
            args = args,
          })
          out = out
            .. table_start("damage")
            .. attack_table
            .. table_end()
        end
      end
    end

    out = table_start("weapon")
      .. weapon_table
      .. attack_rows
      .. table_end()
      .. out

    return "<div class=\"flextablediv\">\n" .. out .. "\n</div>"
end

function p.subAttackTemplate(frame)
  local args = getArgs(frame, {
    removeBlanks = false,
    wrappers = "Template:Attack_Data/attack",
  })
  local scope = args[1]
  local name = args[2]
  if not scope then
    return "No type supplied"
  end
  if not name then
    return "No name supplied"
  end

  local setup_config = table_setups[scope]
  if not setup_config then
    return "Type not supported: \"" .. args .. "\""
  end

  local medium = data[scope][name]
  if not medium then
    medium = {}
    args[1] = name
    if scope == "damage" then
      args["damage_name"] = name
    end
  end

  if scope == "damage" and not args["damage_name"] then
    args["damage_name"] = medium.name
  end

  local attack_table = getAttackTable({
    table_setup = setup_config[1],
    damage_table_setup = setup_config[2],
    medium = medium,
    frame = frame,
    args = args,
  })

  return table_start(scope) .. attack_table .. table_end()
end

local weapon_category_pages = {
  ["Assault Rifle"] = "Assault Rifles",
  ["Shotgun"] = "Shotguns",
  ["Marksman Rifle"] = "Marksman Rifles",
  ["Submachine Gun"] = "Submachine Guns",
  ["Explosive"] = "Explosive",
  ["Energy-Based"] = "Energy-Based",
  ["Pistol"] = "Pistols",
  ["Support Weapon"] = "Support Weapons",
}

function p.fullWeaponTable(frame)
  local args = getArgs(frame, {
    wrappers = 'Template:Damage_Comparison_Table',
  })
  local out = ""
  local ordered = {}
  local names = data.weapon_order
  local rows = {}

  for i, name in ipairs(names) do
    local override = args["override_" .. string.gsub(name, " ", "_")]
    if override then
      rows[i] = "|" .. override
    else
      local weapon = data.weapon[name]
      local max_ap = 0
      local dmg = 0
      local dmg2 = 0
      local projectile_type = "Projectile"
      local special

      local modes = {}
      for _, mode in pairs(weapon.modes or {}) do
        modes[mode] = "X"
      end
      for _, mode in pairs(weapon.tags or {}) do
        modes[mode] = "X"
      end

      for _, attack in ipairs(weapon.attacks or {}) do
        local medium = data[attack.type][attack.name]

        if attack.type == "beam" then
          projectile_type = "Beam"
        elseif attack.type == "arc" then
          projectile_type = "Arc"
        elseif medium.pellets and medium.pellets > 1 then
          projectile_type = "Scatter x " .. medium.pellets
        end

        local damage = medium
        local count = (attack.count or 1) * (medium.pellets or 1)
        if medium.damageid then
          damage = data.damage[medium.damageid]
        end

        if damage.ap1 and damage.ap1 > max_ap then
          max_ap = damage.ap1
        end

        if damage.status_name and attack.type ~= "beam" then
          special = damage.status_name
        end

        if not special and attack.type == "explosion" then
          special =  "AoE (" .. medium.r1 .. "-" .. medium.r2 .. "m)"
        end

        if name == "RL-77 Airburst Rocket Launcher" then
          special = "Clusters"
        end

        if modes["lock"] then
          special = "Lock-On"
        end

        if modes["overcharge"] then
          special = "Overcharge"
        elseif modes["charge"] then
          special = "Charge-up"
        end

        dmg = dmg + count * (damage.dmg or 0) dmg2 = dmg2 + count * (damage.dmg2 or 0)
      end

      local category = weapon.category
      local category_page = weapon_category_pages[category]

      local dps
      if dmg and weapon.rpm then
        dps = math.floor(dmg * weapon.rpm / 60)
      end

      local cap = weapon.cap
      if weapon.limit then
        cap = weapon.limit .. " Seconds"
      end
      if not cap then
        cap = "Infinite"
      end

      local mags = weapon.mags
      if weapon.clips then
        mags = weapon.clips .. " Clips"
      end
      if weapon.rounds then
        mags = weapon.rounds .. " Rounds"
      end
      if not mags then
        mags = "Infinite"
      end

      local scopes = weapon.scopes or {}
      local zooms = {}
      for i, scope in ipairs(weapon.scopes or {}) do
        zooms[i] = scope .. "m"
      end

      rows[i] = "|" .. table.concat({
        "[[" .. name .. "]]",
        "[[:Category:" .. category_page .. "|" .. category .. "]]",
        dmg,
        dmg2,
        weapon.rpm or "",
        dps or "",
        weapon.reload or "",
        cap,
        mags,
        weapon.recoil or "",
        special or "",
        projectile_type,
        frame:expandTemplate({ title = "Armor", args = { max_ap, "AP" } }),
        modes.semi or modes.charge or "",
        modes.burst2 or modes.burst3 or "",
        modes.auto or "",
        modes["1h"] or "",
        zooms[1] or "",
        zooms[2] or "",
        zooms[3] or "",
      }, "||")
    end
  end
  return table.concat(rows, "\n|-\n")
end

function getTotalDamage(weapon)
  local total = 0
  for _, attack in ipairs(weapon.attacks or {}) do
    local obj = data[attack.type][attack.name]
    local damage = data.damage[obj.damage_name]
    if attack.type == "damage" then
      damage = obj
    end
    if damage then
      total = total + damage.dmg * (obj.pellets or 1) * (attack.count or 1)
    end
  end
  return total
end

local getters = {
  total_damage = getTotalDamage,
  max_ap = function(weapon)
    local max = 0
    for _, attack in ipairs(weapon.attacks or {}) do
      local obj = data[attack.type][attack.name]
      local damage = data.damage[obj.damage_name]
      if attack.type == "damage" then
        damage = obj
      end
      if damage and damage.ap1 > max then
        max = damage.ap1
      end
    end
    return max
  end,
  capacity = function(weapon)
    return weapon.cap
  end,
  recoil = function(weapon)
    return weapon.recoil
  end,
  dps = function(weapon)
    if not weapon.rpm then
      return ""
    end
    if not weapon.cap or weapon.cap < 2 then
      return ""
    end
    return math.floor(getTotalDamage(weapon) * weapon.rpm / 60)
  end,
  fire_rate = function(weapon)
    if weapon.chargeearly then
      return math.floor(60 / weapon.chargeearly)
    end
    if weapon.charge then
      return math.floor(60 / weapon.charge)
    end
    return weapon.rpm
  end,
  spare_ammo = function(weapon)
    if weapon.rounds then
      return weapon.rounds .. " Rounds"
    end
    if weapon.clips then
      return weapon.clips .. " Clips"
    end
    if weapon.mags then
      return weapon.mags .. " Magazines"
    end
  end,
}

function p.get(frame)
  local PAGENAME = mw.title.getCurrentTitle().prefixedText
  local args = getArgs(frame, { removeBlanks = false })
  local property = args[1]
  local weapon = data.weapon[PAGENAME]
  if not weapon then
    return "" -- Omit error message. It looks bad if exposed to users.
  end
  local getter = getters[property]
  if not getter then
    return "" -- Omit error message. It looks bad if exposed to users.
  end
  return getter(weapon)
end

return p
