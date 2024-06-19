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

frame.args = { "P-4 Senator" }
print(getData.attackDataTemplate(frame))
frame.args = { "AC-8 Autocannon" }
print(getData.attackDataTemplate(frame))
frame.args = { "LAS-98 Laser Cannon" }
print(getData.attackDataTemplate(frame))
