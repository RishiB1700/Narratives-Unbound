document.addEventListener("DOMContentLoaded", function() {
    fetchData();

    function fetchData() {
        Promise.all([
            fetch('data/books.json').then(resp => resp.json()),
            fetch('data/movies.json').then(resp => resp.json()),
            fetch('data/adaptations_fidelity.json').then(resp => resp.json())
        ])
        .then(([books, movies, adaptations]) => {
            console.log('Books:', books);
            console.log('Movies:', movies);
            console.log('Adaptations:', adaptations);
            displayBooksAndMovies(books, movies, adaptations);
        })
        .catch(error => {
            console.error('Error loading the data:', error);
        });
    }

    function displayBooksAndMovies(books, movies, adaptations) {
        const mainSection = document.getElementById('dashboard-container');
        books.forEach(book => {
            let correspondingMovie = movies.find(movie => movie.title === book.title);
            let adaptation = adaptations.find(adapt => adapt.title === book.title);
            if (correspondingMovie && adaptation) {
                const cardElement = createCard(book, correspondingMovie, adaptation);
                mainSection.appendChild(cardElement);
            }
        });
    }

    function createCard(book, movie, adaptation) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    const card = document.createElement('div');
    card.className = 'card';

    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    // Front of the card (Book Cover)
    const front = document.createElement('div');
    front.className = 'card-front';
    const bookCover = document.createElement('img');
    bookCover.src = book.cover_image; // Path from JSON
    bookCover.alt = `${book.title} Cover`;
    bookCover.className = 'card-image';
    front.appendChild(bookCover);
    front.innerHTML += `<h3>${book.title}</h3><p>Author: ${book.author}</p>`;

    // Back of the card (Movie Poster)
    const back = document.createElement('div');
    back.className = 'card-back';
    const moviePoster = document.createElement('img');
    moviePoster.src = movie.poster_image; // Path from JSON
    moviePoster.alt = `${movie.title} Poster`;
    moviePoster.className = 'card-image';
    back.appendChild(moviePoster);
    back.innerHTML += `<h3>${movie.title}</h3><p>Director: ${movie.crew ? movie.crew.directors : 'N/A'}</p>`;

    // Assemble card
    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);
    cardContainer.appendChild(card);

    // Add click event for popup
    card.addEventListener('click', function() {
        const detailsHtml = generateDetailHtml(book, movie, adaptation);
        showDetails(detailsHtml);
    });

    return cardContainer;
}
    
    function generateDetailHtml(book, movie, adaptation) {
    let html = `<div><h2>${book.title} - Detailed View</h2><h3>Book Details:</h3>
        <p>Author: ${book.author}</p>
        <p>Pages: ${book.pages}</p>
        <p>Published: ${book.published_date} by ${book.publisher}</p>
        <p>Edition: ${book.edition}</p>
        <p>Category: ${book.category}</p>
        <p>Genre: ${book.genre}</p>
        <p>Google Book Ratings: ${book.audience_reception?.google_book_ratings}/5 (${book.audience_reception?.google_books_rate_count} ratings)</p>
        <progress value="${book.audience_reception?.google_book_ratings}" max="5" style="width: 100%;"></progress>
        <p>Goodreads Ratings: ${book.audience_reception?.goodreads_ratings}/5 (${book.audience_reception?.goodreads_rate_count} ratings)</p>
        <progress value="${parseFloat(book.audience_reception?.goodreads_ratings)}" max="5" style="width: 100%;"></progress>
        <p>Critics Reception: ${book.critics_reception}/5</p>
        <progress value="${parseFloat(book.critics_reception) * 20}" max="100" style="width: 100%;"></progress>
        <p>Commercial Success: ${book.commercial_success}</p>`;

    if (movie) {
        html += `<h3>Movie Details:</h3>
            <p>Director: ${movie.crew?.directors || 'N/A'}</p>
            <p>Sub-genres: ${movie.sub_genres}</p>
            <p>Age Certification: ${movie.age_certification}</p>
            <p>Release Date: ${movie.release_date}</p>
            <p>Budget: ${movie.details?.commercial_success?.budget || 'N/A'}</p>
            <p>Revenue: ${movie.details?.commercial_success?.revenue || 'N/A'}</p>
            <p>IMDb Rating: ${movie.details?.audience_reception?.imdb_rating || 'N/A'}/10 (${movie.details?.audience_reception?.imdb_vote_count} votes)</p>
            <progress value="${parseFloat(movie.details?.audience_reception?.imdb_rating)}" max="10" style="width: 100%;"></progress>
            <p>IMDb Popularity: ${movie.details?.audience_reception?.imdb_popularity}</p>
            <p>TMDB Popularity: ${movie.details?.audience_reception?.popularity_tmdb}</p>
            <p>TMDB Rating: ${movie.details?.audience_reception?.vote_average_tmdb}/10 (${movie.details?.audience_reception?.vote_count_tmdb} votes)</p>
            <progress value="${parseFloat(movie.details?.audience_reception?.vote_average_tmdb)}" max="10" style="width: 100%;"></progress>
            <p>Rotten Tomatoes Score: ${movie.details?.critical_reception?.rotten_tomatoes_score || 'N/A'} (${movie.details?.critical_reception?.critics_review_count} reviews)</p>
            <progress value="${parseFloat(movie.details?.critical_reception?.rotten_tomatoes_score)}" max="100" style="width: 100%;"></progress>
            <p>Metacritic Score: ${movie.details?.critical_reception?.metacritic_score || 'N/A'} (${movie.details?.critical_reception?.metacritic_review_count} reviews)</p>
            <progress value="${parseFloat(movie.details?.critical_reception?.metacritic_score.split('/')[0])}" max="100" style="width: 100%;"></progress>
            <p>Runtime: ${movie.runtime}</p>
            <p>Cast: ${movie.cast}</p>
            <p>Crew: Writers: ${movie.crew?.writers || 'N/A'}, Producers: ${movie.crew?.producers || 'N/A'}</p>
            <p>Streaming On: ${movie.streaming_on}</p>`;
    }

    if (adaptation) {
        html += `<h3>Adaptation Fidelity:</h3>
            <p>Audience Score: ${adaptation.audience_score_on_fidelity} out of 10</p>
            <progress value="${Number(adaptation.audience_score_on_fidelity)}" max="10" style="width: 100%;"></progress>
            <p>Critics Score: ${adaptation.critics_score_on_fidelity} out of 10</p>
            <progress value="${Number(adaptation.critics_score_on_fidelity)}" max="10" style="width: 100%;"></progress>
            <p>BSAI Index: ${adaptation.book_to_screen_adaptation_index}</p>`;
    }

    html += `</div>`; // Close the main div
    return html;
}

      function showDetails(html) {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = html;
    const modal = document.getElementById('myModal');
    modal.style.display = 'block'; // Show the modal
}
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});

