import fs from 'fs/promises'
import path from 'path'
import json from 'json-stringify-pretty-compact'
import clipboard from 'clipboardy'

const dataDir = '../HelldiversData/data'
const dataCache = {}
let english = {}
let EntityDeltas = {}
const WeaponCustomizations = {}

async function readJson(...fpath) {
  const resolved = path.resolve(...fpath)
  const cached = dataCache[resolved]
  if(cached) {
    return cached
  }
  let body = await fs.readFile(resolved + '.json', 'utf8')
  body = body.replace(/:\s*(\d{15,})(\n|,)/g, (match, v, end) => {
    return `:"${v}"${end}`
  })
  const json = JSON.parse(body)
  dataCache[resolved] = json
  return json
}

function copy(props) {
  return function copyProps(dest, source) {
    for(const prop of props) {
      const v = source[prop]
      if(v == null) { continue }
      dest[prop] = v
    }
  }
}

function deltaStatModifier(i) {
  return function deltaModifier(wpn, type, key, deltas) {
    const value = deltas[`weapon_stat_modifiers[${i}].value`]
    if(type === 'WeaponStatModifierType_Count' && !value) {
      return
    }
    wpn.modifiers.push({
      type: type.replace('WeaponStatModifier_', ''),
      value,
    })
  }
}

function toDelta(wpn, value, key) {
  wpn.customizations[key] = value
}

function float(v) {
  return v && +(v.toFixed(2))
}

const deltaHandlers = {
  'scope_offset.x': null,
  'scope_offset.y': null,
  'scope_offset.z': null,
  'aim_zoom.x': null,
  'aim_zoom.y': null,
  'aim_zoom.z': null,
  'optics_path':  null,
  'optics_crosshair_params.x': null,
  'optics_crosshair_params.y': null,
  'weapon_stat_modifiers[0].type': deltaStatModifier(0),
  'weapon_stat_modifiers[1].type': deltaStatModifier(1),
  'weapon_stat_modifiers[2].type': deltaStatModifier(2),
  'weapon_stat_modifiers[3].type': deltaStatModifier(3),
  'weapon_stat_modifiers[4].type': deltaStatModifier(4),
  'weapon_stat_modifiers[5].type': deltaStatModifier(5),
  'weapon_stat_modifiers[6].type': deltaStatModifier(6),
  'weapon_stat_modifiers[7].type': deltaStatModifier(7),
  'weapon_stat_modifiers[0].value': null,
  'weapon_stat_modifiers[1].value': null,
  'weapon_stat_modifiers[2].value': null,
  'weapon_stat_modifiers[3].value': null,
  'weapon_stat_modifiers[4].value': null,
  'weapon_stat_modifiers[5].value': null,
  'weapon_stat_modifiers[6].value': null,
  'weapon_stat_modifiers[7].value': null,
  'magazine_path': null,
  'magazine_capacity': toDelta,
  'magazines': toDelta,
  'magazines_refill': toDelta,
  'magazines_max': toDelta,
  'chambered': toDelta,
  'underbarrel_path': null,
  'ammo_types.primary_projectile_type': toDelta,
  'scope_zeroing.x': null,
  'scope_zeroing.y': null,
  'scope_zeroing.z': null,
  'scope_lens_hides_weapon': null,
  'duration': (wpn, v) => wpn.customizations.reload = v,
  'reload_anim_events[0].type': null,
  'reload_anim_events[1].type': null,
  'reload_anim_events[2].type': null,
  'reload_anim_events[3].type': null,
  'reload_anim_events[0].animation_event_weapon': null,
  'reload_anim_events[1].animation_event_weapon': null,
  'reload_anim_events[2].animation_event_weapon': null,
  'reload_anim_events[3].animation_event_weapon': null,
  'reload_anim_events[0].animation_event_wielder': null,
  'reload_anim_events[1].animation_event_wielder': null,
  'reload_anim_events[2].animation_event_wielder': null,
  'reload_anim_events[3].animation_event_wielder': null,
  'projectile_type': toDelta,
  'magazine_adjusting_nodes[0]': null,
  'magazine_adjusting_nodes[1]': null,
  'magazine_adjusting_nodes[2]': null,
  'magazine_adjusting_nodes[3]': null,
  'magazine_adjusting_nodes[4]': null,
  'magazine_adjusting_nodes[5]': null,
  'magazine_adjusting_nodes[6]': null,
  'magazine_adjusting_nodes[7]': null,
  'magazine_adjusting_nodes[8]': null,
  'magazine_adjusting_nodes[9]': null,
  'magazine_adjusting_nodes[10]': null,
  'magazine_adjusting_nodes[11]': null,
  'magazine_adjusting_nodes[12]': null,
  'magazine_adjusting_nodes[13]': null,
  'magazine_adjusting_nodes[14]': null,
  'magazine_adjusting_nodes[15]': null,
  'magazine_adjusting_nodes[16]': null,
  'magazine_adjusting_nodes[17]': null,
  'magazine_adjusting_nodes[18]': null,
  'magazine_adjusting_nodes[19]': null,
  'magazine_adjusting_nodes_visible_chambering': null,
  'magazine_adjusting_animation': null,
  'magazine_adjusting_animation_variable': null,
  'muzzle_path': null,
  'muzzle_flash': null,
  'beam_type': toDelta,
  'scope_crosshair.x': null,
  'scope_crosshair.y': null,
  'scope_crosshair.z': null,
  'fire_source_node': null,
  'fire_loop_start_audio_event': null,
  'fire_loop_stop_audio_event': null,
  'on_fire_started_wielder_anim_event': null,
  'on_fire_stopped_wielder_anim_event': null,
  'reload_allow_move': toDelta,
  'trigger_settings.trigger_threshold': null,
  'trigger_settings.trigger_threshold_release': null,
  'trigger_settings.resistance_strength_start': null,
  'trigger_settings.resistance_strength_end': null,
  'ability': null,
  'material_override.material_path': null,
  'material_override.material_slot': null,
}

