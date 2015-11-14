# HodgePodge

Allow mixing server mods, especially single-units

Buildable types based on code by Raevn

## Game Bugs

- flattenBaseSpecs merges arrays (like command caps) when it should replace them.  `_.merge` takes a an extra parameter that can be used to adjust the behavior
- `support_platform` (Angel) has `ORDER_Assist` twice.
