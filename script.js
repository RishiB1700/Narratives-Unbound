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

        const front = document.createElement('div');
        front.className = 'card-front';
        const bookCover = document.createElement('img');
        bookCover.src = book.cover_image;
        bookCover.alt = `${book.title} Cover`;
        bookCover.className = 'card-image';
        front.appendChild(bookCover);

        const back = document.createElement('div');
        back.className = `card-back verdict-${adaptation.book_to_screen_adaptation_index.toLowerCase()}`;
        const moviePoster = document.createElement('img');
        moviePoster.src = movie.poster_image;
        moviePoster.alt = `${movie.title} Poster`;
        moviePoster.className = 'card-image';
        back.appendChild(moviePoster);

        const verdictCaption = document.createElement('div');
        verdictCaption.className = 'verdict-caption';
        verdictCaption.textContent = adaptation.book_to_screen_adaptation_index;
        back.appendChild(verdictCaption);

        card.addEventListener('mouseenter', () => {
            verdictCaption.classList.add('show-caption');
            setTimeout(() => {
                verdictCaption.classList.remove('show-caption');
            }, 1500);
        });

        cardInner.appendChild(front);
        cardInner.appendChild(back);
        card.appendChild(cardInner);
        cardContainer.appendChild(card);

        card.addEventListener('click', function() {
            const detailsHtml = generateDetailHtml(book, movie, adaptation);
            showDetails(detailsHtml, adaptation);
        });

        return cardContainer;
    }

    function generateDetailHtml(book, movie, adaptation) {
        let html = `<div><h2>${book.title} - Detailed View</h2>
        <h3>Book Details:</h3>
        <p>Author: ${book.author} <span class="info-icon" title="Author of the book">i</span></p>
        <p>Pages: ${book.pages} <span class="info-icon" title="Total number of pages">i</span></p>
        <p>Published: ${book.published_date} by ${book.publisher}</p>`;

        if (movie) {
            html += `<h3>Movie Details:</h3>
            <p>Director: ${movie.crew?.directors || 'N/A'}</p>
            <p>IMDb Rating: <span id="imdbRating">0</span>/10</p>
            <div id="ratingsChartContainer">
                <canvas id="ratingsChart"></canvas>
            </div>`;
        }

        html += `<div id="wordCloudContainer"></div></div>`;
        return html;
    }

    function showDetails(html, adaptation) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = html;

        // Create chart after setting modal content
        createChart('ratingsChart', ['Audience', 'Critics'], [adaptation.audience_score_on_fidelity, adaptation.critics_score_on_fidelity]);

        // Generate word cloud
        generateWordCloud([
            ['Engaging', 20], ['Slow-paced', 10], ['Emotional', 15], ['Predictable', 8]
        ]);

        // Animate counters
        animateCounter(document.getElementById('imdbRating'), 0, parseFloat(adaptation.audience_score_on_fidelity), 1000);

        const modal = document.getElementById('myModal');
        modal.style.display = 'block';
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

    function createChart(containerId, labels, data) {
        const ctx = document.getElementById(containerId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score',
                    data: data,
                    backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
                    borderColor: '#333',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }

    function generateWordCloud(words) {
        WordCloud(document.getElementById('wordCloudContainer'), { list: words });
    }

    function animateCounter(element, start, end, duration) {
        let current = start;
        const increment = (end - start) / (duration / 20);
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current.toFixed(1);
            if (current >= end) {
                clearInterval(timer);
                element.textContent = end.toFixed(1);
            }
        }, 20);
    }
});
