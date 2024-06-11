local getArgs = require('Module:Arguments').getArgs
local p = {} --p stands for package

function renderCell(cell)
  if not cell then
    return ''
  end
  return ''
end

function trim(str)
  str = string.gsub(str, '^%s+', '')
  str = string.gsub(str, '%s+$', '')
  return str
end

function cellCbCell(cell, str)
  local x, y, w, h = string.match(str, '(%d)%s(%d)%s(%d)%s(%d)')
  cell.x = tonumber(x)
  cell.y = tonumber(y)
  cell.w = tonumber(w)
  cell.h = tonumber(h)
end

function cellCbMedals(cell, str)
  cell.medals = tonumber(str)
end

function cellCbPassthrough(cell, str,  key)
  cell[key] = str
end

local cellCallbacks = {
  cell = cellCbCell,
  medals = cellCbMedals,
  link = cellCbPassthrough,
  image = cellCbPassthrough,
  title = cellCbPassthrough,
}

function renderCell(cell)
  local x = cell.x or 1
  local y = cell.y or 1
  local w = cell.w or 1
  local h = cell.h or 1
  local x2 = x + w
  local y2 = y + h
  local contents = 'Image and link missing'
  local title = ""

  if cell.image and cell.link then
    contents = '[[File:' .. cell.image .. '|link=' .. cell.link .. ']]'
  elseif cell.image then
    contents = 'Link missing'
  elseif cell.link then
    contents = 'Image missing'
  end
  
  if cell.title then
    title = cell.title
  elseif cell.link then
    title = string.gsub(cell.link, '#', ' ')
  end

  if cell.medals then
    title = title .. ' (' .. cell.medals .. ' Medals)'
  end

  return '<div class="warbond-cell'
    .. ' warbond-cell-x-' .. x
    .. ' warbond-cell-y-' .. y
    .. ' warbond-cell-x2-' .. x2
    .. ' warbond-cell-y2-' .. y2
    .. ' warbond-cell-w-' .. w
    .. ' warbond-cell-h-' .. h
    .. '" title="' .. title
    .. '">' .. contents .. '</div>'
end

function p.templateWarbondPage(frame)
  local args = getArgs(frame, {
    wrappers = 'Template:Warbond_Page',
  })
  local out = ''
  local cell = nil
  local total_medal_cost = 0
  local unlock_medal_cost = 0
  local is_cell_data = false
  for key, line in pairs(args) do
    if line == '-' then -- Start new cell
      if is_cell_data then
        out = out .. renderCell(cell) .. '\n'
        total_medal_cost = total_medal_cost + (cell.medals or 0)
      end
      cell = {}
      is_cell_data = false
    else
      local cell_key, cell_args  = string.match(line, '(.*)%s*:%s*(.*)')
      local cb = cellCallbacks[cell_key]
      if cell and cb then
        is_cell_data = true
        cb(cell, cell_args, cell_key)
      elseif cell_key == 'unlock_medal_cost' then
        unlock_medal_cost = tonumber(cell_args)
      end
    end
  end

  if is_cell_data then
    out = out .. renderCell(cell) .. '\n'
  end

  out = '<div class="warbond-page">\n'
    .. out
    .. '</div>\n'

  if unlock_medal_cost and unlock_medal_cost > 0 then
    out = '<p>Medals needed to unlock: ' .. frame:expandTemplate({
      title = 'Currency',
      args = { 'Medal', unlock_medal_cost, 'notext' },
    }) .. '</p>\n' .. out
  end

  out = '<p>Total cost of the page: ' .. frame:expandTemplate({
    title = 'Currency',
    args = { 'Medal', total_medal_cost, 'notext' },
  }) .. '</p>\n' .. out
  
  return out
end

return p