const handlers = {
  WeaponMagazineComponent: copy([
    'magazine_capacity',
    'chambered',
    'magazines',
    'magazines_refill',
    'magazines_max',
  ]),
  UnitComponent: null,
  WieldableComponent: null,
  WeaponReloadComponent(wpn, component) {
    if(component.duration) {
      wpn.reload = component.duration
    }
  },
  WeaponDataComponent(wpn, component) {
    copy([
      'recoil_info',
      'spread_info',
      'zeroing_slots',
      'noise_template',
      'scope_responsiveness',
      'ergonomics',
      'infinite_ammo',
    ])(wpn, component)
    if(component.sway_multiplier !== 1) {
      wpn.sway_multiplier = component.sway_multiplier
    }
    if(component.is_surpressed) {
      wpn.is_surpressed = component.is_surpressed
    }
    wpn.fire_modes = [
      component.primary_fire_mode,
      component.secondary_fire_mode,
      component.tertiary_fire_mode,
    ]
      .map(m => refs.fireMode(m))
      .filter(m => m)
    const isBurst = wpn.fire_modes.some(m => m === 'Burst')
    if(isBurst) {
      wpn.num_burst_rounds = component.num_burst_rounds
    }
    const functions = [
      component.function_info.left,
      component.function_info.right,
    ] .map(f => refs.weaponFunction(f))
      .filter(f => f)
    if(functions) {
      wpn.function_info = functions
    }
  },
  AttachableComponent: null,
  ProjectileWeaponComponent(wpn, component) {
    copy([
      'projectile_type',
      'rounds_per_minute',
      'heat_buildup',
      'num_low_ammo_rounds',
      'spinup_time',
      'silenced',
      'burst_fire_rate',
      'infinite_ammo',
    ])(wpn, component)
    const projectile = refs.projectile(component.projectile_type)
    if(projectile) {
      wpn.projectile_type = projectile
    }
    if(component.speed_multiplier !== 1) {
      wpn.speed_multiplier = component.speed_multiplier
    }
  },
  WeaponComponent: null,
  NetworkOverrideComponent: null,
  StatModifierComponent: null,
  LoadoutPackageComponent: null,
  MeleeAttackComponent: null,
  EncyclopediaEntryComponent(wpn, component) {
    wpn.name = english[component.loc_name]
    if(component.prefix) {
      wpn.prefix = english[component.prefix]
    }
  },
  EntityBindComponent: null,
  CollisionEventComponent: null,
  SpottableComponent: null,
  AnimationComponent: null,
  PhysicsImpactEffectComponent: null,
  InteractableComponent: null,
  EquipmentComponent: copy([
    'holster_duration',
    'wield_duration',
    'pickup_duration',
    'equipment_type',
    'is_one_handed',
  ]),
  WeaponCustomizationComponent(wpn, component) {
    const changes = component
      .default_customizations
      .filter(({ customization }) => customization)
    if(!changes.length) {
      return
    }
    wpn.customizations ||= {}
    wpn.modifiers ||= []
    for(const { slot, customization } of changes) {
      const change = WeaponCustomizations[customization]
      if(!change?.add_path) {
        continue
      }
      const delta = EntityDeltas[change?.add_path]
      for(const [k, v] of Object.entries(delta)) {
        const handler = deltaHandlers[k]
        if(handler === null) continue
        if(!handler) {
          clipboard.writeSync(`  '${k}': null,`)
          console.log({ wpn, v, k, delta, slot })
          throw new Error(`Handler not implemented: "${k}"`)
        }
        handler(wpn, v, k, delta)
      }
    }
  },
  AbilityComponent: null,
  NetworkPhysicsComponent: null,
  SprayWeaponComponent: copy([
    'warmup_time',
    'cooldown_time',
    'spray_capsule_radius',
    'ammo_cost',
    'projectile_type',
    'damage_info_type',
  ]),
  TagComponent: null,
  StaticRotationComponent: null,
  HitEffectComponent: null,
  AiJobComponent: null,
  StaticPositionComponent: null,
  FactionComponent: null,
  EffectReferenceComponent: null,
  VisibilityMaskComponent: null,
  SensorDangerComponent: null,
  AiAlertComponent: null,
  SensorEarComponent: null,
  HealthComponent(wpn, component) {
    copy([
      'health',
      'health_changerate',
      'health_changerate_disabled',
      'require_demolition',
    ])(wpn, component)
    if(component.explosion_damage_multiplier !== 1) {
      wpn.explosion_damage_multiplier = component.explosion_damage_multiplier
    }
    copy([
      'armor',
    ])(wpn, component.default_damagable_zone_info || {})
    if(component.can_die_naturally !== 1) {
      wpn.can_die_naturally = component.can_die_naturally
    }
  },
  TargetingComponent: copy([
    'aim_drag',
    'aim_flinch_decrease',
    'aim_flinch_max',
    'use_high_arc',
  ]),
  WeaponWielderComponent(wpn, component) {
    copy([
      'aim_interpolation_speed',
      `sway_multiplier`,
      `sway_frequency_multiplier`,
    ])(wpn, component)
    if(component.recoil_multiplier !== 1 && component.recoil_multiplier !== 0) {
      wpn.recoil_multiplier = component.recoil_multiplier
    }
  },
  TurretComponent: copy([
    'turn_speed_vertical',
    `turn_speed_horizontal`,
    `vertical_limit_min`,
    `vertical_limit_max`,
  ]),
  DetectorComponent: null,
  BehaviorComponent: null,
  StaticSimpleMoverComponent: null,
  LoadoutEntryComponent: copy([
    'type',
  ]),
  WeaponChargeComponent: copy([
    'charge_state_settings',
    'projectile_multipliers',
  ]),
  AbilityDamageZoneComponent: null,
  VisibilityComponent: null,
  WeaponWindUpComponent: copy([
    'wind_up_time',
    'wind_down_time',
    'rpm_multiplier',
  ]),
  VehicleCollisionInfoComponent: null,
  DamageOwnerComponent: null,
  HellpodPayloadComponent: copy([
    'remove_time',
  ]),
  HintTriggerComponent: null,
  SensorEyeComponent: copy([
    'distance',
  ]),
  DestructibleComponent: null,
  StatusEffectReceiverComponent: null,
  GoreComponent: null,
  MusicIntensifierComponent: null,
  AiSquadMemberComponent: null,
  EnemyPackageComponent: null,
  WoundableComponent: null,
  RagdollSyncComponent: null,
  TrampleComponent: null,
  MaterialVariablesComponent: null,
  HitReactComponent: null,
  NavigationComponent: null,
  GroundCheckComponent: null,
  TargetAimConstraintComponent: null,
  MountComponent: null,
  IdleAbilityComponent: null,
  OverlapDamageComponent: null,
  SyncedHealthComponent: null,
  EagleComponent: copy([
    'payload',
    'airstrike_pattern',
    'projectile_type',
    'target_angle',
    'search_radius',
    'fire_duration',
    'bomb_interval',
    'bomb_prediction_interval',
  ]),
  WeaponLaserComponent: copy([
    'max_length',
  ]),
  WeaponRoundsComponent: copy([
    'magazine_capacity',
    'ammo_capacity',
    'ammo_refill',
    'ammo',
    'reload_amount',
    'chambered',
    'infinite_ammo',
    'ammo_types',
  ]),
  BackblastComponent(wpn, component) {
    wpn.backblast_angle = component.angle
    wpn.backblast_offset = component.offset
    wpn.backblast_explosion_type = component.type
  },
  ArcWeaponComponent: copy([
    'arc_type',
    'rounds_per_minute',
    'infinite_ammo',
  ]),
  WeaponHeatComponent: copy([
    'magazines',
    'magazines_refill',
    'magazines_max',
    'overheat_temperature',
    'warning_temperature',
    'emission_temperature',
    'temp_gain_per_shot',
    'temp_gain_per_second',
    'temp_gain_per_second_modifier',
    'temp_loss_per_second',
    'temp_loss_modifier_extreme_heat',
    'temp_loss_modifier_extreme_cold',
    'needs_reload_after_overheat',
    'needs_reload_after_overheat',
    'firing_charge',
    'charge_gain_per_second',
    'charge_loss_per_second',
    'min_reload_temperature',
  ]),
  BeamWeaponComponent: copy([
    'beam_type',
    'scope_responsiveness',
    'noise_timer',
  ]),
  InteractableMinigameComponent: null,
  ProspectorComponent: null,
  InteractableObjectiveTerminalComponent: null,
  AbilityWeaponComponent: null,
  WeaponAssistedReloadComponent: copy([
    'interpolation_speed_aim',
    'interpolation_speed_firing',
    'reload_amount',
    'reload_cost',
  ]),
  LaserDesignatorComponent: null,
  MultiTargetComponent: null,
  RotationSoundPlayerComponent: null,
  SeatCollectionComponent: null,
  GuidanceTargetComponent: null,
  WeaponLinkerComponent: null,
  ThrowableComponent: copy([
    'throw_distance_min',
    'throw_distance_max',
    'use_angular_velocity',
    'sticky',
    'sticky_delay',
    'is_impact_trigger',
    'start_amount',
    'max_amount',
    'refill_amount',
    'on_stick_damage_type',
  ]),
  ExplosiveComponent: copy([
    'explosion_type',
  ]),
  DamagePropagatorComponent: null,
  PowerGeneratedComponent: null,
  PhysicsWeaponComponent: null,
  StratagemBlockerComponent: copy([
    'category_type',
    'block_radius',
  ]),
  DangerWarningComponent: null,
  SensorProximityComponent: null,
  RemoteTriggerComponent: null,
  StratagemBallComponent: null,
}

