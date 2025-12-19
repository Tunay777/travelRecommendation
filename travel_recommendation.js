let travelData = {};

fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
        travelData = data;
        console.log("Data loaded:", travelData);
    })
    .catch(error => console.error("JSON error:", error));

function searchRecommendations() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!searchInput) {
        alert("Please enter a keyword.");
        return;
    }

    let results = [];

    /* BEACH / BEACHES */
    if (searchInput.includes("beach")) {
        results = travelData.beaches || [];
    }

    /* TEMPLE / TEMPLES */
    else if (searchInput.includes("temple")) {
        results = travelData.temples || [];
    }

    /* COUNTRY / COUNTRIES / CITY / CITIES */
    else if (
        searchInput.includes("country") ||
        searchInput.includes("countries") ||
        searchInput.includes("city") ||
        searchInput.includes("cities")
    ) {
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                results.push(...country.cities);
            });
        }
    }

    /* COUNTRY OR CITY NAME SEARCH */
    else {
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                if (country.name.toLowerCase().includes(searchInput)) {
                    results.push(...country.cities);
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(searchInput)) {
                            results.push(city);
                        }
                    });
                }
            });
        }
    }

    if (results.length === 0) {
        resultsDiv.innerHTML =
            "<h3 style='color:white; width:100%; text-align:center;'>No results found.</h3>";
        return;
    }

    results.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>
        `;

        resultsDiv.appendChild(card);
    });
}

function clearResults() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("searchInput").value = "";
}
