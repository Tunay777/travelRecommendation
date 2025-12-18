let travelData = {};

fetch("travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
        travelData = data;
        console.log("Data loaded successfully:", travelData);
    })
    .catch(error => console.error("Error loading JSON:", error));

function searchRecommendations() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "";

    if (searchInput === "") {
        alert("Please enter a keyword.");
        return;
    }

    let results = [];

    if (searchInput.includes("beach")) {
        if (travelData.beaches) results = travelData.beaches;
    }
    
    else if (searchInput.includes("temple")) {
        if (travelData.temples) results = travelData.temples;
    }
    
    else if (
        searchInput === "country" || 
        searchInput === "countries" ||
        searchInput.includes("city") || 
        searchInput.includes("cities")
    ) {
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                results.push(...country.cities);
            });
        }
    }
    
    else {
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                if (country.name.toLowerCase().includes(searchInput)) {
                    results.push(...country.cities);
                } 
                else {
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
        resultsDiv.innerHTML = "<h3 style='color:white; width:100%; text-align:center;'>No results found.</h3>";
        return;
    }

    results.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        const time = calculateTime(item.name);

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="card-content">
                <h3>${item.name}</h3>
                ${time ? `<div class="local-time">Current Time: ${time}</div>` : ''}
                <p>${item.description}</p>
                <a href="#" class="visit-btn">Visit</a>
            </div>
        `;

        resultsDiv.appendChild(card);
    });
}

function clearResults() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("searchInput").value = "";
}

function calculateTime(cityName) {
    if (!cityName) return null;
    
    const city = cityName.toLowerCase();
    
    let timeZone = null;

    
    if (city.includes("sydney")) timeZone = "Australia/Sydney";
    else if (city.includes("melbourne")) timeZone = "Australia/Melbourne";
    
    else if (city.includes("tokyo") || city.includes("kyoto") || city.includes("osaka")) timeZone = "Asia/Tokyo";
    else if (city.includes("india") || city.includes("taj mahal")) timeZone = "Asia/Kolkata";
    else if (city.includes("angkor") || city.includes("cambodia")) timeZone = "Asia/Phnom_Penh";
    
    else if (
        city.includes("rio") || 
        city.includes("paulo") || 
        city.includes("brazil") ||
        city.includes("copacabana")
    ) {
        timeZone = "America/Sao_Paulo";
    }
    
    else if (city.includes("new york")) timeZone = "America/New_York";
    
    else if (city.includes("bora bora") || city.includes("polynesia")) timeZone = "Pacific/Tahiti";

    if (timeZone) {
        try {
            const options = { 
                timeZone: timeZone, 
                hour12: true, 
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric' 
            };
            return new Date().toLocaleTimeString('en-US', options);
        } catch (error) {
            console.error("Timezone error for:", cityName);
            return null;
        }
    }
    
    return null;
}