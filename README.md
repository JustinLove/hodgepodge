# HodgePodge

Allow mixing compatible server mods, especially single-units

Three great beasts bar the way:

- Unable to update strategic icons: Wounded. Icon Reloader can refresh previously known icon ids.
- Build bar is defined statically in the UI: Dying. HodgePodge has a proof of concept for incremental additions, but is still jamming units into fixed locations without regard for previous occupants. It has to monkey punch the `unit_specs` handling and may eventually need a complete javascript shadow to offer full functionality.
- `unit_list.json`: Scratched; still a blocking issue. HodgePodge reimpliments `unit_specs` digests from scratch; this allows units to appear in the the correct buildable lists, but the server does not accept build commands for new units. Buildable lists based on code by Raevn

## Making Piecemeal Units Mods

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

Things **not** to do:

- Shadow `build.js`

## Game Bugs

- flattenBaseSpecs merges arrays (like command caps) when it should replace them.  `_.merge` takes a an extra parameter that can be used to adjust the behavior
- `support_platform` (Angel) has `ORDER_Assist` twice.
- Several units appear in `unit_list` twice - I believe it's the ones that have ex1 variants
- `bot_nanoswarm` has a blank `buildable_types`
