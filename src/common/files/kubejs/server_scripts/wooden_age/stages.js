// priority: 9000

StageEvents.serverRegister(event => {
    const { registerStage, restrictItems, items } = destructurable(event)
    // Items that are available without any stage
    UNRESTRICTED_ITEMS.push(items(
        "#minecraft:oak_logs",
        "minecraft:oak_planks",
        "minecraft:stick",
        "minecraft:crafting_table",
        "minecraft:oak_sapling",
        "minecraft:oak_leaves",
        "minecraft:apple",
        "minecraft:wooden_axe",
        "minecraft:wooden_shovel"
    ))
    // Every stage is granted by a gamestage reward of the matching quest in the "Wooden Age" chapter (stone_age.snbt)
    //example format start
    let wooden_age_tree = registerStage("wooden_age_tree");
    restrictItems(wooden_age_tree, "exdeorum:crook", "exdeorum:oak_barrel", "minecraft:oak_slab")

    let wooden_age_crook = registerStage("wooden_age_crook")
    restrictItems(wooden_age_crook, "exdeorum:silkworm")
    //example format end
    

    //to convert
    restrictItems(registerStage("wooden_age_crook"), "exdeorum:silkworm"),
    restrictItems(registerStage("wooden_age_silkworm"), "exdeorum:infested_leaves", "minecraft:string"),
    restrictItems(registerStage("wooden_age_string"), "exdeorum:string_mesh"),
    restrictItems(registerStage("wooden_age_barrel"), "woodenshears:wooden_shears"),
    restrictItems(registerStage("wooden_age_shears"), "minecraft:dirt"),
    restrictItems(registerStage("wooden_age_dirt"), "exdeorum:oak_sieve"),
    restrictItems(registerStage("wooden_age_sieve"), "exdeorum:stone_pebble", "minecraft:cobblestone"),
    restrictItems(registerStage("wooden_age_cobblestone"), "exdeorum:wooden_hammer", "minecraft:gravel", "minecraft:sand", "exdeorum:dust"),
    restrictItems(registerStage("wooden_age_hammer"), "exdeorum:oak_crucible"),
    restrictItems(registerStage("wooden_age_crucible"), "minecraft:furnace", "minecraft:bowl", "exdeorum:wooden_watering_can"),
    restrictItems(registerStage("wooden_age_watering_can"), "minecraft:wooden_hoe", "minecraft:wheat_seeds"),
    restrictItems(registerStage("wooden_age_farming"), "minecraft:wheat"),
    restrictItems(registerStage("wooden_age_wheat"), "minecraft:bread"),
    restrictItems(registerStage("wooden_age_furnace"), "minecraft:glass", "minecraft:glass_bottle", "minecraft:potion", "minecraft:clay", "minecraft:charcoal", "minecraft:torch", "minecraft:wooden_sword", "minecraft:bone"),
    restrictItems(registerStage("wooden_age_clay"), "minecraft:clay_ball", "exdeorum:unfired_porcelain_crucible", "exdeorum:unfired_porcelain_bucket", "exdeorum:porcelain_crucible", "exdeorum:porcelain_bucket"),
    restrictItems(registerStage("wooden_age_bone"), "minecraft:bone_meal", "exdeorum:porcelain_clay_ball"),
    restrictItems(registerStage("wooden_age_porcelain"), "exdeorum:porcelain_water_bucket", "exdeorum:porcelain_lava_bucket"),
    restrictItems(registerStage("wooden_age_lava"), "minecraft:flint", "exdeorum:flint_mesh", "minecraft:wooden_pickaxe"),
    restrictItems(registerStage("wooden_age_flint_mesh"), "exdeorum:andesite_pebble", "minecraft:andesite")
    
})
