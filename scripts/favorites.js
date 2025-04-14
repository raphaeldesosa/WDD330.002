const container = document.getElementById("favorite-list");

function loadFavorites () {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if(favorites.length === 0) {
        container.innerHTML ="<p>You haven't saved any games yet.</p>"
        return;
    }

    container.innerHTML = favorites.map(game => `
        <div class="game-card">
            <img src="${game.image}" alt="${game.name}" width="300"/>
            <h3>${game.name}</h3>
            <button class="remove-btn" data-id="${game.id}">❌ Remove</button>
        </div>
    `).join("");

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            removeFavorite(id);
        })
    })
}

function removeFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(game => game.id !==id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
}

loadFavorites();