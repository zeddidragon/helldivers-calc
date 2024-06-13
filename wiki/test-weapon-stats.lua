local json = require("cjson")
mw = {}

function mw.loadData()
  local file = io.open("../data/wiki.json", "rb")
  local contents = file:read("*a")
  local data = json.decode(contents)
  file:close()
  return data
end

local getData = require("weapon-stats")

local frame = {}

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

out = getData.fullWeaponTable(frame)
print(out)
