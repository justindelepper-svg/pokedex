document.addEventListener('DOMContentLoaded', function()
{
    const pokedexContainer = document.querySelector('.pokedex-container');
    const detailContainer = document.querySelector('.detail-container');
    const responseContainer = document.getElementById('response-container');
    const pokemonArt = document.querySelector('.pokemon-art');
    const loadTrigger = document.getElementById('load-trigger');
    let offset = 0;
    const limit = 18;
    let loading = false;
    let maxPokemon = 0;

    const observer = new IntersectionObserver(entries =>
    {
        if(entries[0].isIntersecting && !loading && offset < maxPokemon)
        {
            loading = true;
            loadMorePokemon();
        }
    });

    function callAPI(offset, limit)
    {
        return fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        .then(response => response.json())
        .then(data => makeCard(data))
        .catch(e => requestError(e, 'pokemon'));
    }
    callAPI(offset, limit);

    async function makeCard(data)
    {
        console.log("data: ", data);
        maxPokemon = data.count;

        const pokemons = data.results.slice(0, limit);
        console.log("pokemons: ", pokemons);

        const pokemonPromises = pokemons.map(pokemon =>
            fetch(pokemon.url)
            .then(response => response.json())
        );

        const pokeData = await Promise.all(pokemonPromises);
        console.log("pokeData: ", pokeData);

        pokeData.forEach((pokeData, index) =>
        {
            let id = pokeData.id;
            let name = pokeData.name.toUpperCase();
            let sprite = pokeData.sprites.front_default;
            let art = pokeData.sprites.other['official-artwork'].front_default;
            console.log(name, sprite);

            let card = document.createElement('div');
            card.classList.add('pokemon-card');
            card.dataset.id = id;
            card.dataset.art = art;

            let imgElement = document.createElement('img');
            imgElement.classList.add('pokemon-sprite');
            imgElement.src = sprite;
                
            let textElement = document.createElement('h5');
            textElement.classList.add('pokemon-text');
            textElement.textContent = id + ". " + name;

            card.appendChild(imgElement);
            card.appendChild(textElement);

            responseContainer.insertBefore(card, loadTrigger);

            card.addEventListener('click', function()
            {
                fillDetail(pokeData);
                makePokemonArt(pokeData);
                pokedexDetailToggle('none', 'flex');
            });

            // Maak de eerste kaart geselecteerd
            if (index === 0 && offset === 0)
            {
                card.classList.add('card-selected');
                makePokemonArt(card);
            }
        });

        loading = false;

        nextBatch();
        viewportHeightCheck();
    }

    function requestError(error, type)
    {
        console.error(`Error fetching ${type}:`, error);
    }

    function viewportHeightCheck()
    {
        const bodyHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;

        if (viewportHeight >= bodyHeight && !loading)
        {
            loadMorePokemon();
        }
    }

    function nextBatch()
    {
        observer.observe(loadTrigger);
    }

    function loadMorePokemon()
    {
        loading = true;
        offset += limit;
        callAPI(offset, limit);
    }

    function pokedexDetailToggle(displayPokedex, displayDetail)
    {
        pokedexContainer.style.display = displayPokedex;
        detailContainer.style.display = displayDetail;
    }

    // DETAIL

    const backButton = document.querySelector('.back-btn');
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const sprite = document.querySelector('.pokemon-sprite');
    const name = document.querySelector('#pokemon-name');
    const types = document.querySelector('.types');
    const abilities = document.querySelector('.abilities');
    let currentPokemonId;

    function fillDetail(pokemon)
    {
        sprite.src = pokemon.sprites.versions['generation-iv']['diamond-pearl'].front_default;

        let pokemonId = pokemon.id;
        currentPokemonId = pokemonId;
        let pokemonName = pokemon.name.toUpperCase();
        name.textContent = pokemonId + ". " + pokemonName;
        
        let typeList = pokemon.types;
        typeList.forEach(typeData =>
        {
            let pokemonType = typeData.type.name;
            types.innerHTML += `<span class="type ${pokemonType}">${pokemonType}</span>`;
        });

        let abilityList = pokemon.abilities;
        abilityList.forEach(abilityData =>
        {
            let pokemonAbility = abilityData.ability.name;
            abilities.innerHTML += `<li class="ability">${pokemonAbility}</li>`;
        });

        // const statMaxReference =
        // {
        //     hp: 255,
        //     attack: 190,
        //     defense: 250,
        //     'special-attack': 194,
        //     'special-defense': 250,
        //     speed: 180
        // };

        // let percent = (baseStat / statMaxReference[statName]) * 100;
    }

    backButton.addEventListener('click', function()
    {
        pokedexDetailToggle('flex', 'none');
        detailCleanUp();
    });

    nextButton.addEventListener('click', async function()
    {
        currentPokemonId += 1;
        var pokemon = await getPokemonById(currentPokemonId)
        detailCleanUp();
        fillDetail(pokemon);
        makePokemonArt(pokemon);
    });

    prevButton.addEventListener('click', async function()
    {
        currentPokemonId -= 1;
        var pokemon = await getPokemonById(currentPokemonId)
        detailCleanUp();
        fillDetail(pokemon);
        makePokemonArt(pokemon);
    });

    function detailCleanUp()
    {
        types.innerHTML = '';
        abilities.innerHTML = '';
    }

    async function getPokemonById(id)
    {
        var request = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .catch(e => requestError(e, 'pokemon'));

        return request;
    }

    // -------------------------------------------------------------------------------------------------------------

    const pokeball = document.querySelector('.pokeball');
    let currentIndex = 0;
    let currentRotation = 10;
    const rotationValue = 30;
    const rowLength = 6;

    document.addEventListener('keydown', function(event)
    {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key))
        {
            event.preventDefault();
        }

        const cards = document.querySelectorAll('.pokemon-card');

        cards[currentIndex].classList.add('card-selected');
        
        if (event.key === 'ArrowUp')
        {
            cards[currentIndex].classList.remove('card-selected');

            currentRotation -= rotationValue*rowLength;
            pokeball.style.transform = `translate(-80px, -60px) scale(1.5) rotate(${currentRotation}deg)`;

            currentIndex -= rowLength;
            if (currentIndex < 0)
            {
                currentIndex = cards.length - 1;
            }

            cards[currentIndex].classList.add('card-selected');

            makePokemonArt(cards[currentIndex]);

            cards[currentIndex].scrollIntoView
            ({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
        else if (event.key === 'ArrowRight')
        {
            cards[currentIndex].classList.remove('card-selected');

            currentRotation += rotationValue;
            pokeball.style.transform = `translate(-80px, -60px) scale(1.5) rotate(${currentRotation}deg)`;

            currentIndex++;
            if (currentIndex >= cards.length)
            {
                currentIndex = 0;
            }

            cards[currentIndex].classList.add('card-selected');

            makePokemonArt(cards[currentIndex]);

            cards[currentIndex].scrollIntoView
            ({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
        else if (event.key === 'ArrowDown')
        {
            cards[currentIndex].classList.remove('card-selected');

            currentRotation += rotationValue*rowLength;
            pokeball.style.transform = `translate(-80px, -60px) scale(1.5) rotate(${currentRotation}deg)`;

            currentIndex += rowLength;
            if (currentIndex >= cards.length)
            {
                currentIndex = 0;
            }

            cards[currentIndex].classList.add('card-selected');

            makePokemonArt(cards[currentIndex]);

            cards[currentIndex].scrollIntoView
            ({
                behavior: 'smooth',
                block: 'nearest'
            });
        } else if (event.key === 'ArrowLeft')
        {
            cards[currentIndex].classList.remove('card-selected');

            currentRotation -= rotationValue;
            pokeball.style.transform = `translate(-80px, -60px) scale(1.5) rotate(${currentRotation}deg)`;

            currentIndex--;
            if (currentIndex < 0)
            {
                currentIndex = cards.length - 1;
            }

            cards[currentIndex].classList.add('card-selected');

            makePokemonArt(cards[currentIndex]);

            cards[currentIndex].scrollIntoView
            ({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    });

    function makePokemonArt(cardOrPokemon)
    {
        let artUrl;

        if (cardOrPokemon && cardOrPokemon.dataset)
        {
            artUrl = cardOrPokemon.dataset.art;
        } else if (cardOrPokemon && cardOrPokemon.sprites)
        {
            artUrl = cardOrPokemon.sprites.other['official-artwork'].front_default;
        }

        if (!artUrl) return;

        pokemonArt.style.opacity = '0';
        pokemonArt.src = artUrl;
        pokemonArt.style.opacity = '1';
    }
});