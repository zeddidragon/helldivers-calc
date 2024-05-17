# The damage formula
- ⌊(100 - durableRatio) * FALLOFF(damage) + (durableRatio * FALLOFF(durableDamage)) * ArmorFactor⌋
- Where FALLOF = x -> ⌊x * falloffFactor⌋
- And ⌊x⌋ means "Round x down to the nearest whole number"
- The exact formula for determining falloffFactor is still being researched. Most guns lose 10%-20% damage at 100m.

# A practical example
A Helldiver fires Breaker Spray & Pray at a Brood Commander's head. The Brood Commander is extremely close, but the gun is not clipping into the head, making falloff small, but non-zero. The following variables will apply:
- Breaker S&P pellets do 12 damage each.
- Breaker S&P pllets have 4 durable damage.
- Directly after leaving the barrel, these are reduced to 11 and 3.
- Brood Commander's head is 60% durable.
- (40 * 11 + 60 * 3) / 100 = 6.2
- Breaker S&P is Light Armor Penetrating, matching Brood Commander's Lightly Armored head.
- Armor cuts damage in half to 3.1
- Round down for 3 per pellet.
- The shot was easy to make, so multiply by 16.
- 48 total damage.

5 of these shots should be sufficient to destroy the Brood Commander's head, which has 200HP.
