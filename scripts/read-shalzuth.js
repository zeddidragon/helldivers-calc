import fs from 'fs/promises'
import path from 'path'
import json from 'json-stringify-pretty-compact'
import JSON from 'node-json-bigint'
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
  const json = JSON.parse(body)
  dataCache[resolved] = json
  return json
}

function copy(props, opts) {
  return function copyProps(dest, source) {
    for(const prop of props) {
      const v = source[prop]
      if(v == null) { continue }
      if(opts?.omit_falsey && !v) { continue }
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
  'ammo_types.primary_projectile_type': (wpn, value, key) => {
    wpn.customizations.ammo_types = {
      primary_projectile_type: refs.projectile(value),
    }
  },
  'ammo_types.alternate_projectile_type': (wpn, value, key) => {
    wpn.customizations.ammo_types.alternate_projectile_type = refs.projectile(value)
  },
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
  'projectile_type': (wpn, value, key) => {
    wpn.customizations[key] = refs.projectile(value)
  },
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
  'override_melee_ability': null,
  'lunge_range': null,
}

let isPendingEntity = false
const entityWhitelist = new Set()
const entityBlacklist = new Set()
const componentWhitelist = []
const componentBlacklist = []

function deferEntity(entity) {
  entity = BigInt(entity)
  if(entityWhitelist.has(entity)) {
    return
  }
  entityWhitelist.add(entity)
  isPendingEntity = true
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
  UnitCustomizationComponent: null,
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
      'rounds_per_minute',
      'heat_buildup',
      'num_low_ammo_rounds',
      'spinup_time',
      'silenced',
      'burst_fire_rate',
      'infinite_ammo',
    ], { omit_falsey: true })(wpn, component)
    wpn.projectile_type = refs.projectile(component.projectile_type)
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
  ], { omit_falsey: true }),
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
      if(!delta) {
        console.log({ change })
      }
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
  SprayWeaponComponent(wpn, component) {
    copy([
      'warmup_time',
      'cooldown_time',
      'spray_capsule_radius',
      'ammo_cost',
    ])(wpn, component)
    wpn.projectile = refs.projectile(component.projectile_type)
    const damage = refs.damage(component.damage_info_type)
    if(damage) {
      wpn.damage_type = damage
    }
  },
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
    ], { omit_falsey: true })(wpn, component)
    if(component.explosion_damage_multiplier !== 1) {
      wpn.explosion_damage_multiplier = component.explosion_damage_multiplier
    }
    copy([
      'armor',
    ])(wpn, component.default_damageable_zone_info || {})
    if(component.can_die_naturally !== 1) {
      wpn.can_die_naturally = component.can_die_naturally
    }
  },
  TargetingComponent: copy([
    'aim_drag',
    'aim_flinch_decrease',
    'aim_flinch_max',
    'use_high_arc',
  ], { omit_falsey: true }),
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
  WeaponChargeComponent(wpn, component) {
    const multis = component.projectile_multipliers
    const length = component.charge_state_settings.length - 1
    const minDmg = multis.damage_multiplier_min
    const maxDmg = multis.damage_multiplier_overcharge
    const { projectile_multipliers: bounds } = component
    function tween(prop, step, length) {
      switch(step) {
        case 0: return +multis[`${prop}_min`].toFixed(2)
        case 2: return +multis[`${prop}_overcharge`].toFixed(2)
        default: return 1
      }
    }
    wpn.charges = component.charge_state_settings
      .map((charge, i) => {
        return {
          time: +charge.charge_time.toFixed(2),
          projectile_type: refs.projectile(charge.projectile_type),
          speed: tween('speed_multiplier', i, length),
          damage: tween('damage_multiplier', i, length),
          penetration: tween('penetration_multiplier', i, length),
          arcs: tween('extra_arc_splits', i, length),
          chains: tween('extra_arc_chains', i, length),
        }
      })
      .filter((charge, i, arr) => {
        return charge.time !== arr[i + 1]?.time
      })
  },
  AbilityDamageZoneComponent: null,
  VisibilityComponent: null,
  WeaponWindUpComponent: copy([
    'wind_up_time',
    'wind_down_time',
    'rpm_multiplier',
  ]),
  VehicleCollisionInfoComponent: null,
  DamageOwnerComponent: null,
  HellpodComponent: null,
  HellpodPayloadComponent: copy([
    'remove_time',
  ]),
  HellpodRackComponent(wpn, component) {
    const racked = component
      .payloads
      .filter(pl => pl.rack_side !== 'RackSide_None' && pl.item)
      .map(pl => pl.item.toString())
    wpn.racked = Array.from(new Set(racked))
    for(const id of racked) {
      deferEntity(id)
    }
  },
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
  MountComponent(wpn, component) {
    wpn.mounts = component.infos
      .filter(info => info.path)
      .map(info => {
        return {
          id: info.path,
          side: refs.mount(info.mount_side),
        }
      })
    for(const mount of wpn.mounts) {
      deferEntity(mount.id)
    }
  },
  IdleAbilityComponent: null,
  OverlapDamageComponent: null,
  SyncedHealthComponent: null,
  EagleComponent(wpn, component) {
    copy([
      'payload',
      'airstrike_pattern',
      'target_angle',
      'search_radius',
      'fire_duration',
      'bomb_interval',
      'bomb_prediction_interval',
    ])(wpn, component)
    wpn.projectile_type = refs.projectile(component.projectile_type)
    wpn.airstrike_pattern = refs.airstrike(component.airstrike_pattern)
  },
  WeaponLaserComponent: copy([
    'max_length',
  ]),
  WeaponRoundsComponent(wpn, component) {
    copy([
      'magazine_capacity',
      'ammo_capacity',
      'ammo_refill',
      'ammo',
      'reload_amount',
      'chambered',
      'infinite_ammo',
    ], { omit_falsey: true })(wpn, component)
    const ammo = component.ammo_types
    wpn.ammo_types = {
      primary_projectile_type: refs.projectile(ammo.primary_projectile_type),
      alternate_projectile_type: refs.projectile(ammo.alternate_projectile_type),
    }
  },
  BackblastComponent(wpn, component) {
    wpn.backblast_angle = component.angle
    wpn.backblast_offset = component.offset
    wpn.backblast_explosion_type = refs.explosion(component.type)
  },
  ArcWeaponComponent(wpn, component) {
    copy([
      'rounds_per_minute',
      'infinite_ammo',
    ], { omit_falsey: true })(wpn, component)
    wpn.arc_type = refs.arc(component.arc_type)
  },
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
  ], { omit_falsey: true }),
  BeamWeaponComponent(wpn, component) {
    copy([
      'scope_responsiveness',
      'noise_timer',
    ])(wpn, component)
    wpn.beam_type = refs.beam(component.beam_type)
  },
  InteractableMinigameComponent: null,
  ProspectorComponent: null,
  InteractableObjectiveTerminalComponent: null,
  AbilityWeaponComponent: null,
  WeaponAssistedReloadComponent: copy([
    'interpolation_speed_aim',
    'interpolation_speed_firing',
    'reload_amount',
    'reload_cost',
  ], { omit_falsey: true }),
  LaserDesignatorComponent: null,
  MultiTargetComponent: null,
  RotationSoundPlayerComponent: null,
  SeatCollectionComponent: null,
  GuidanceTargetComponent: null,
  WeaponLinkerComponent: null,
  ThrowableComponent(wpn, component) {
    copy([
      'throw_distance_min',
      'throw_distance_max',
      'use_angular_velocity',
      'sticky',
      'sticky_delay',
      'is_impact_trigger',
      'start_amount',
      'max_amount',
      'refill_amount',
    ], { omit_falsey: true })(wpn, component)
    wpn.on_stick_damage_type = refs.damage(component.on_stick_damage_type)
  },
  ExplosiveComponent(wpn, component) {
    wpn.explosion_type = refs.explosion(component.explosion_type)
  },
  DamagePropagatorComponent: null,
  PowerGeneratedComponent: null,
  PhysicsWeaponComponent: null,
  StratagemBlockerComponent: copy([
    'category_type',
    'block_radius',
  ]),
  BombardmentComponent(wpn, component) {
    copy([
      'bomb_interval',
      'salvo_interval',
      'area_size',
    ])(wpn, component)
    if(component.num_salvos > 1) {
      wpn.salvos = component.num_salvos
    }
    if(component.num_bombs > 1) {
      wpn.cap = component.num_bombs
    }
    wpn.projectile_type = refs.projectile(component.projectile_types[0])
  },
  ThrowerComponent(wpn, component) {
    copy([
      'panel_count',
      'throwable_count',
      'throw_delay',
      'throw_duration',
    ])(wpn, component)
  },
  MinefieldComponent(wpn, component) {
    wpn.explosion_type = refs.explosion(component.explosion_type)
  },
  StratagemFiresupportComponent: null,
  DangerWarningComponent: null,
  SensorProximityComponent: null,
  RemoteTriggerComponent: null,
  StratagemBallComponent: null,
  TransportComponent: null,
  ObjectiveCarryDeliveryComponent: null,
  ObjectiveDynamicLinkComponent: null,
  MinigameWaitComponent: null,
  FastMotionComponent: null,
  CorpseDecayerComponent: null,
  VehicleComponent: copy([
    'initial_fuel',
    'idle_fuel_usage',
    'max_fuel_usage',
    'damaged_fuel_usage',
  ]),
  VehicleShuttleComponent: null,
  VehicleMotionComponent: null,
  WeatheringComponent: null,
  VehicleCollisionDamageComponent: null,
  BoidsComponent: null,
  ThrusterGroupComponent: null,
  LoopingSurfaceEffectsComponent: null,
  RagdollForcerComponent: null,
  MotionComponent: null,
  OrbitalAbilityComponent(wpn, component) {
    copy([
      'search_radius',
    ])(wpn, component)
    wpn.limit = component.duration
    wpn.projectile_type = refs.projectile(component.projectile_type)
    if(component.damage_dealer_zone) {
      wpn.damage_type = refs.damage(component
        .damage_dealer_zone
        .damage_info_type)
    }
  },
  DepositComponent(wpn, component) {
    copy([
      'capacity',
      'start_amount',
      'refill_amount',
    ])(wpn, component)
    if(component.drone_path) {
      wpn.drone_path = component.drone_path
      deferEntity(wpn.drone_path)
    }
  },
  ObjectiveSecureAreaComponent: null,
  NoiseComponent: null,
  VehicleElectricsComponent: null,
  FoleySoundComponent: null,
  DrownableComponent: null,
  VehicleCrashComponent: null,
  FootstepEventComponent: null,
  RotationComponent: null,
  LocomotionComponent: null,
  VehicleLocomotionComponent: null,
  FakeGravityMotionComponent: null,
  ObjectiveShuttleControllerComponent: null,
  BowlingBallComponent: null,
  LandingZoneBeaconComponent: null,
  StatusEffectVolumeComponent: null,
  ShieldComponent(wpn, component) {
    wpn.shield = component.charge
    wpn.shieldregen = component.recharge_rate
    wpn.shielddelay = +component.recharge_delay.toFixed(2)
    wpn.shieldbreakdelay = component.broken_recharge_delay
    wpn.shieldradius = +component.radius.toFixed(2)
  },
  ReinforcementLocationComponent: null,
  SosComponent: null,
  StoryInteractableComponent: null,
  NpcDialogueComponent: null,
  CharacterVoiceComponent: null,
  CharacterNameComponent: null,
  KeypadCodeRevealComponent: null,
  ObjectiveCarryComponent: null,
  RechargeComponent: copy([
    'recharge_time',
  ]),
  MaterialSwapComponent: null,
  JumppackComponent: null,
  SeekingMissileComponent: null,
}

