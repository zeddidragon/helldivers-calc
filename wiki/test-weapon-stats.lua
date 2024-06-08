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

frame.args = {}
local out = getData.attackDataTemplate(frame)
frame.args = { "EXO-49 Emancipator Exosuit" }
out = out .. getData.attackDataTemplate(frame)
print(out)
