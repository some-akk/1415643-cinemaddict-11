import {FilterType} from "../const";
import {getFilmsByFilter} from "../utils/filter";

export default class Movies {

  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
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
