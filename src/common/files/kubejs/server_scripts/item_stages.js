// priority:9999

/**
 * @param {String} name 
 * @param {(import("net.minecraft.world.item.ItemStack").$ItemStack$$Type | `#${Special.ItemTag}`)[]} items 
 */
function registerStage(name, items) {

}

registerItemToStage("abc", "")
registerStage("abc", ["#minecra"])

/**
 * @type {{
 *   [stage: string]: (import("net.minecraft.world.item.ItemStack").$ItemStack$$Type | `#${Special.ItemTag}`)[]
 * }}
 */
const stagesToItems = {
    "stone_age": [
        "minecraft:stone_sword"
    ],
    "unknown": [

    ]
}

console.info(stagesToItems)