async function loadComponents({
  EntityComponentMap,
  ComponentType,
  weapons,
}) {
  isPendingEntity = false
  for(let [id, componentIds] of Object.entries(EntityComponentMap)) {
    id = BigInt(id)
    if(entityBlacklist.has(id)) {
      continue
    }
    let isValid = entityWhitelist.has(id)
    for(let whitelistId of componentWhitelist) {
      if(isValid) {
        break
      }
      isValid = componentIds.includes(whitelistId)
    }
    for(let blacklistId of componentBlacklist) {
      if(!isValid) {
        break
      }
      isValid = !componentIds.includes(blacklistId)
    }
    if(!isValid) {
      continue
    }

    const obj = { id: id.toString() }
    for(const cId of componentIds) {
      const componentName = ComponentType[cId]
      const handler = handlers[componentName]
      if(handler === null) continue
      const dataPath = `entities/${componentName}Data`
      const data = await readJson(dataDir, dataPath).catch(() => {})
      if(!handler) {
        console.log(data?.[id])
        clipboard.writeSync(`  ${componentName}: null,`)
        throw new Error(`Handler not implemented: "${componentName}"`)
      }
      handler(obj, data[id])
    }
    weapons[id] = obj

    entityBlacklist.add(id)
  }
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

  componentWhitelist.push(WeaponComponent)
  componentWhitelist.push(ThrowableComponent)
  componentBlacklist.push(AiEnemyComponent)
  const componentsData = {
    EntityComponentMap,
    ComponentType,
    weapons,
  }
  while(isPendingEntity) {
    await loadComponents(componentsData)
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
  stratagem: ref('StratagemType'),
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
  stratCategory: ref('StratagemCategoryType'),
  stratButton: ref('StratagemButtonDirection'),
  airstrike: ref('EagleAirstrikePattern'),
  mount: ref('MountSide'),
}

const StratagemMaxUse = Math.pow(2, 32) - 1

function readTypeStratagem(item) {
  let uses = item.uses
  if(uses === StratagemMaxUse) {
    uses = void 0
  }
  for(const id of item.payload) {
    deferEntity(id)
  }
  return {
    ref: refs.stratagem(item.type),
    name: english[item.name_cased],
    category: refs.stratCategory(item.category),
    uses,
    stratcode: item.button_combination.map(refs.stratButton),
    calltime: float(item.spawn_time),
    radius: float(item.spawn_radius) || void 0,
    cooldown: float(item.cooldown_duration_success),
    weaponid: item.matching_support_weapon || void 0,
    payload: item.payload.filter(id => id > 0).map(p => p.toString()),
  }
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
    xangle: float(item.explosion_threshold_angle),
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
    damageref: refs.damage(item.damage_info_type), }
}

const types = {
  stratagem: readTypeStratagem,
  damage: readTypeDamage,
  projectile: readTypeProjectile,
  explosion: readTypeExplosion,
  beam: readTypeBeam,
  arc: readTypeArc,
  status_effect: readTypeStatus,
}

async function readType(type) {
  const path = `settings/generated_${type}_settings`
  const cb = types[type]
  const data = await readJson(dataDir, path)
  const prop = type.split(/_/g)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('')
    + 'Settings'
  const items = data
    .filter(obj => obj[prop])
    .flatMap(obj => obj[prop].items)
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
  const data = {}
  for(const [key, cb] of Object.entries(types)) {
    data[key] = await readType(key)
  }
  data.elements = await readEnum('Element')
  await fs.writeFile('data/datamined.json', JSON.stringify({
    ...data,
  }, null, 2))
  return data
}

async function readShalzuth() {
  english = await readJson(dataDir, 'translations/English')
  await readTypes()
  await readEntities()
}

readShalzuth()
  .catch(console.error)
  .then(() => process.exit(0))
