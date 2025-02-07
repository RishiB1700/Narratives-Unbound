document.addEventListener("DOMContentLoaded", function () {
    fetchData();

    function fetchData() {
        Promise.all([
            fetch('data/books.json').then((resp) => resp.json()),
            fetch('data/movies.json').then((resp) => resp.json()),
            fetch('data/adaptations_fidelity.json').then((resp) => resp.json()),
        ])
            .then(([books, movies, adaptations]) => {
                displayBooksAndMovies(books, movies, adaptations);
            })
            .catch((error) => {
                console.error('Error loading the data:', error);
            });
    }

    function displayBooksAndMovies(books, movies, adaptations) {
        const mainSection = document.getElementById('dashboard-container');
        books.forEach((book) => {
            const correspondingMovie = movies.find(
                (movie) => movie.title === book.title
            );
            const adaptation = adaptations.find(
                (adapt) => adapt.title === book.title
            );
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
        bookCover.src = book.cover_image;
        bookCover.alt = `${book.title} Cover`;
        bookCover.className = 'card-image';
        front.appendChild(bookCover);

        // Back of the card (Movie Poster and Glow based on Verdict)
        const back = document.createElement('div');
        back.className = `card-back verdict-${adaptation.book_to_screen_adaptation_index.toLowerCase()}`;
        const moviePoster = document.createElement('img');
        moviePoster.src = movie.poster_image;
        moviePoster.alt = `${movie.title} Poster`;
        moviePoster.className = 'card-image';
        back.appendChild(moviePoster);

        // Floating caption overlay at the bottom of the movie side
        const verdictCaption = document.createElement('div');
        verdictCaption.className = 'verdict-caption';
        verdictCaption.textContent = adaptation.book_to_screen_adaptation_index;
        back.appendChild(verdictCaption);

        // Slide and fade effect on hover
        card.addEventListener('mouseenter', () => {
            verdictCaption.classList.add('show-caption');
            setTimeout(() => {
                verdictCaption.classList.remove('show-caption');
            }, 1500); // Display for 1.5 seconds
        });

        // Assemble card
        cardInner.appendChild(front);
        cardInner.appendChild(back);
        card.appendChild(cardInner);
        cardContainer.appendChild(card);

        // Add click event to open modal
        card.addEventListener('click', function () {
            const detailsHtml = generateDetailHtml(book, movie, adaptation);
            showDetails(detailsHtml);
        });

        return cardContainer;
    }

    function generateDetailHtml(book, movie, adaptation) {
        let html = `
            <div>
                <h2>${book.title} - Detailed View</h2>
                <h3>Book Details:</h3>
                <p>Author: ${book.author}</p>
                <p>Pages: ${book.pages}</p>
                <p>Published: ${book.published_date} by ${book.publisher}</p>
                <p>Edition: ${book.edition}</p>
                <p>Category: ${book.category}</p>
                <p>Genre: ${book.genre}</p>
            `;

        if (movie) {
            html += `
                <h3>Movie Details:</h3>
                <p>Director: ${movie.crew?.directors || 'N/A'}</p>
                <p>Sub-genres: ${movie.sub_genres}</p>
                <p>Age Certification: ${movie.age_certification}</p>
                <p>Release Date: ${movie.release_date}</p>
                <p>Budget: ${movie.details?.commercial_success?.budget || 'N/A'}</p>
                <p>Revenue: ${movie.details?.commercial_success?.revenue || 'N/A'}</p>
                <p>IMDb Rating: ${movie.details?.audience_reception?.imdb_rating || 'N/A'}/10 (${movie.details?.audience_reception?.imdb_vote_count} votes)</p>
            `;
        }

        if (adaptation) {
            html += `
                <h3>Adaptation Fidelity:</h3>
                <p>Audience Score: ${adaptation.audience_score_on_fidelity} out of 10</p>
                <p>Critics Score: ${adaptation.critics_score_on_fidelity} out of 10</p>
                <p>BSAI Index: ${adaptation.book_to_screen_adaptation_index}</p>
            `;
        }

        html += `</div>`;
        return html;
    }

    function showDetails(html) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = html;
        const modal = document.getElementById('myModal');
        modal.style.display = 'block'; // Show the modal
    }

    const modal = document.getElementById('myModal');
    const span = document.getElementsByClassName('close')[0];

    span.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});
