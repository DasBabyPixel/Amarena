// priority: 10

let $HashMap = Java.loadClass("java.util.HashMap")
// Visit the wiki for more info - https://kubejs.com/
console.info('Hello, World! (Loaded server example script)')


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

console.info("TestABC")
