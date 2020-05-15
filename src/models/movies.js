import {FilterType, StatisticsFilterName} from "../const";
import {getFilmsByFilter} from "../utils/filter";

export default class Movies {

  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  isStatisticsFilter() {
    return this._activeFilterType === StatisticsFilterName;
  }

  /**
   * @return {array}
   * */
  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  /**
   * @return {array}
   * */
  getFilmsAll() {
    return this._films;
  }

  getStatistics() {
    const films = this.getWatchedFilms();
    const genreGroups = films.reduce((genres, film) => {
      for (const genre of film.genres) {
        const exist = genres.find(({title}) => genre === title);
        if (!exist) {
          genres.push({title: genre, count: 1});
        } else {
          exist.count++;
        }
      }
      return genres;
    }, []);

    return {
      count: films.length,
      duration: films.reduce((a, b) => a + b.duration, 0),
      genres: genreGroups.slice().sort((a, b) => b.count - a.count)
    };
  }

  getWatchedCounter() {
    return this.getWatchedFilms().length;
  }

  getWatchedFilms() {
    return getFilmsByFilter(this._films, FilterType.HISTORY);
  }

  /**
   * @param {Object[]} films
   * */
  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  /**
   * @param {string} filterType
   * */
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  /**
   * @param {number} id
   * @param {Object} film
   * @return {boolean}
   * */
  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