function hex(v) {
  return `0x${v.toString(16)}`
}

async function readEntities() {
  EntityDeltas = await readJson(dataDir, 'entities/EntityDeltas')
  const customizations =  await readJson(dataDir, 'settings/generated_weapon_customization_settings')
  for(const tweak of customizations
    .flatMap(c => c.WeaponCustomizationSettings.items)
  ) {
    WeaponCustomizations[tweak.id] = tweak
  }
  const ComponentType = await readJson(dataDir, 'enums/ComponentType')
    .then(data => {
      const firstComponentIdx = data.ComponentType
        .findIndex(type => type.endsWith('Component'))
      return data.ComponentType.slice(firstComponentIdx)
    }) // Magic offset
  const EntityComponentMap = await readJson(dataDir, 'entities/EntityComponentMap')
  const WeaponComponent = ComponentType.indexOf('WeaponComponent')
  const ThrowableComponent = ComponentType.indexOf('ThrowableComponent')
  const AiEnemyComponent = ComponentType.indexOf('AiEnemyComponent')
  const weapons = {}
  const componentSetup = Object.entries(EntityComponentMap)
    .filter(([, componentIds]) => {
      return componentIds.includes(WeaponComponent)
        || componentIds.includes(ThrowableComponent)
    })
    .filter(([, componentIds]) => !componentIds.includes(AiEnemyComponent))
  for(const [id, componentIds] of componentSetup) {
    const obj = { id: hex(+id) }
    for(const cId of componentIds) {
      const componentName = ComponentType[cId]
      const handler = handlers[componentName]
      if(handler === null) continue
      const dataPath = `entities/${componentName}Data`
      const data = await readJson(dataDir, dataPath)
      if(!handler) {
        console.log(data[id])
        clipboard.writeSync(`  ${componentName}: null,`)
        throw new Error(`Handler not implemented: "${componentName}"`)
      }
      handler(obj, data[id])
    }
    weapons[id] = obj
  }
  const byName = {}
  for(const wpn of Object.values(weapons)) {
    if(!wpn.name) {
      continue
    }
    const key = [
      wpn.prefix,
      wpn.name,
    ].filter(v => v).join(' ')
    wpn.key = key
    byName[key] = wpn
  }
  await fs.writeFile('data/shalzuth.json', json(weapons))
}

