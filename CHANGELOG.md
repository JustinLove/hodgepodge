# HodgePodge

## 2.0.1

- Update build number

## 2.0.0 for > 89755

- New property: `ammo_build_hover` for nuke missiles etc
- `si_fallback` is no longer used
- Now handles strategic icons internally instead of cooperating with Icon Reloader
- Move most processing to `shared_build` scene
- Replace regexp hack with master spec map editing

## 1.1.2

- Forgot to update mod date

## 1.1.1

- Fix undefined symbol when not running with Icon Reloader

## 1.1.0

- Add `si_fallback` property
- Remove Deep Space Radar in Titans, and titans in Classic

## 1.0.0

- First pass at removing units from build bar.
- Reworked build bar allocation; units will get a slot on the tab of their first preferred build before considering later choices
- Tab level allocations run bottom-up
- specify `si_name: null` to turn off icon integration

## 0.3.0

- Drives Icon Reloader id replacement.
- Mod authors should add an `si_name` property the addUnits call if the unit has that property

## 0.2.1

- Fix mod mode

## 0.2.0

- First pass at allocating units to an available build bar slot, instead of blind-setting the first requested slot.
