document.addEventListener('DOMContentLoaded', function()
{
    const responseContainer = document.getElementById('response-container');

    fetch(`https://pokeapi.co/api/v2/pokemon`)
    .then(response => response.json())
    .then(data => makeCard(data))
    .catch(e => requestError(e, 'pokemon'));

    function makeCard(data)
    {
        console.log(data);

        for (let i = 0; i < 10; i++)
        {
            const pokemon = data.results[i];
        
            fetch(pokemon.url)
            .then(response => response.json())
            .then(pokeData =>
            {
                const name = pokeData.name.toUpperCase();
                const sprite = pokeData.sprites.front_default;
                // const sprite2 = pokeData.sprites.versions['generation-iv']['diamond-pearl'].front_default;
                console.log(name, sprite);

                const card = document.createElement('div');
                card.classList.add('pokemon-card');

                const imgElement = document.createElement('img');
                imgElement.classList.add('pokemon-sprite');
                imgElement.src = sprite;
                
                const nameElement = document.createElement('h4');
                nameElement.classList.add('pokemon-name');
                nameElement.textContent = name;

                card.appendChild(imgElement);
                card.appendChild(nameElement);

                responseContainer.appendChild(card);

                // Maak de eerste kaart geselecteerd
                if (responseContainer.children.length === 1)
                {
                    card.classList.add('card-selected');
                }
            });
        }
    }

    function requestError(error, type)
    {
        console.error(`Error fetching ${type}:`, error);
    }

    // -------------------------------------------------------------------------------------------------------------

    const pokeball = document.querySelector('.pokeball');
    let currentIndex = 0;
    let currentRotation = 10;
    const rotationValue = 30;
    const rowLength = 5;

    document.addEventListener('keydown', function(event)
    {
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
        }
    });
});