function ref(prefix) {
  prefix = `${prefix}_`
  return function stripref(v) {
    const type = v?.replace(prefix, '')
    if(!type || type === 'None') {
      return void 0
    }
    return type
  }
}

const refs = {
  damage: ref('DamageInfoType'),
  projectile: ref('ProjectileType'),
  explosion: ref('ExplosionType'),
  beam: ref('BeamType'),
  arc: ref('ArcType'),
  element: ref('ElementType'),
  status: ref('StatusEffectType'),
  fireMode: ref('FireMode'),
  weaponFunction: ref('WeaponFunctionType'),
  crater: ref('TerrainDeformationType'),
}

function readTypeDamage(item) {
  return {
    ref: refs.damage(item.type),
    dmg: item.damage[0],
    dmg2: item.damage[1],
    ...item.armor_penetration_per_angle.reduce((obj, ap, i) => {
      obj[`ap${i + 1}`] = ap
      return obj
    }, {}),
    demo: item.demolition_strength,
    stun: item.force_strength,
    push: item.force_impulse,
    element: refs.element(item.element_type),
    ...item.status_effects.reduce((obj, { type, value }, i) => {
      type = refs.status(type)
      if(!type) {
        return obj
      }
      obj[`status${i + 1}`] = type
      obj[`param${i + 1}`] = value
      return obj
    }, {}),
  }
}

