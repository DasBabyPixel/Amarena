let $HashMap = Java.loadClass("java.util.HashMap")
// Visit the wiki for more info - https://kubejs.com/
console.info('Hello, World! (Loaded server example script)')

AStages.customizeStage('test_stage_1')
    .setAddTitle('stage 1 unlocked')


AStages.addRestrictionForMod("remove_vanilla_items_0", "test_stage_1", "minecraft")
    .ignoreItems("minecraft:dirt", "minecraft:grass_block")
Item.of('acacia_button')

let map = new $HashMap();
console.info(map.toString())

ServerEvents.afterRecipes(event => {
    Ingredient.of("#minecraft:planks").itemIds.forEach(i => {
        console.info(i)
    })

    console.info("Run afterRecipes")
    // event.forEachRecipe("*", recipe => {
    //     console.info(recipe)
    // })

})

ServerEvents.recipes(event => {
    console.info("Recipes")
})

ServerEvents.tags('item', event => {
    console.info("Run tags")
})

// Server Script Folder -> file.js (arbitrary file name).
// AStages.addRestrictionForItem("astages/item1", "test_stage_1", Items.OAK_LOG, "chest")
// AStages.addRestrictionForTag("astages/item2", "test_stage_1", "forge:ingots/iron")
// AStages.addRestrictionForMod("astages/item3", "test_stage_1", "minecraft")
// AStages.addRestrictionForArmor("astages/item4", "test_stage_1", "diamond_helmet", "diamond_chestplate")

// AModels.createPredicateModel("astages:rarity", stack => stack.rarity == $Rarity.EPIC) // ONLY this line MUST be copied in a client script file!
// AStages.addRestrictionForPredicate("astages/item5", "test_stage_1", "astages:rarity")

console.info("TestABC")
