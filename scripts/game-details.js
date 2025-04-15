const RAWG_API_key = "b35defef8fd84765bf9b1398df0dcf7b";


const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("id");

const detailContainer = document.getElementById("game-details");
const reviewsContainer = document.getElementById("reviews");
const form = document.getElementById("review-form");

//Fetch RAWG Game Details

async function getGameDetails () {
    try {
        const res = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_key}`);
        const game = await res.json();

        detailContainer.innerHTML = `
        <h1>${game.name}</h1>
        <img src=${game.background_image} alt="${game.name}" width="100%"/>
        <p><strong>Released:</strong> ${game.released}</p>
        <p><strong>Rating:</strong>${game.rating}</p>
        <p><strong>Genres:</strong>${game.genres.map(g => g.name).join(",")}</p>
        <p><strong>Description:</strong>${game.description_raw}</p>
        <p><strong>Platforms:</strong>${game.platforms.map(p => p.platform.name).join(",")}</p>
        <div id="extra-info"></div>`;

        loadTrailer();

        
        
    } catch (err) {
        detailContainer.innerHTML = "<p>Error loading game details</p>";
        console.error(err);
    }
}

//Load Trailers using RAWG movies endpoint

async function loadTrailer() {
    try {
        const res = await fetch(`https://api.rawg.io/api/games/${gameId}/movies?key=${RAWG_API_key}`);
        const data = await res.json();

        if (data.results.length > 0) {
            const video = data.results[0];
            const extraInfoDiv = document.getElementById("extra-info");

            extraInfoDiv.innerHTML += `
                <h3>Trailers</h3>
                <video controls width="100%">
                    <source src="${video.data.max}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
        } else {
            const extraInfoDiv = document.getElementById("extra-info");
            extraInfoDiv.innerHTML += `<p><em>No trailer available for this game.</em></p>`
        }
    } catch (error) {
        console.error("Error loading trailer:", error);
    }
}

//Review Form Submission

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("reviewer").value;
    const text = document.getElementById("review-text").value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const review = { name, text, rating: parseInt(rating), date: new Date().toLocaleString(), replies: [] };


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

                    <div class="replies">
                        ${(r.replies || []).map(reply => `
                            <div class="reply">
                                <strong>${reply.name}</strong> <em>${reply.date}</em>
                                <p>${reply.text}</p>
                            </div>
                        `).join("")}
                    </div>
                    
                    <form class="reply-form" data-index="${index}">
                        <input type="text" placeholder="Your name" required class="reply-name" />
                        <input type="text" placeholder="reply?" required class="reply-text" />
                        <button type="submit">Reply</button>
                    </form>

                    <button class="delete-review" data-index="${index}">Delete</button>
                 </div>
                `
                )
                .join("");

    document.querySelectorAll(".delete-review").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            deleteReview(index);
        });
    });
    
    document.querySelectorAll(".reply-form").forEach(form => {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            const index = e.target.dataset.index;
            const name = form.querySelector(".reply-name").value;
            const text = form.querySelector(".reply-text").value;
            const date = new Date().toLocaleString();
    
            const reviews = JSON.parse(localStorage.getItem(`reviews-${gameId}`)) || []
            const reply = {name, text, date };
            reviews[index].replies = reviews[index].replies || [];
            reviews[index].replies.push(reply);
    
            localStorage.setItem(`reviews-${gameId}`, JSON.stringify(reviews));
            loadReviews();
        });
    });
    
}

function deleteReview(index) {
    const reviews = JSON.parse(localStorage.getItem(`reviews-${gameId}`)) || [];
    reviews.splice(index, 1);
    localStorage.setItem(`reviews-${gameId}`, JSON.stringify(reviews));
    loadReviews();
}

document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "index.html";
});

getGameDetails();
loadReviews();