function readTypeProjectile(item) {
  return {
    ref: refs.projectile(item.type),
    name: english[item.name_cased],
    caliber: float(item.calibre),
    pellets: item.num_projectiles,
    velocity: float(item.speed),
    mass: float(item.mass),
    drag: float(item.drag),
    gravity: float(item.gravity_multiplier),
    lifetime: float(item.life_time),
    liferandom: float(item.life_time_randomness),
    damageref: refs.damage(item.damage_info_type),
    penslow: float(item.penetration_slowdown),
    xangle: float(item.explosion_treshold_angle),
    ximpactref: refs.explosion(item.explosion_type_on_impact),
    xproximity: float(item.explosion_proximity),
    xdelay: float(item.explosion_delay),
    xdelayref: refs.explosion(item.explosion_type_expire),
  }
}

function readTypeExplosion(item) {
  return {
    ref: refs.explosion(item.type),
    damageref: refs.damage(item.damage_type),
    r1: float(item.inner_radius),
    r2: float(item.outer_radius),
    r3: float(item.stagger_radius),
    angle: float(item.cone_angle) || void 0,
    shrapnel: item.num_shrapnel_projectiles || void 0,
    shrapnelref: refs.projectile(item.shrapnel_projectile_type),
    crater: refs.crater(item.crater_type),
  }
}

