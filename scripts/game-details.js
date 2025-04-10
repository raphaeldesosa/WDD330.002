const API_key = "b35defef8fd84765bf9b1398df0dcf7b";
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("id");

const detailContainer = document.getElementById("game-details");

async function getGameDetails () {
    try {
        const res = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_key}`);
        const game = await res.json();

        detailContainer.innerHTML = `
        <h1>${game.name}</h1>
        <img src=${game.background_image} alt="${game.name}" width="100%"/>
        <p><strong>Released:</strong> ${game.released}</p>
        <p><strong>Rating:</strong>${game.rating}</p>
        <p><strong>Genres:</strong>${game.genres.map(g => g.name).join(",")}</p>
        <p><strong>Description:</strong>${game.description_raw}</p>
        <p><strong>Platforms:</strong>${game.platforms.map(p => p.platform.name).join(",")}</p>`;
    } catch (err) {
        detailContainer.innerHTML = "<p>Error loading game details</p>";
        console.error(err);
    }
}

document.getElementById("back-button").addEventListener("click", () => {
    window.location.href="index.html";
})

getGameDetails();

const form = document.getElementById("review-form");
const reviewsContainer = document.getElementById("reviews");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("reviewer").value;
    const text = document.getElementById("review-text").value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const review = { name, text, rating: parseInt(rating), date: new Date().toLocaleString() };


    const existing = JSON.parse(localStorage.getItem(`reviews-${gameId}`)) || [];
    existing.push(review);
    localStorage.setItem(`reviews-${gameId}`, JSON.stringify(existing));

    form.reset();
    loadReviews();
});

function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem(`reviews-${gameId}`)) || [];

    if (reviews.length === 0) {
        reviewsContainer.innerHTML ="<p>No reviews yet, be the first to share your thoughts!</p>";
        document.getElementById("average-rating").textContent = "";
        return;
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = (totalRating / reviews.length).toFixed(1);

    document.getElementById("average-rating").textContent = `⭐ Average Rating: ${avgRating}/5`;

    reviewsContainer.innerHTML = reviews
        .map(
            (r, index) => 
                `<div class="review"> 
                    <strong>${r.name}</strong> <em>${r.date}</em>
                    <p>Rating: ${"★".repeat(r.rating)} ${"☆".repeat(5-r.rating)}</p>
                    <p>${r.text}</p>
                    <button class="delete-review" data-index=${index}">Delete</button>
                 </div>
                `
                )
                .join("");

    document.querySelectorAll(".delete-review").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            deleteReview(index);
        })
    })            
}

function deleteReview(index) {
    const reviews = JSON.parse(localStorage.getItem(`reviews-${gameId}`)) || [];

    reviews.splice(index, 1);

    localStorage.setItem(`reviews-${gameId}`, JSON.stringify(reviews));

    loadReviews();
}

loadReviews();