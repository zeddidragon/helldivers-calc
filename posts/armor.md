The amount of HP and armor Helldivers have has been subject to debate for quite a while. I was inspired to delve into this topic myself by the initiative of two people:

- u/Array71 and his topics on armor: https://www.reddit.com/r/Helldivers/comments/1bsecb0/armor_calc_and_how_to_stop_oneshots_from_rockets/
- u/TokuNiArimasen and his research on explosives: https://www.reddit.com/r/Helldivers/comments/1bunr5o/explosive_damage_rework_postpatch_01000200/

These two reached similar, yet different conclusions. Array suggeested we had 90HP and there was a 150% headshot multiplier, while Toku thought, judging from self-inflicted explosions, that we had 100HP and the multiplier was something like 166% as a result. I deferred to Array's explanation for a while thinking 150% 90HP sounded so clean it had to be correct.

The first discovery of the real value, 125HP, was to my knowledge done by the Youtuber Eravin. He discovered a poison plant that inflicts a status dealing exactly 1 damage per tick (figured to be 1 damage because Vitality Booster reduces this to 0. It is known that damage rounds down). He counted roughly 124 ticks and figured, rounded up, it must be 125, but he wasn't able to confirm it further.

I have been able to confirm it. The means with which I did that requires too long of an explanation to fit within this margin, but rest assured that everyone I've shown these results to before have agreed and are confident in these exact values.

Here's a table of limb multipliers for Helldivers:
|Head|Chest|Leg|Arm|Explosives|
|:-|:-|:-|:-|:-|
|200%|85%|80%|70%|50%|

The 200% headshot damage is notable. One point-blank (barrel clipping into the head) shot of Redeemer used to be instant death for Helldivers, but after some patch it wasn't anymore. This suggests that we previously had 120HP.

Here's a table of armor modifiers for the currently available amounts of armor in the game:
|Armor|Modifier|
|:-|:-|
|50|133%|
|64|123.6%|
|70|120%|
|79|114%|
|100|100%|
|129|88.5%|
|150|80%|
|200|67.1%|

When I asked u/Array71 for his analysis, he realized each additional 50 armor reduces damage taken by 20% compared to the previous step. Going from 50 to 100 reduces it by 25% instead, however. Also of note is that 100 armor is baseline damage, while less than that increases it. We really knew this when armor was fixed and overall damage increased for light armor.

The final two modifier to look at is Vitality booster, which reduces all damage taken by 20%, and Fortified, which reduces only AoE attacks by 50%.

Multiply all of these together, and you end up with the following tables:

|Armor|Overall|Explosion|Fortified|Head|Chest|Arm|Leg|
|:-|:-|:-|:-|:-|:-|:-|:-|
|50|133.00%|66.50%|33.25%|200.00%|113.05%|93.10%|106.40%|
|64|123.60%|61.80%|30.90%|200.00%|105.06%|86.52%|98.88%|
|70|120.00%|60.00%|30.00%|200.00%|102.00%|84.00%|96.00%|
|79|114.00%|57.00%|28.50%|200.00%|96.90%|79.80%|91.20%|
|100|100.00%|50.00%|25.00%|200.00%|85.00%|70.00%|80.00%|
|129|88.50%|44.25%|22.13%|177.00%|75.22%|61.95%|70.80%|
|150|80.00%|40.00%|20.00%|160.00%|68.00%|56.00%|64.00%|
|200|67.10%|33.55%|16.78%|134.20%|57.04%|46.97%|53.68%|

|w/Vitality|Overall|Explosion|Fortified|Head|Chest|Arm|Leg|
|:-|:-|:-|:-|:-|:-|:-|:-|
|50|106.40%|53.20%|26.60%|160.00%|90.44%|74.48%|85.12%|
|64|98.88%|49.44%|24.72%|160.00%|84.05%|69.22%|79.10%|
|70|96.00%|48.00%|24.00%|160.00%|81.60%|67.20%|76.80%|
|79|91.20%|45.60%|22.80%|160.00%|77.52%|63.84%|72.96%|
|100|80.00%|40.00%|20.00%|160.00%|68.00%|56.00%|64.00%|
|129|70.80%|35.40%|17.70%|141.60%|60.18%|49.56%|56.64%|
|150|64.00%|32.00%|16.00%|128.00%|54.40%|44.80%|51.20%|
|200|53.68%|26.84%|13.42%|107.36%|45.63%|37.58%|42.94%|

It's worthing noting that most explosive attacks in the game are delivered combined with a hefty direct damage portion as we already know from our own weapons (Crossbow 270 + 150, Eruptor 250 + 190, EAT 650 + 150 etc etc). Explosions used to be very scary in pure damage back when each of our limbs got hit by it, but this no longer being the case I'd genereally recommended Padded over Fortified, although the 129 Enforcer armor strikes a decent compromise (and doesn't have competition in its Armor Rating).

This system applies only to Helldivers. Enemies or Helldiver equipment such as Exosuits, Turrets, and Ballistic Shields operate on the same principle of 0-10 armor values that either halve or deflect damage.
