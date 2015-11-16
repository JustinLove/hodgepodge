# HodgePodge

Manages adding units to the build bar.

Three great beasts bar the way to composable server mods:

- Unable to update strategic icons: Wounded. Icon Reloader can refresh previously known icon ids.
- Build bar is defined statically in the UI: Dying. HodgePodge has a proof of concept for incremental additions, but is still jamming units into fixed locations without regard for previous occupants. It may eventually need a complete build bar shadow to offer full functionality.
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

Add the mod file named above with something like this. Avoid preferred builds used by other piecemeal mods (this should get better)

    if (HodgePodge) {
      HodgePodge.addUnits([
        {
          spec_id: '/pa/units/land/baboom/baboom.json',
          preferred_builds: [['bot', 1]],
        },
      ])
    }

You should **not** shadow build.js, but you must still shadow `unit_list.json`.
