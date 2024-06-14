local json = require("cjson")
mw = {}
mw.title = { getCurrentTitle }

function mw.loadData()
  local file = io.open("../data/wiki.json", "rb")
  local contents = file:read("*a")
  local data = json.decode(contents)
  file:close()
  return data
end

local getData = require("weapon-stats")

local frame = {}
function getCurrentTitle()
  return {
    prefixedText = 'AR-23A Liberator Carbine',
  }
end

mw.title = {
  getCurrentTitle = getCurrentTitle,
}

local parent = {}

function parent.getTitle()
  return "SG-8P Punisher Plasma"
end

function frame.getParent()
  return parent
end

function frame.expandTemplate(self, opts)
  return "{{"..opts.title.."|"..opts.args[1].."}}"
end

frame.args = {
  ["override_JAR-5_Dominator"] = "Jar-5 Dommy Mommy|500"
}

print(out)
frame.args = { 'total_damage' }
print(getData.get(frame))
frame.args = { 'max_ap' }
print(getData.get(frame))
frame.args = { 'capacity' }
print(getData.get(frame))
frame.args = { 'recoil' }
print(getData.get(frame))
frame.args = { 'dps' }
print(getData.get(frame))
frame.args = { 'fire_rate' }
print(getData.get(frame))
frame.args = { 'spare_magazines' }
print(getData.get(frame))
