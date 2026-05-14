// priority:9999

StageEvents.register(event => {
    const { mods } = destructurable(event)
    let iron_age = event.registerStage("iron_age")
    let m = mods("create", "create_new_age", "createaddition", "minecraft", "exdeorum", "ftbquests", "woodenshears")
    event.restrictItems(iron_age, m)
    event.restrictFluids(iron_age, m)
})

