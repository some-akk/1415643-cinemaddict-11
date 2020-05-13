import {FilterType} from "../const";

export const getFilmsByFilter = (films, filterType) => {

  let filteredFilms = [];
  switch (filterType) {
    case FilterType.ALL:
    default:
      filteredFilms = films;
      break;
    case FilterType.WATCHLIST:
      filteredFilms = films.filter((movie) => movie.inWatchList);
      break;
    case FilterType.HISTORY:
      filteredFilms = films.filter((movie) => movie.inWatched);
      break;
    case FilterType.FAVORITES:
      filteredFilms = films.filter((movie) => movie.inFavorite);
      break;
  }
  return filteredFilms;
};
