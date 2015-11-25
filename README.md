# HodgePodge

Support framework for server mods which manages adding units to the build bar

Three great beasts bar the way to composable server mods:

- Unable to update strategic icons: Wounded. Icon Reloader can refresh previously known icon ids and replace a limited number of unused icon ids.
- Build bar is defined statically in the UI: Mostly Dead. HodgePodge manages assigning units to open build bar positions. So far it's managed to do this without file shadows.
- `unit_list.json`: Scratched; still a blocking issue.

## Making Piecemeal Units Mods (not really)

Using custom strategic icons depends the Icon Reloader mod, however HodgePodge manages the integration based on the information you give it.

Add dependencies and a global scene mod to your modinfo.json

    "dependencies": [
      "com.wondible.pa.hodgepodge",
      "com.wondible.pa.icon_reloader"
    ],
    "scenes": {
      "global_mod_list": [
        "coui://ui/mods/myawesomemod/global.js"
      ]
    },

Add the mod file named above with something like this.

    if (HodgePodge) {
      HodgePodge.addUnits([
        {
          spec_id: '/pa/units/land/baboom/baboom.json',
          si_name: 'fred', // optional: only needed if the unit has this property
          si_fallback: ['nuke_launcher_ammo', 'tank_nuke', 'bot_bomb'], // optional
          preferred_builds: [['bot', 1]],
        },
      ])

      //HodgePodge.removeUnits is also supported with similar arguments
      // though preferred_builds is not used

      // `si_name: null` to turn off Icon Reloader integration
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

Narrow (five column) build tabs will be expanded as required.

You should **not** shadow build.js, but you must still shadow `unit_list.json`.
