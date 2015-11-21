# HodgePodge

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
