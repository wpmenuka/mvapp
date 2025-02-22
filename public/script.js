async function searchMovie() {
    const movieName = document.getElementById("movieInput").value;
    const dropdown = document.getElementById("movieDropdown");
    
    dropdown.innerHTML = `<option>Loading...</option>`;
    
    const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(movieName)}`);
    const movies = await response.json();
    
    dropdown.innerHTML = `<option value="">-- Select a Movie --</option>`;
    
    if (movies.error) {
        dropdown.innerHTML = `<option>No movies found!</option>`;
        return;
    }
    
    movies.forEach(movie => {
        const option = document.createElement("option");
        option.value = movie.imdbId; // Now storing just the IMDB ID
        option.textContent = movie.title;
        dropdown.appendChild(option);
    });
}

function playMovie() {
    const dropdown = document.getElementById("movieDropdown");
    const selectedId = dropdown.value;
    const videoContainer = document.getElementById("videoContainer");
    
    if (selectedId) {
        videoContainer.innerHTML = `
            <iframe 
                src="https://vidsrc.pm/embed/movie?imdb=${selectedId}" 
                style="width: 100%; height: 100%;" 
                frameborder="0" 
                referrerpolicy="origin" 
                allowfullscreen>
            </iframe>`;
    } else {
        videoContainer.innerHTML = '';
    }
}