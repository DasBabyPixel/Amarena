// priority:9999

StageEvents.serverRegister(event => {
    const { mods, restrictItems, restrictFluids } = destructurable(event)
    let iron_age = event.registerStage("iron_age")
    let m = mods("create", "create_new_age", "createaddition", "minecraft", "exdeorum", "ftbquests", "woodenshears")
    restrictItems(iron_age, m)
    restrictFluids(iron_age, m)
})
