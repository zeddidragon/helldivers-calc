local p = {} --p stands for package

function p.getWeightMetricLua(weightInGrams)
	--Test for empty input
	if weightInGrams == nil then
		return nil
	end
	--Test for hard coded kg in input
	if string.find(weightInGrams, "kg") then
		weightInGrams = string.match(weightInGrams, "%d*%.?%d+")
		weightInGrams = tonumber(weightInGrams)
		if weightInGrams == nil then
			return "non-number detected"
		else
			return weightInGrams .. " kg"
		end	
	end
	--Test for hard coded g in input
	if string.find(weightInGrams, "g") then
		weightInGrams = string.match(weightInGrams, "%d*%.?%d+")
		weightInGrams = tonumber(weightInGrams)
		if weightInGrams == nil then
			return "non-number detected"
		else
			return weightInGrams .. " g"
		end	
	end
	--Try to convert input into number (remove any letters)
	if tonumber(weightInGrams) == nil then
		weightInGrams = string.match(weightInGrams, "%d*%.?%d+")
	end
	--Test for non-convertible input (if the input is still garbage)
	if tonumber(weightInGrams) == nil then
		return "non-number detected"
	end	
	--Return as kilograms if a decimal point is found
	if string.find(weightInGrams, "%.") then
		weightInGrams = tonumber(weightInGrams)
		return weightInGrams .. " kg"
	end
	weightInGrams = tonumber(weightInGrams)
	--Return as grams if weight input is less than 1000g
	if weightInGrams < 1000 then
		return weightInGrams .. " g"
	end
	--Return as kilograms if weight input is 1000g or more
	local weightInKilograms = (weightInGrams / 1000)
	return weightInKilograms .. " kg"
end

function p.getWeightMetric( frame )
	--Load in weight input
	local weightInGrams = frame.args[1]
	return p.getWeightMetricLua(weightInGrams)
end

return p
