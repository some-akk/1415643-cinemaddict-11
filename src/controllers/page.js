import Film from "../components/film";
import FilmPopup from "../components/film-popup";
import Films from "../components/films";
import FilmsExtra from "../components/film-extra";
import MoreButton from "../components/more-button";
import {remove, render, RENDER_AFTER} from "../utils/render";

const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const EXTRA_FILM_COUNT = 2;

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


export class PageController {

  constructor(container) {
    this._container = container;
  }

  render(films) {
    const filmsBoard = new Films();
    render(this._container, filmsBoard);

    const filmsList = document.querySelector(`.films-list`);
    const siteFilmsListElement = filmsList.querySelector(`.films-list__container`);

    let showingFilmCount = SHOWING_FILM_COUNT_ON_START;
    films.slice(0, showingFilmCount)
      .forEach((film) => renderFilm(siteFilmsListElement, film));

    const topRatingFilms = films.sort((first, second) => {
      return second.rating - first.rating;
    }).slice(0, EXTRA_FILM_COUNT);

    const topCommentFilms = films.sort((first, second) => {
      return second.comments.length - first.comments.length;
    }).slice(0, EXTRA_FILM_COUNT);

    const mostCommented = new FilmsExtra(`Most commented`);
    const mostCommentedList = mostCommented.getElement().querySelector(`.films-list__container`);
    topCommentFilms.forEach((film) => renderFilm(mostCommentedList, film));
    render(filmsList, mostCommented, RENDER_AFTER);

    const topRated = new FilmsExtra(`Top rated`);
    const topRatedList = topRated.getElement().querySelector(`.films-list__container`);
    topRatingFilms.forEach((film) => renderFilm(topRatedList, film));
    render(filmsList, topRated, RENDER_AFTER);

    const moreButton = new MoreButton();

    render(filmsList, moreButton);

    moreButton.setClickHandler(() => {
      const prevFilmCount = showingFilmCount;
      showingFilmCount = showingFilmCount + SHOWING_FILM_COUNT_BY_BUTTON;

      films.slice(prevFilmCount, showingFilmCount)
        .forEach((film) => renderFilm(siteFilmsListElement, film));

      if (showingFilmCount >= films.length) {
        remove(moreButton);
      }
    });
  }
}
