# HodgePodge

Support framework for server mods which manages adding units to the build bar and strategic icons. It does not address modifying `unit_list.json`

## Making Piecemeal Unit Mods (almost)

Add dependencies and a global scene mod to your modinfo.json

    "dependencies": [
      "com.wondible.pa.hodgepodge",
    ],
    "scenes": {
      "global_mod_list": [
        "coui://ui/mods/myawesomemod/global.js"
      ]
    },

Add the mod file named above with something like this.

    if (window.HodgePodge) {
      HodgePodge.addUnits([
        {
          spec_id: '/pa/units/land/baboom/baboom.json',
          si_name: 'fred', // optional: only needed if the unit has this property
          preferred_builds: [['bot', 1]],

          /* optional (nuke/anti-nuke missiles)
          ammo_build_hover: {
            name: 'Magic Missile',
            description: 'Hurt them really bad',
            cost: 1000,
            sicon_override: 'magic_missile',
            damage: 1000
          },
          */
        },
      ])

      //HodgePodge.removeUnits is also supported with similar arguments
      // though preferred_builds is not used

      // `si_name: null` to turn automatic icon reservation
    }

Preferred builds are assigned in a series of passes. Roughly, all first choices are assigned before any second choices, and a unit will get a slot on the tab of it's first choice before any later ones are considered.

    for each preferred_builds
      for each pass
        for each addedUnits

Passes: 

1. The listed slot
2. The same row as a listed slot
3. The same tab as a listed slot
4. Dump the rest into ammo tab
5. Still going? Dump units into extra0..extraN tabs

You should **not** shadow build.js, but you must still shadow `unit_list.json`.

## Legacy `icon_atlas` Methods

These methods formally performed icon limit management. They are now stub implementations, documented here since some mods were calling them directly and they must be considered part of the public interface.

- model.requestIcons
  - model.requestIcons(['one', 'two', {three: ['fallbackthree']}])
  - model.requestIcons({one: ['fallbackone'], two: ['fallbacktwo']})
- model.releaseIcons(['one', 'two', 'three']) // now a no-op stub
