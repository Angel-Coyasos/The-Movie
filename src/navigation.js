let maxPage;
let page = 1;
let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`;
});
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});
arrowBtn.addEventListener('click', () => {
    history.back();
    /* location.hash = window.history.back(); */
})

window.addEventListener('DOMContentLoaded', navigator , false);
window.addEventListener('hashchange', navigator , false);
window.addEventListener('scroll', infiniteScroll, false);

function navigator () {
    console.log(location);

    //validacion para cada vez que llamemos a navegator para qeu podamos volver a cambiar a navegation;
    if (infiniteScroll) {
        window.removeEventListener( 'scroll', infiniteScroll, { passive: false } );
        infiniteScroll = undefined;
    }

    if ( location.hash.startsWith('#trends') ) {
        trendsPage();
    } else if ( location.hash.startsWith('#search=') ) {
        searchPage();
    } else if ( location.hash.startsWith('#movie=') ) {
        movieDatailsPage();
    } else if ( location.hash.startsWith('#category=') ) {
        categoriesPage();
    } else {
        homePage();
    }

    /* document.body.scrollTop = 0; */
    /* document.documentElement.scrollTop = 0; */
    window.scrollTo(0, 0);

    //validacion para asignar el event listener para ejecutarse cada vez que hacemos scrol.
    if (infiniteScroll) {
        window.addEventListener( 'scroll', infiniteScroll, { passive: false } );
    }
}

function trendsPage () {

    console.log('TRENDS!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSecction.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies();

    infiniteScroll = getPaginedTrendingMovies;

}
function searchPage () {

    console.log('SEARCH!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSecction.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

     //['#search', 'buscado']
     const [ _, query ] = location.hash.split('=');
 
     getMoviesBySearch(query);
     infiniteScroll = getPaginedMoviesBySearch(query);

}
function movieDatailsPage () {

    console.log('MOVIE!!');

    headerSection.classList.add('header-container--long');
  /*   headerSection.style.background = ''; */
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSecction.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    //['#movie', 'id']
    const [ _, movieId ] = location.hash.split('=');

    getMovieById(movieId);

}
function categoriesPage () {

    console.log('CATEGORIES!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive')
    likedMoviesSecction.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    //['#category', 'id-name']
    const [ _, categoryData ] = location.hash.split('=');
    //['Id', 'Name']
    const [ categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerHTML = categoryName;

    getMoviesByCategory(categoryId);

    infiniteScroll =  getPaginedMoviesByCategory(categoryId);

}
function homePage () {

    console.log('HOME!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSecction.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikeMovies();

}