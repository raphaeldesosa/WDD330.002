const API_key = "b35defef8fd84765bf9b1398df0dcf7b";
const gameList = document.getElementById("game-list");

async function fetchGames() {
    const url = `https://api.rawg.io/api/games?key=${API_key}&page_size=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayGames(data.results);
    } catch (error) {
        console.error("error fetching games:", error);
        gameList.innerHTML ="<p> Sorry, something went wrong. </p>"
    }

}   

function displayGames(games) {
    gameList.innerHTML = games.map(game => `
        <div class=game-card>
            <img src="${game.background_image}" alt=${game.name} width="300"/>
            <h3>${game.name}</h3>
            <p>Released: ${game.released}</p>
            <button class="view-details" data-id="${game.id}">View Details</button>
        </div>`).join('');

        document.querySelectorAll(".view-details").forEach(button => {
            button.addEventListener("click", () => {
                const gameId = button.dataset.id;
                showGameDetails(gameId);
            })
        })
}

async function showGameDetails(gameId) {
    const url = `https://api.rawg.io/api/games/${gameId}?key=${API_key}`;
    const modal = document.getElementById("game-modal");
    const modalDetails = document.getElementById("modal-details");

    try {
        const res = await fetch(url);
        const game = await res.json();

        modalDetails.innerHTML = `
        <h2>${game.name}</h2>
        <img src=${game.background_image} alt=${game.name} width="100%"/>
        <p><strong>Released:</strong> ${game.released}</p>
        <p><strong>Rating:</strong>${game.rating}</p>
        <p><strong>Genres:</strong>${game.genres.map(g => g.name).join(",")}</p>
        <p><strong>Description:</strong>${game.description_raw}</p>`;
        
    modal.classList.remove("hide");    
    } catch (err) {
        modalDetails.innerHTML = "<p>Error loading game details.</p>";
        modal.classList.remove("hide");
    }
}

document.getElementById("modal-close").addEventListener("click", () => {
    document.getElementById("game-modal").classList.add("hide");
});

fetchGames()