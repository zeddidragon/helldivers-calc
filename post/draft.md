# Oh My God Another Brood Commander Science Thread, How BleedOut (Doesn't) Work

Thought we were done with this subject, weren't you!

We'll start with a look at the ever essential enemy breakdown on Shalzuth's mmost excellent https://helldivers.io/Enemies

There's a lot to digest here, and even more we don't know perfectly. There's going to be missing data, such as certain limbs transfering damage to _other_ limbs, but we're not here to get into that today (because I haven't the faintest idea).

## How BleedOut Does _Not_ Work
As always, we'll look at Brood Commander. We know, with no data, that if you shoot its head until it explodes, it will get very upset about the situation and lash out, but eventually die. Adding data, we know that the Head has 200 `Health`, transfers  50% of its damagee to main, and has a `BleedsOut` of 300. 

So let's do the math:
- Brood Commander has 800 `Health`
- You shoot the head with a theoretical 200 damage weapon, 100 of it also goes to main.
- The head explodes.
- Head has 0 `Health`.
- The body has 700 `Health` remaining.
- Somehow 300 BleedsOut kills it???
- I timed this to take just under 4 seconds. (Between bullet impact and Mission Clear label fading in).

Maybe BleedsOut is a status and 300 is the DPS? I experimented with these steps:
- Shoot head for 200 dmg.
- Head has 0 `Health`.
- Follow up with 3 additional shots in the body.
- Brood Ccommander now has 100 `Health` remaining.
- I timed this to take just under 4 seconds.

Nothing changed. 300 BleedsOut kills the commander in the same time wether it has 700 `Health` or 100 `Health`, so BleedsOut _can not_ be damaging main.

## How BleedOut Does Work
So what's going on? I added a third experiment. Most people know from experience that if you shoot the head, like, really hard, Brood Commander will die faster.
- Shoot head for 400dmg
- Head now has -200 _negative_ `Health`.
- I timed bleedout time to be just under 1.5 seconds.

The releation is becoming quite clear, isn't it? `BleedsOut` is a _second healthbar_ that you can eat into by overkilling. When a limb dies, as we have learned from Helldivers, it is considered injured, it might even explode and disappear, but the limb still exists as a concept, and that concept has a Healthbar. For Brood Commander's head, this injury is a bleeding state that keeps draining `Health` from the head (around 70 DPS). When the head reaches -300 negative `Health`, the Head dies. The head's second attribute, `Fatal`, now finally kicks in and kills the host.

## How BleedOut Also Does Not Work
So what do you do with this information? You can just find parts that have `BleedsOut`, kill those, and simply wait for your target to die, right? I tried this with FactoryStrider. The leg is 600 `Health` 1000 `BleedsOut`. I fired a Recoilles into its toes and waited. With a rate of even 10 dps it should die after less than 2 minutes. The whole guy was sparkling and clearly injured, but death never came for it. This tells me that the injury caused by Factory Strider Leg death is different, and probably only slows down movement just like it does for our Helldivers. You can kill Fac Strider through the pinky toe, but you need an additional 1000 damage for it to hit the `BleedsOut` treshold.

## In Conclusion
- When checking HP of a limb, _add the BleedsOut value_. i.e. Brood Commander Head can be though of as having 500 HP.
- The limb gets injured when it has taken `Health` damage.
- The limb may be completely destroyed _only when the combined _`Health` + `BleedsOut`_ is drained.
- Getting injured does _not necessarily_ cause any further damage.
- This game is complicated.