function readTypeBeam(item) {
  return {
    ref: refs.beam(item.type),
    radius: float(item.radius) || void 0,
    range: float(item.length),
    damageref: refs.damage(item.damage_info_type),
  }
}

function readTypeArc(item) {
  return {
    ref: refs.arc(item.type),
    velocity: float(item.speed),
    range: float(item.distance),
    spreadrange: float(item.distance_at_max_angle_spread),
    chainangle: float(item.max_angle_spread),
    aimangle: float(item.max_angle_spread_first_shot),
    splits: float(item.max_chain_split),
    damageref: refs.damage(item.damage_info_type),
  }
}

function readTypeStatus(item) {
  return {
    ref: refs.status(item.type),
    name: item.debug_name,
    strength: float(item.strength),
    duration: float(item.duration),
    damageref: refs.damage(item.damage_info_type),
  }
}

const types = {
  damage: readTypeDamage,
  projectile: readTypeProjectile,
  explosion: readTypeExplosion,
  beam: readTypeBeam,
  arc: readTypeArc,
  status_effect: readTypeStatus,
}

async function readType(type, prop) {
  const path = `settings/generated_${type}_settings`
  const cb = types[type]
  const data = await readJson(dataDir, path)
  prop ||= type[0].toUpperCase() + type.slice(1) + 'Settings'
  const { items } = data.find(obj => obj[prop])[prop]
  const mapped = items.map(cb)
  const dict = {}
  for(const item of mapped) {
    dict[item.ref] = {
      ...item,
      ref: void 0,
    }
  }
  return dict
}

async function readEnum(prefix) {
  const type = `${prefix}Type`
  const path = `enums/${type}`
  const { [type]: items } = await readJson(dataDir, path)
  prefix = `${prefix}Type_`
  return items.slice(1).map(v => v.replace(prefix, ''))
}

async function readTypes() {
  const damage = await readType('damage')
  const projectile = await readType('projectile')
  const explosion = await readType('explosion')
  const beam = await readType('beam')
  const arc = await readType('arc')
  const status = await readType('status_effect', 'StatusEffectSettings')
  const elements = await readEnum('Element')
  await fs.writeFile('data/datamined.json', JSON.stringify({
    damage,
    projectile,
    explosion,
    beam,
    arc,
    status,
    elements,
  }, null, 2))
}

async function readShalzuth() {
  english = await readJson(dataDir, 'translations/English')
  await readTypes()
  await readEntities()
}

readShalzuth()
  .catch(console.error)
  .then(() => process.exit(0))
