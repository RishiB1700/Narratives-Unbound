document.addEventListener("DOMContentLoaded", function() {
    fetchData();

    function fetchData() {
        Promise.all([
            fetch('data/books.json').then(resp => resp.json()),
            fetch('data/movies.json').then(resp => resp.json()),
            fetch('data/adaptations_fidelity.json').then(resp => resp.json())
        ])
        .then(([books, movies, adaptations]) => {
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
        bookCover.src = book.cover_image;
        bookCover.alt = `${book.title} Cover`;
        bookCover.className = 'card-image';
        front.appendChild(bookCover);

        // Back of the card (Movie Poster)
        const back = document.createElement('div');
        back.className = 'card-back';
        const moviePoster = document.createElement('img');
        moviePoster.src = movie.poster_image;
        moviePoster.alt = `${movie.title} Poster`;
        moviePoster.className = 'card-image';
        back.appendChild(moviePoster);

        cardInner.appendChild(front);
        cardInner.appendChild(back);
        card.appendChild(cardInner);
        cardContainer.appendChild(card);

        // Add click event to open modal
        card.addEventListener('click', function() {
            showDetails(book, movie, adaptation);
        });

        return cardContainer;
    }

    function showDetails(book, movie, adaptation) {
        document.getElementById('bookDetails').innerHTML = `
            <h3>Book Details</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
            <p><strong>Published:</strong> ${book.published_date} by ${book.publisher}</p>
            <p><strong>Category:</strong> ${book.category}</p>
        `;

        document.getElementById('movieDetails').innerHTML = `
            <h3>Movie Details</h3>
            <p><strong>Director:</strong> ${movie.crew?.directors}</p>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>IMDb Rating:</strong> ${movie.details?.audience_reception?.imdb_rating}/10</p>
        `;

        generateRatingsChart(adaptation);

        const modal = document.getElementById('myModal');
        modal.style.display = 'block'; // Show the modal
    }

    function generateRatingsChart(adaptation) {
        const ctx = document.getElementById('ratingsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Audience', 'Critics'],
                datasets: [{
                    label: 'Score',
                    data: [adaptation.audience_score_on_fidelity, adaptation.critics_score_on_fidelity],
                    backgroundColor: ['#4caf50', '#ff9800']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }

    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    function openTab(evt, tabName) {
        const tabcontent = document.getElementsByClassName("tabcontent");
        const tablinks = document.getElementsByClassName("tablinks");

        // Hide all tab content
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
        }

        // Remove active class from all tab links
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
        }

        // Show the current tab and add active class to its button
        document.getElementById(tabName).classList.add("active");
        evt.currentTarget.classList.add("active");
    }
});
