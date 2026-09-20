// priority: -1000
// Has to load after the scripts of all ages: event handlers run in load order
// and the iron_age restriction below needs the items of every age

/**
 * Items the ages make available without any stage, see wooden_age/stages.js
 * @type {import("@package/de/dasbabypixel/gamestages/neoforge/v1_21_1/addons/item").$ItemCollectionWrapper[]}
 */
const UNRESTRICTED_ITEMS = []

/**
 * Item restrictions registered by the ages, see wooden_age/stages.js
 * @type {import("@package/de/dasbabypixel/gamestages/neoforge/v1_21_1/addons/item/jsapi").$ItemsRestrictionEntryJS[]}
 */
const AGE_ITEM_RESTRICTIONS = []

StageEvents.serverRegister(event => {
    const { mods, items, restrictItems, restrictFluids, restrictedItems, registerStage } = destructurable(event)
    let iron_age = event.registerStage("iron_age")
    let m = mods("create", "create_new_age", "createaddition", "minecraft", "exdeorum", "ftbquests", "woodenshears"

    )
    // An item may only be part of a single restriction, otherwise GameStages reports duplicates
    let no_category = registerStage("no_category")
    restrictItems(no_category, m.except(items(UNRESTRICTED_ITEMS, restrictedItems())))    
    restrictFluids(no_category, m)
})
