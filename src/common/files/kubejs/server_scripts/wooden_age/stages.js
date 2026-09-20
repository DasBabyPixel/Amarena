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
    let wooden_age_tree = registerStage("wooden_age_tree")
    restrictItems(wooden_age_tree, "exdeorum:crook", "exdeorum:oak_barrel", "minecraft:oak_slab")

    let wooden_age_crook = registerStage("wooden_age_crook")
    restrictItems(wooden_age_crook, "exdeorum:silkworm")

    let wooden_age_silkworm = registerStage("wooden_age_silkworm")
    restrictItems(wooden_age_silkworm, "exdeorum:infested_leaves", "minecraft:string")

    let wooden_age_string = registerStage("wooden_age_string")
    restrictItems(wooden_age_string, "exdeorum:string_mesh")

    let wooden_age_barrel = registerStage("wooden_age_barrel")
    restrictItems(wooden_age_barrel, "woodenshears:wooden_shears")

    let wooden_age_shears = registerStage("wooden_age_shears")
    restrictItems(wooden_age_shears, "minecraft:dirt")

    let wooden_age_dirt = registerStage("wooden_age_dirt")
    restrictItems(wooden_age_dirt, "exdeorum:oak_sieve")

    let wooden_age_sieve = registerStage("wooden_age_sieve")
    restrictItems(wooden_age_sieve, "exdeorum:stone_pebble", "minecraft:cobblestone")

    let wooden_age_cobblestone = registerStage("wooden_age_cobblestone")
    restrictItems(wooden_age_cobblestone, "exdeorum:wooden_hammer", "minecraft:gravel", "minecraft:sand", "exdeorum:dust")

    let wooden_age_hammer = registerStage("wooden_age_hammer")
    restrictItems(wooden_age_hammer, "exdeorum:oak_crucible")

    let wooden_age_crucible = registerStage("wooden_age_crucible")
    restrictItems(wooden_age_crucible, "minecraft:furnace", "minecraft:bowl", "exdeorum:wooden_watering_can")

    let wooden_age_watering_can = registerStage("wooden_age_watering_can")
    restrictItems(wooden_age_watering_can, "minecraft:wooden_hoe", "minecraft:wheat_seeds")

    let wooden_age_farming = registerStage("wooden_age_farming")
    restrictItems(wooden_age_farming, "minecraft:wheat")

    let wooden_age_wheat = registerStage("wooden_age_wheat")
    restrictItems(wooden_age_wheat, "minecraft:bread")

    let wooden_age_furnace = registerStage("wooden_age_furnace")
    restrictItems(wooden_age_furnace, "minecraft:glass", "minecraft:glass_bottle", "minecraft:potion", "minecraft:clay", "minecraft:charcoal", "minecraft:torch", "minecraft:wooden_sword", "minecraft:bone")

    let wooden_age_clay = registerStage("wooden_age_clay")
    restrictItems(wooden_age_clay, "minecraft:clay_ball", "exdeorum:unfired_porcelain_crucible", "exdeorum:unfired_porcelain_bucket", "exdeorum:porcelain_crucible", "exdeorum:porcelain_bucket")

    let wooden_age_bone = registerStage("wooden_age_bone")
    restrictItems(wooden_age_bone, "minecraft:bone_meal", "exdeorum:porcelain_clay_ball")

    let wooden_age_porcelain = registerStage("wooden_age_porcelain")
    restrictItems(wooden_age_porcelain, "exdeorum:porcelain_water_bucket", "exdeorum:porcelain_lava_bucket")

    let wooden_age_lava = registerStage("wooden_age_lava")
    restrictItems(wooden_age_lava, "minecraft:flint", "exdeorum:flint_mesh", "minecraft:wooden_pickaxe")

    let wooden_age_flint_mesh = registerStage("wooden_age_flint_mesh")
    restrictItems(wooden_age_flint_mesh, "exdeorum:andesite_pebble", "minecraft:andesite")
})
