import Films from "../components/films";
import FilmsExtra from "../components/film-extra";
import NoFilms from "../components/no-films";
import MoreButton from "../components/more-button";
import Sort, {SortType} from "../components/sort";
import {remove, render, RENDER_AFTER} from "../utils/render";
import MovieController from "./movie";

const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const EXTRA_FILM_COUNT = 2;


/**
 * @param {Element} listElement
 * @param {array} filmsList
 * @param {function} onDataChange
 * @param {function} onViewChange
 * @return {MovieController[]}
 */
const renderFilms = (listElement, filmsList, onDataChange, onViewChange) => {
  return filmsList.map((film) => {
    const movieController = new MovieController(listElement, onDataChange, onViewChange);
    movieController.render(film);
    return movieController;
  });
};


/**
 * @param {Element} container
 * @param {string} componentName
 * @param {array} filmsList
 * @param {function} onDataChange
 * @param {function} onViewChange
 * @return {MovieController[]}
 */
const renderExtraFilms = (container, componentName, filmsList, onDataChange, onViewChange) => {
  const component = new FilmsExtra(componentName);
  const mostCommentedList = component.getElement().querySelector(`.films-list__container`);
  const renderedFilms = renderFilms(mostCommentedList, filmsList, onDataChange, onViewChange);
  render(container, component, RENDER_AFTER);
  return renderedFilms;
};


/**
 * @param {Object[]} filmsList
 * @param {string} sortType
 * @param {number} start
 * @param {number} end
 * @return {array}
 */
const getSortedFilms = (filmsList, sortType, start, end) => {
  const filmsDefaultOrder = filmsList.slice();
  let sortedFilms = [];
  switch (sortType) {
    case SortType.DEFAULT:
    default:
      sortedFilms = filmsDefaultOrder;
      break;
    case SortType.DATE:
      sortedFilms = filmsDefaultOrder.sort((a, b) => b.release.getTime() - a.release.getTime());
      break;
    case SortType.RATING:
      sortedFilms = filmsDefaultOrder.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.COMMENTS:
      sortedFilms = filmsDefaultOrder.sort((a, b) => b.comments.length - a.comments.length);
      break;
  }

  return sortedFilms.slice(start, end);
};


export default class PageController {

  /**
   * @param {Element} container
   */
  constructor(container) {
    this._container = container;
    this._filmsComponent = new Films();
    this._sortComponent = new Sort();
    this._moreButtonComponent = new MoreButton();
    this._noFilmsComponent = new NoFilms();
    this._films = [];
    this._filmsControllers = [];
    this._showingFilmCount = SHOWING_FILM_COUNT_ON_START;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  /**
   * @param {Object[]} films
   */
  render(films) {
    this._films = films;

    if (this._films.length === 0) {
      render(this._container, this._noFilmsComponent);
      return;
    }

    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);

    const filmsList = this._filmsComponent.getElement().querySelector(`.films-list`);
    const siteFilmsListElement = this._filmsComponent.getElement().querySelector(`.films-list__container`);

    const renderedFilms = renderFilms(siteFilmsListElement, this._films.slice(0, this._showingFilmCount), this._onDataChange, this._onViewChange);
    this._filmsControllers = this._filmsControllers.concat(renderedFilms);

    const topCommentFilms = getSortedFilms(this._films, SortType.COMMENTS, 0, EXTRA_FILM_COUNT);
    let renderedExtraFilms = renderExtraFilms(filmsList, `Most commented`, topCommentFilms, this._onDataChange, this._onViewChange);

    const topRatingFilms = getSortedFilms(this._films, SortType.RATING, 0, EXTRA_FILM_COUNT);
    renderedExtraFilms = renderedExtraFilms.concat(renderExtraFilms(filmsList, `Top rated`, topRatingFilms, this._onDataChange, this._onViewChange));
    this._filmsControllers = this._filmsControllers.concat(renderedExtraFilms);

    this._renderShowMoreButton();
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((it) => it.id === oldData.id);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    movieController.render(this._films[index]);
  }

  _onSortTypeChange(sortType) {
    this._showingFilmCount = SHOWING_FILM_COUNT_ON_START;
    const siteFilmsListElement = this._filmsComponent.getElement().querySelector(`.films-list__container`);
    siteFilmsListElement.innerHTML = ``;
    const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingFilmCount);
    const renderedFilms = renderFilms(siteFilmsListElement, sortedFilms, this._onDataChange, this._onViewChange);
    this._filmsControllers = this._filmsControllers.concat(renderedFilms);
    this._renderShowMoreButton();
  }

  _onViewChange() {
    this._filmsControllers.forEach((it) => it.setDefaultView());
  }

  _renderShowMoreButton() {
    if (this._showingFilmCount >= this._films.length) {
      return;
    }

    remove(this._moreButtonComponent);
    const filmsList = this._filmsComponent.getElement().querySelector(`.films-list`);
    render(filmsList, this._moreButtonComponent);

    this._moreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmCount;
      this._showingFilmCount = this._showingFilmCount + SHOWING_FILM_COUNT_BY_BUTTON;
      const siteFilmsListElement = this._filmsComponent.getElement().querySelector(`.films-list__container`);
      const sortedFilms = getSortedFilms(this._films, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmCount);
      const renderedFilms = renderFilms(siteFilmsListElement, sortedFilms, this._onDataChange, this._onViewChange);
      this._filmsControllers = this._filmsControllers.concat(renderedFilms);

      if (this._showingFilmCount >= this._films.length) {
        remove(this._moreButtonComponent);
      }
    });
  }
}
