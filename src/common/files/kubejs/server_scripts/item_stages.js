// priority:9999

/**
 * @param {String} name 
 * @param {(import("net.minecraft.world.item.ItemStack").$ItemStack$$Type | `#${Special.ItemTag}`)[]} items 
 */
function registerStage(name, items) {
    console.info("Register stage " + name)
}

StageEvents.register(event => {
    let iron_age = event.registerStage("iron_age")
    let m =event.mods("create", "create_new_age", "createaddition", "minecraft", "exdeorum", "ftbquests", "woodenshears")
    event.restrictItems(iron_age, m)
    event.restrictFluids(iron_age, m)
})

