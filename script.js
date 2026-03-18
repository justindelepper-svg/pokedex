document.addEventListener('DOMContentLoaded', function()
{
    const responseContainer = document.getElementById('response-container');
    const loadTrigger = document.getElementById('load-trigger');
    let offset = 0;
    const limit = 18;
    let loading = false;

    const observer = new IntersectionObserver(entries =>
    {
        // check of de maximale pokemon is bereikt (1350). als dat zo is, voer dan niet nog een batch uit
        if(entries[0].isIntersecting && !loading)
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

        const pokemons = data.results.slice(0, limit);
        console.log("pokemons: ", pokemons);

        const pokemonPromises = pokemons.map(pokemon =>
            fetch(pokemon.url)
            .then(response => response.json())
        );

        const pokeData = await Promise.all(pokemonPromises);

        pokeData.forEach((pokeData, index) =>
        {
            const id = pokeData.id;
            const name = pokeData.name.toUpperCase();
            const sprite = pokeData.sprites.front_default;
            // const sprite2 = pokeData.sprites.versions['generation-iv']['diamond-pearl'].front_default;
            console.log(name, sprite);

            const card = document.createElement('div');
            card.classList.add('pokemon-card');

            const imgElement = document.createElement('img');
            imgElement.classList.add('pokemon-sprite');
            imgElement.src = sprite;
                
            const textElement = document.createElement('h5');
            textElement.classList.add('pokemon-text');
            textElement.textContent = id + ". " + name;

            card.appendChild(imgElement);
            card.appendChild(textElement);

            responseContainer.insertBefore(card, loadTrigger);

            // Maak de eerste kaart geselecteerd
            if (index === 0)
            {
                card.classList.add('card-selected');
            }
        });

        loading = false;

        // pas als de gebruiker omlaag scrolt OF als de navigatie op 18+ komt, voer dan de volgende batch uit
        nextBatch();
    }

    function requestError(error, type)
    {
        console.error(`Error fetching ${type}:`, error);
    }

    function nextBatch()
    {
        observer.observe(loadTrigger);
    }

    function loadMorePokemon()
    {
        offset += limit;
        callAPI(offset, limit);
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

        // Set the initial card as selected
        cards[currentIndex].classList.add('card-selected');
        
        if (event.key === 'ArrowUp')
        {
            // Reset the current card
            cards[currentIndex].classList.remove('card-selected');

            // Rotate the pokeball
            currentRotation -= rotationValue*rowLength;
            pokeball.style.transform = `translate(-80px, -60px) scale(1.5) rotate(${currentRotation}deg)`;

            // Move to the previous card
            currentIndex -= rowLength;
            if (currentIndex < 0)
            {
                currentIndex = cards.length - 1; // Loop back to the last card
            }

            // Style the new current card
            cards[currentIndex].classList.add('card-selected');

            cards[currentIndex].scrollIntoView
            ({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
        else if (event.key === 'ArrowRight')
        {
            // Reset the current card
            cards[currentIndex].classList.remove('card-selected');

            // Rotate the pokeball
            currentRotation += rotationValue;
            pokeball.style.transform = `translate(-80px, -60px) scale(1.5) rotate(${currentRotation}deg)`;

            // Move to the next card
            currentIndex++;
            if (currentIndex >= cards.length)
            {
                currentIndex = 0; // Loop back to the first card
            }

            // Style the new current card
            cards[currentIndex].classList.add('card-selected');

            cards[currentIndex].scrollIntoView
            ({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
        else if (event.key === 'ArrowDown')
        {
            // Reset the current card
            cards[currentIndex].classList.remove('card-selected');

            // Rotate the pokeball
            currentRotation += rotationValue*rowLength;
            pokeball.style.transform = `translate(-80px, -60px) scale(1.5) rotate(${currentRotation}deg)`;

            // Move to the next card
            currentIndex += rowLength;
            if (currentIndex >= cards.length)
            {
                currentIndex = 0; // Loop back to the first card
            }

            // Style the new current card
            cards[currentIndex].classList.add('card-selected');

            cards[currentIndex].scrollIntoView
            ({
                behavior: 'smooth',
                block: 'nearest'
            });
        } else if (event.key === 'ArrowLeft')
        {
            // Reset the current card
            cards[currentIndex].classList.remove('card-selected');

            // Rotate the pokeball
            currentRotation -= rotationValue;
            pokeball.style.transform = `translate(-80px, -60px) scale(1.5) rotate(${currentRotation}deg)`;

            // Move to the previous card
            currentIndex--;
            if (currentIndex < 0)
            {
                currentIndex = cards.length - 1; // Loop back to the last card
            }

            // Style the new current card
            cards[currentIndex].classList.add('card-selected');

            cards[currentIndex].scrollIntoView
            ({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    });
});