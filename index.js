const input = document.querySelector("input")
const btn = document.querySelector("button")
const container = document.querySelector("#container")
let apiKey


function searchMovies() {
  console.log('searchMovie() called')
  container.innerHTML = '';
  const param = input.value;
  const promise = fetchMovies(param);
  promise.then((data) => displayMovies(data.Search));
}

async function fetchMovieDetails(param) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?i=${param}&apikey=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data
  }
  catch (error) {
    console.error(`Could not get movies: ${error}`);
  }
}


async function fetchMovies(param) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${param}&apikey=${apiKey}`);
    console.log(response.url)
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data
  }
  catch (error) {
    console.error(`Could not get movies: ${error}`);
  }
}

function displayMovies(movies) {
  for (let i = 0; i < movies.length; i++) {
    buildCard(movies[i]);
  }
}


function newElement(element, className, textContent=null, src=null) {
  const HTMLelement = document.createElement(element);
  HTMLelement.className = className;
  HTMLelement.textContent = textContent;
  HTMLelement.src = src;
  return HTMLelement;
}

async function buildCard(movie) {

  const card = newElement('div', 'card mb-3');
  const cardRow = newElement('div', 'row g-0');
  const cardImgCol = newElement('div', 'col-md-4');
  const cardImg = newElement('img', 'img-fluid rounded-start', null, src=movie.Poster);
  const cardBodyCol = newElement('div', 'col-md-8')
  const cardBody = newElement('div', 'card-body');
  const cardTitle = newElement('h5', 'card-title', movie.Title);
  const cardText = newElement('p', 'card-text', movie.Year);
  const cardBtn = newElement('button', 'btn btn-primary', 'Voir les détails');

  card.appendChild(cardRow);
  cardRow.appendChild(cardImgCol);
  cardImgCol.appendChild(cardImg);
  cardRow.appendChild(cardBodyCol);
  cardBodyCol.appendChild(cardBody);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(cardBtn);
  container.appendChild(card);

  cardBtn.addEventListener('click', function (){
    createModal(movie)
  });
}

async function createModal(movie) {
  console.log("createModal called")
  const moviePromise = fetchMovieDetails(movie.imdbID)
  const modal = newElement('div', "modal");
  let plot = await moviePromise.then((data) => data.Plot)

  modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h5 class="modal-title">${movie.Title}</h5>
        <p>${plot}</p>
      </div>`;

  const closeBtn = modal.querySelector('span');
  container.appendChild(modal);

  closeBtn.addEventListener('click', function () {
    modal.remove();
  })

}
btn.addEventListener('click', searchMovies)
