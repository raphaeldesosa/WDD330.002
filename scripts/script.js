const API_key = "b35defef8fd84765bf9b1398df0dcf7b";
const gameList = document.getElementById("game-list");

let allGames = [];

async function fetchGames() {
    const url = `https://api.rawg.io/api/games?key=${API_key}&page_size=100`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        allGames = data.results;
        displayGames(allGames);
    } catch (error) {
        console.error("error fetching games:", error);
        gameList.innerHTML ="<p> Sorry, something went wrong. </p>"
    }

}   

function displayGames(games) {
    if (!games.length) {
        gameList.innerHTML = "<p>No matching games found</p>";
        return;
    }

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
                window.location.href = `game-details.html?id=${gameId}`;
            })
        })
}


fetchGames()

document.getElementById("search-input").addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredGames = allGames.filter((game) =>
        game.name.toLowerCase().includes(keyword));
    displayGames(filteredGames);
})