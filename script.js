document.addEventListener("DOMContentLoaded", function () {
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
            console.error('Error loading data:', error);
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

        // Front side
        const front = document.createElement('div');
        front.className = 'card-front';
        const bookCover = document.createElement('img');
        bookCover.src = book.cover_image;
        bookCover.alt = `${book.title} Cover`;
        bookCover.className = 'card-image';
        front.appendChild(bookCover);

        // Back side
        const back = document.createElement('div');
        back.className = `card-back verdict-${adaptation.book_to_screen_adaptation_index.toLowerCase()}`;
        const moviePoster = document.createElement('img');
        moviePoster.src = movie.poster_image;
        moviePoster.alt = `${movie.title} Poster`;
        moviePoster.className = 'card-image';
        back.appendChild(moviePoster);

        cardInner.appendChild(front);
        cardInner.appendChild(back);
        card.appendChild(cardInner);
        cardContainer.appendChild(card);

        // Click event for modal
        card.addEventListener('click', function () {
            const detailsHtml = generateDetailHtml(book, movie, adaptation);
            showDetails(detailsHtml);
        });

        return cardContainer;
    }

    function generateDetailHtml(book, movie, adaptation) {
        return `
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
        `;
    }

    function showDetails(html) {
        const modal = document.getElementById('myModal');
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = html;
        modal.style.display = 'block';
    }

    document.querySelector('.close').onclick = function () {
        document.getElementById('myModal').style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === document.getElementById('myModal')) {
            document.getElementById('myModal').style.display = 'none';
        }
    };
});
