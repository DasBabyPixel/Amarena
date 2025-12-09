// priority:9999

/**
 * @param {String} name 
 * @param {(import("net.minecraft.world.item.ItemStack").$ItemStack$$Type | `#${Special.ItemTag}`)[]} items 
 */
function registerStage(name, items) {
    console.info("Register stage " + name)
}

/**
 * @template {object} T
 * @param {T} event
 * @returns {Pick<T, { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]>}
 */
function destructurable(event) {
    /** @type {any} */
    const out = {};
    for (const key in event) {
        if (typeof event[key] === "function") {
            out[key] = event[key].bind(event);
        }
    }
    return out;
}


StageEvents.register(event => {
    const { mods } = destructurable(event)
    let iron_age = event.registerStage("iron_age")
    let m = mods("create", "create_new_age", "createaddition", "minecraft", "exdeorum", "ftbquests", "woodenshears")
    event.restrictItems(iron_age, m)
    event.restrictFluids(iron_age, m)
})

