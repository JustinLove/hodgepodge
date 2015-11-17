# HodgePodge

Support framework for server mods which manages adding units to the build bar

Three great beasts bar the way to composable server mods:

- Unable to update strategic icons: Wounded. Icon Reloader can refresh previously known icon ids.
- Build bar is defined statically in the UI: Mostly Dead. HodgePodge manages assigning units to open build bar positions. So far it's managed to do this without file shadows.
- `unit_list.json`: Scratched; still a blocking issue.

## Making Piecemeal Units Mods (not really)

Pick one of the unused strategic icons and shadow it. Add `"si_name": "thenameyoushadowed"` to your unit json. Try to avoid one used by other piecemeal mods (this should get a *little* better)

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
          preferred_builds: [['bot', 1]],
        },
      ])
    }

Preferred builds are assigned in a series of passes:

for each pass
  for each customUnits
    for each preferred_builds

Passes: 

1. The listed slots
2. The same row as a listed slot
3. The same tab as a listed slot
4. Dump the rest into ammo tab
5. Still going? Dump units into extra0..extraN tabs

Narrow (five column) build tabs will be expanded as required.

You should **not** shadow build.js, but you must still shadow `unit_list.json`.
