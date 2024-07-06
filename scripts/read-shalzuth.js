import fs from 'fs/promises'
import path from 'path'
import json from 'json-stringify-pretty-compact'
import clipboard from 'clipboardy'

const dataDir = '../HelldiversData/data'
const dataCache = {}
let english = {}

async function readJson(...fpath) {
  const resolved = path.resolve(...fpath)
  const cached = dataCache[resolved]
  if(cached) {
    return cached
  }
  const body = await fs.readFile(path.resolve(...fpath))
  const json = JSON.parse(body)
  dataCache[resolved] = json
  return json
}

const AMR = 9927421484392399367

function copy(props) {
  if(Array.isArray(props)) {
  }
  return function copyProps(dest, source) {
    for(const prop of props) {
      const v = source[prop]
      if(!v) { continue }
      dest[prop] = v
    }
  }
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
    let isBurst = false
    wpn.fire_modes = [
      component.primary_fire_mode,
      component.secondary_fire_mode,
      component.tertiary_fire_mode,
    ].filter(m => {
      if(m === 'FireMode_Burst') {
        isBurst = true
      }
      return m !== 'FireMode_None'
    })
    if(isBurst) {
      wpn.num_burst_rounds = component.num_burst_rounds
    }
    const functions = [
      component.function_info.left,
      component.function_info.right,
    ].filter(f => f !== 'WeaponFunctionType_None')
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
    // TODO
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
    'ammo_refill',
    'ammo',
    'reload_amount',
    'chambered',
    'infinite_ammo',
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
}

function hex(v) {
  return `0x${v.toString(16)}`
}

async function readShalzuth() {
  english = await readJson(dataDir, 'translations/English.json')
  const ComponentType = await readJson(dataDir, 'enums/ComponentType.json')
    .then(data => {
      const firstComponentIdx = data.ComponentType
        .findIndex(type => type.endsWith('Component'))
      return data.ComponentType.slice(firstComponentIdx)
    }) // Magic offset
  const EntityComponentMap = await readJson(dataDir, 'entities/EntityComponentMap.json')
  const WeaponComponent = ComponentType.indexOf('WeaponComponent')
  const AiEnemyComponent = ComponentType.indexOf('AiEnemyComponent')
  const weapons = {}
  const componentSetup = Object.entries(EntityComponentMap)
    .filter(([, componentIds]) => componentIds.includes(WeaponComponent))
    .filter(([, componentIds]) => !componentIds.includes(AiEnemyComponent))
  for(const [id, componentIds] of componentSetup) {
    const obj = { id: hex(+id) }
    for(const cId of componentIds) {
      const componentName = ComponentType[cId]
      const handler = handlers[componentName]
      if(handler === null) continue
      const dataPath = `entities/${componentName}Data.json`
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

  return byName
}

readShalzuth()
  .then(console.log)
  .catch(console.error)
  .then(() => process.exit(0))
