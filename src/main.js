//DATA
const fecthData = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'COntent-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,

    }
});

//funcion para devolver tood lo qeu esta guardo en local store en la clave liked_movies
function likedMoviesList () {
    const item = JSON.parse( localStorage.getItem('liked_movies') );
    let movies;
    if (item) {
        movies = item
    } else {
        movies = {}
    }
    return movies;
}

function likeMovie (movie) {
    //cada movie tiene un id movie.id, la siguient constante es la qeu se encargara de eso haciendo un llama a la funcion qeu previamente programamos para saber si la lista tiene algo o esta vacia.
    const likedMovies = likedMoviesList();

    //la pelicula es local estore?, preguntandole si tiene le movie.id de cada pelicula
    if (likedMovies[movie.id]) {
        //remover de local estore
        likedMovies[movie.id] = undefined;
    } else {
        //agregarla a loca store
        likedMovies[movie.id] = movie;
    }
    //sin importar lo qeu pase en el condicional vamos a volver a guardar el objecto de liked movies, convertido a string
    localStorage.setItem( 'liked_movies', JSON.stringify( likedMovies ) );
};

//Utils
function createMovies (movies, container, 
    {
        lazyLoad = true, 
        clean = true,
    }) {

    if (clean) {
        container.innerHTML = "";
    }

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        const movieImg  = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-src' : 'src', 
            `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            );
        movieImg.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        });
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src', 
                'https://static.platzi.com/static/images/error/img404.png'
                )
        });
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');

        //condicional, para las peliculas qeu esten en el local estore guardadas.
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')

        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            //DEBERIAMOS AGREGAR LA PELIULA A LOCAL STORE
            likeMovie(movie);
            getLikeMovies();
        } );

        /* llamamos el observado creado arriva y le indicamos que vigile nuestra variables moviImg, con eso nos ejecuta lo logica previamente desarrollada. */
        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }
       
        movieContainer.append(movieImg , movieBtn);
        container.appendChild(movieContainer);

    });

}

function createCategories (categories, container) {
    
    container.innerHTML = "";

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle  = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`
        } )
        categoryTitle.setAttribute('id', `id${category.id}`);

        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);

    });

}

// Llamados a la API
async function getTrendingMoviesPreview () {

    const { data } = await fecthData('/trending/movie/day');
    const movies = data.results;

    createMovies (movies, trendingMoviesPreviewList, { lazyLoad: true, clean: true });

}

async function getTrendingMovies () {

    const { data } = await fecthData('/trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies (movies, genericSection, { lazyLoad: true, clean: true });

    /* 
        const btnLoadMore = document.createElement('button');
        btnLoadMore.innerText = 'Cargar Mas';
        btnLoadMore.addEventListener('click', getPaginedTrendingMovies)

        genericSection.appendChild(btnLoadMore); 
    */

}

async function getPaginedTrendingMovies () {

    //constante para destructurar todo lo qeu venga de document,docuemntElement
    const { 
        scrollTop, 
        scrollHeight, 
        clientHeight } = document.documentElement;

    //constante que contine la validacion qeu vamos a hacer de scroll
    const scrollIsBotom = ( scrollTop + clientHeight ) >= ( scrollHeight - 15 );
    const pageIsNotMax = page < maxPage

    //condicional
    if ( scrollIsBotom && pageIsNotMax) {

        page++;

        const { data } = await fecthData('/trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;
    
        createMovies (movies, genericSection, { lazyLoad: true, clean: false });
    
        /* 
            const btnLoadMore = document.createElement('button');
            btnLoadMore.innerText = 'Cargar Mas';
            btnLoadMore.addEventListener('click', getPaginedTrendingMovies)
        
            genericSection.appendChild(btnLoadMore); 
        */

    }

}

async function getMovieById (id) {

    const { data: movie } = await fecthData(`/movie/${id}`);

    const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    headerSection.style.background = `
        linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 19.27%,
            rgba(0, 0, 0, 0) 29.7%
        ),
        url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMovieById(id);

}

async function getRelatedMovieById (id) {

    const { data } = await fecthData(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer, { lazyLoad: true, clean: true });

}

async function getCategoriesPreview () {

    const { data } = await fecthData('/genre/movie/list');
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);

}

async function getMoviesByCategory(id) {

    const { data } = await fecthData('/discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies (movies, genericSection, { lazyLoad: true, clean: true });

}

function getPaginedMoviesByCategory (id) {

    return async function () {

        const { 
            scrollTop, 
            scrollHeight, 
            clientHeight } = document.documentElement;
    
        const scrollIsBotom = ( scrollTop + clientHeight ) >= ( scrollHeight - 15 );
        const pageIsNotMax = page < maxPage
    
        if ( scrollIsBotom && pageIsNotMax) {
    
            page++;
    
            const { data } = await fecthData('/discover/movie', {
                params: {
                    with_genres: id,
                    page,
                }
            });
            const movies = data.results;
        
            createMovies (movies, genericSection, { lazyLoad: true, clean: false } );
    
        }

    }

}

async function getMoviesBySearch(query) {

    const { data } = await fecthData('/search/movie', {
        params: {
            query,
        },
    });

    const movies = data.results;
    maxPage = data.total_pages;

    createMovies (movies, genericSection, { lazyLoad: true, clean: true });

}

function getPaginedMoviesBySearch (query) {

    return async function () {

        const { 
            scrollTop, 
            scrollHeight, 
            clientHeight } = document.documentElement;
    
        const scrollIsBotom = ( scrollTop + clientHeight ) >= ( scrollHeight - 15 );
        const pageIsNotMax = page < maxPage
    
        if ( scrollIsBotom && pageIsNotMax) {
    
            page++;
    
            const { data } = await fecthData('/search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;
        
            createMovies (movies, genericSection, { lazyLoad: true, clean: false });
    
        }

    }

}

function getLikeMovies() {
    
    const likedMovies = likedMoviesList();

    // { keys: 'values', keys: 'values', ... }
    const moviesArray = Object.values(likedMovies);
    // [ 'value', 'value2' ]

    createMovies (moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true } );
    console.log(moviesArray);
}