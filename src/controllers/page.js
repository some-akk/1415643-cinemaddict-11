import Film from "../components/film";
import FilmPopup from "../components/film-popup";
import Films from "../components/films";
import FilmsExtra from "../components/film-extra";
import NoFilms from "../components/no-films";
import MoreButton from "../components/more-button";
import Sort, {SortType} from "../components/sort";
import {remove, render, RENDER_AFTER} from "../utils/render";

const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const EXTRA_FILM_COUNT = 2;


/**
 * @param {Element} filmListElement
 * @param {Object} film
 */
const renderFilm = (filmListElement, film) => {
  const showPopup = () => {
    bodyElement.classList.add(`hide-overflow`);
    bodyElement.appendChild(filmPopup.getElement());
    document.addEventListener(`keydown`, pressEscape);
    filmPopup.setClickCloseButtonHandler(hidePopup);
  };

  const hidePopup = () => {
    bodyElement.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, pressEscape);
    remove(filmPopup);
  };

  const pressEscape = (event) => {
    const isEscapeKey = event.key === `Escape` || event.key === `Esc`;
    if (isEscapeKey) {
      hidePopup();
    }
  };

  const bodyElement = document.querySelector(`body`);
  const filmCard = new Film(film);
  const filmPopup = new FilmPopup(film);

  filmCard.setClickPosterHandler(showPopup);
  filmCard.setClickTitleHandler(showPopup);
  filmCard.setClickCommentsHandler(showPopup);

  render(filmListElement, filmCard);
};


/**
 *
 * @param {Element} listElement
 * @param {array} filmsList
 */
const renderFilms = (listElement, filmsList) => {
  filmsList.forEach((film) => renderFilm(listElement, film));
};


/**
 * @param {Element} container
 * @param {string} componentName
 * @param {array} filmsList
 */
const renderExtraFilms = (container, componentName, filmsList) => {
  const component = new FilmsExtra(componentName);
  const mostCommentedList = component.getElement().querySelector(`.films-list__container`);
  renderFilms(mostCommentedList, filmsList);
  render(container, component, RENDER_AFTER);
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
      sortedFilms = filmsDefaultOrder.sort((a, b) => a.release.getTime() - b.release.getTime());
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
  }

  /**
   * @param {Object[]} films
   */
  render(films) {

    if (films.length === 0) {
      render(this._container, new NoFilms());
      return;
    }

    const renderShowMoreButton = () => {
      if (showingFilmCount >= films.length) {
        return;
      }

      remove(this._moreButtonComponent);
      render(filmsList, this._moreButtonComponent);

      this._moreButtonComponent.setClickHandler(() => {
        const prevFilmsCount = showingFilmCount;
        showingFilmCount = showingFilmCount + SHOWING_FILM_COUNT_BY_BUTTON;
        const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmsCount, showingFilmCount);

        renderFilms(siteFilmsListElement, sortedFilms);

        if (showingFilmCount >= films.length) {
          remove(this._moreButtonComponent);
        }
      });
    };

    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);

    const filmsList = document.querySelector(`.films-list`);
    const siteFilmsListElement = filmsList.querySelector(`.films-list__container`);
    let showingFilmCount = SHOWING_FILM_COUNT_ON_START;

    renderFilms(siteFilmsListElement, films.slice(0, showingFilmCount));
    renderShowMoreButton();

    const topCommentFilms = getSortedFilms(films, SortType.COMMENTS, 0, EXTRA_FILM_COUNT);
    renderExtraFilms(filmsList, `Most commented`, topCommentFilms);

    const topRatingFilms = getSortedFilms(films, SortType.RATING, 0, EXTRA_FILM_COUNT);
    renderExtraFilms(filmsList, `Top rated`, topRatingFilms);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingFilmCount = SHOWING_FILM_COUNT_ON_START;
      siteFilmsListElement.innerHTML = ``;
      const sortedFilms = getSortedFilms(films, sortType, 0, showingFilmCount);
      renderFilms(siteFilmsListElement, sortedFilms);
      renderShowMoreButton();
    });
  }
}
