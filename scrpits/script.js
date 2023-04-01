const pokemonCount = 386; //all pokemon up to 3rd generation
const pokemonList = document.querySelector("#pokemon-list");
const btnsHeader = document.querySelectorAll(".btn-header");
let currentType = ''; //indicates the current type that we are using as a filter
var pokedex = {}; //The pokedex object that we are going to be using
let first_pokemon = ''; // indicates the first "pokedex id" shown so we always know which is the first pokemon even when when filter by type

const equals = (element) => element["type"]["name"] === currentType; //This function helps to know if the pokemon type is the same that the currentType 

async function showPokemons(type) // We get the pokemon and introduce the pokemons into the HTML
{

    for (let i = 1; i <= pokemonCount; i++)  // look for all the pokemons
    {
        await getPokemon(i); // get the pokemon
        currentType = type // set the current type
        if(pokedex[i]["types"].some(equals) || currentType == "all") //filter if case 
        {
            if(first_pokemon == '') first_pokemon = i.toString() // set first pokemon id
            let pokemon = document.createElement("div"); //generate a new div
            pokemon.id = i; //get the pokemon's pokedex id
            pokemon.innerText = i.toString() + ". " + pokedex[i]["name"].toUpperCase(); //set the div inner text
            pokemon.classList.add("pokemon-name"); 
            pokemon.addEventListener("click", updatePokemon); // add the listener so when we click if calls the update pokemon function
            document.getElementById("pokemon-list").append(pokemon); // We append the new pokemon to the pokemon's list
        }
    }

    document.getElementById(first_pokemon).click(); // simulates a click into the first element in the pokemon's list
    first_pokemon = ''; // reset the first pokemon id
}

async function getPokemon(num)  // we get the pokemon from the API
{
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString(); //set the pokemon url from the API

    let res = await fetch(url); //wait to get the data
    let pokemon = await res.json(); 

    let pokemonName = pokemon["name"]; // get pokemon name
    let pokemonType = pokemon["types"]; //get pokemon types (1 or 2)
    let pokemonImg = pokemon["sprites"]["front_default"]; // get the pokemon img

    res = await fetch(pokemon["species"]["url"]); // working with the pokemon description
    let pokemonDesc = await res.json();

    pokemonDesc = pokemonDesc["flavor_text_entries"][9]["flavor_text"]; 

    pokedex[num] = {"name" : pokemonName, "img" : pokemonImg, "types" : pokemonType, "desc" : pokemonDesc}; // we seve the new pokemon
    
}

function updatePokemon()
{
    document.getElementById("pokemon-img").src = pokedex[this.id]["img"]; //we update the pokemon img, the this is reference to the clicked pokemon

    //we clear previous type
    let typesDiv = document.getElementById("pokemon-types");
    while (typesDiv.firstChild) 
    {
        typesDiv.firstChild.remove();
    }

    //we update types
    let types = pokedex[this.id]["types"];
    for (let i = 0; i < types.length; i++) 
    {
        let type = document.createElement("span");
        type.innerText = types[i]["type"]["name"].toUpperCase();
        type.classList.add("type-box");
        type.classList.add(types[i]["type"]["name"]); //adds background color and font color
        typesDiv.append(type);
    }

    //we update the pokemon's description
    document.getElementById("pokemon-description").innerText = pokedex[this.id]["desc"];
}

showPokemons("all") //we call the showPokemons function for the first time

btnsHeader.forEach(btn => btn.addEventListener("click", (event) =>  // we add a listener to the buttons so always when a type is selected we filter the pokemons
{
    const btnId = event.currentTarget.id; // get the type by the button's id
    pokedex = {}; // clears the pokedex obj
    pokemonList.innerHTML = ""; // clears the pokemon list html
    showPokemons(btnId); // calls the showPokemons and send the filter type
}))
