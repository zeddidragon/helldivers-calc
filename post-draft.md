# Damage is still not what you think: How "Explosive" damage works

A couple of months back there was a fairly popular post by u/Bluedot55 : [https://www.reddit.com/r/Helldivers/comments/1azh9fw/weapon\_damage\_isnt\_what\_you\_think\_and\_isnt\_what/](https://www.reddit.com/r/Helldivers/comments/1azh9fw/weapon_damage_isnt_what_you_think_and_isnt_what/)

He made some testing, came to a conclusion that aligned with his data, but I saw there were weapons missing on this table, and redid the experiment using all of the game's primaries and secondaries along with some support weapons. That was over a month ago and I've been having sleepless nights over the results since. 

- The initial conclusion didn't account for armor (observed by white/red hit maker), making it flawed to begin with.
- If Lib Pen has a higher headshot multipler than Liberator, why isn't it doing more damage to Helldiver heads?
- The same applies to Devestator heads. Both Lib and Lib Pen need 3 shots. Defender needs 2. Signs point to Dev heads having 120-125 HP given how Counter-Sniper oneshots at close enough ranges, but then stops doing that.

We have both, independently, continued to dig into the matter, and a lot of other people have as well.

More extensive testing of this nature was performed by u/Key_Negotiation_9726 : 
- https://www.reddit.com/r/Helldivers/comments/1boyn5n/how_to_kill_terminids_an_indepth_analysis_how/
- https://www.reddit.com/r/Helldivers/comments/1bs9dv2/how_to_kill_automatons_part_ii_of_my_weapons_btk/

The tests have not made a point of firing every shot at point-blank. That's fine for practical purposes. You can simply refer to the chart and know how many shots you'll roughly need to kill a thing. For the purposes of deducing the exact damage values and enemy HP, I still needed to dig deeper. For those out of the loop, testing has confirmed that damage drops off over distance for the majority of weapons:

https://www.reddit.com/r/Helldivers/comments/1bwbo78/guns_lose_damage_over_distance_as_soon_as_they/

Progress in datamining by people much smarter than I am reveals a second damage number for each source of damage. It's sometimes referred to as "Durable damage". This number is 5 for Liberator (close to the 10% suggested by Pilestedt) and 15 for Penetrator (more of a 33%). For Dominator this is 90, 30% of full damage. The answer to "Is Dominator doing explosive damage?" can be concluded with "yesn't". Glad I could clear it up and prevent any future debates on that one.

The majority of explosions have 100% durable damage, and support weapons are all over the place, generally leaning into "More than a primary, that's for sure". I have listed these values on my stat site as far as I know them:

https://invadersfromplanet.space/helldivers-2/

The wiki might add them once they've been verified more thorougly. The general rule of thumb is that durable damage is 10%, rounded down. Liberator is 55/5, Diligence:CS is 128/12
Some noteworthy high rollers on durable:
|Weapon|Dmg|Half|Dur|Ratio|Notes|
|:-|:-|:-|:-|:-|:-|
|AC-8 Autocannon|410|410|410|100.00%||
|LAS-98 Laser Cannon|300|300|300|100.00%|DPS|
|R-36 Eruptor|380|322|265|69.74%||
|CB-9 Exploding Crossbow|420|335|250|59.52%|:[|
|SG-8P Punisher Plasma|250|225|200|80.00%||
|ARC-12 Blitzer|250|212|175|70.00%||
|PLAS-1 Scorcher|200|175|150|75.00%||
|APW-1 Anti-Materiel Rifle|450|292|135|30.00%||
|RS-422 Railgun|600|360|120|20.00%||
|SG-8 Punisher|405|256|108|26.67%||
|JAR-5 Dominator|300|195|90|30.00%||
|SG-225IE Breaker Incendiary|180|135|90|50.00%||
|SG-8S Slugger|250|162|75|30.00%||
|SG-225 Breaker|330|198|66|20.00%||
|SG-225SP Breaker Spray & Pray|192|128|64|33.33%||
|LAS-5 Scythe|300|180|60|20.00%||
|ARC-3 Arc Thrower|250|150|50|20.00%||
|MG-206 Heavy Machine Gun|100|67|35|35.00%||
|AR-23P Liberator Penetrator|45|30|15|33.33%||
|AR-23C Liberator Concussive|55|32|10|18.18%||

All the rocket launchers and grenades seem 100% as well, with exploding Crossbow being notable for the explosive part _not_ being 100%.

Does this explain Brood Commander's head? Not yet. If you just plop in the results 17 x 5 vs 8 x 15, you find that this time it's base Liberator that needs significantly less damage than Lib Pen. Just like Lib Pen is an in-between gun, Brood Commander's head is an "in-between" massive body part. A body part can be anywhere between 0%-100% durable, and it seems like Brood Commander's is 50%.

What does this mean? It means take half damage from one source, half from another. For Liberator that's: `(55 * 50 + 5 * 50) / 100 = 30`

But hitting armor it reduces to half and becomes 15

Lib Pen is `(45 * 50 + 10 * 50) / 100 = 30`

Lib Pen exceeds the light armor and stays at 30.

`8 * 30` vs `15 * 17` suggests Brood Commander's head has 240 half-durable HP or less.

That leaves one oddity, which is how a 400 damage impact grenade doesn't immediately pop Brood Commander's head. I believe this to be because radial attacks have no interaction with brood commander heads, just like with helldiver heads. (Rockets headshotting you kill you because of the rocket's direct damage, the explosion is not multiplied.) Notice how some weapons like Plasma Punishere kills Brood Commander faster with body shots than headshots. The direct portion (75 half-durable) goes to the head, then the explosion (150) touches the body behind the head instead, and these two have seperate health pools.

So what's the takeaway from all of this?

- Weak spot multipliers vs enemies is not a real thing. If it is, no difference has been found between weapons in this department.
- Laser Cannon enjoyers have already figured this out, but this is a great weapon for durable targets. 300 sustained, durable DPS isn't bad. Autocannon and AMR are still ahead of the pack on this in the short-term.
- Lib Pen should be alright on gunships and spore spewers compared to competition. Use it _on medium armor durable kill spots_, as low as the supply of those are.
- With some weapons, body shots can be preferable.
- Chargers are still a black hole of research into which you can pour hours of your time and understand less than before you started.
- Please show durability damage in-game.
- My soul can finally rest, but probably won't.
