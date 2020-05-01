import UserRank from "./components/user-rank";
import SiteMenu from "./components/site-menu";
import Sort from "./components/sort";
import Films from "./components/films";
import Film from "./components/film";
import FilmPopup from "./components/film-popup";
import FooterStat from "./components/footer-stat";
import MoreButton from "./components/more-button";
import FilmsExtra from "./components/film-extra";
import NoFilmsComponent from './components/no-films';

import {generateFilms} from "./mock/film.js";
import {generateUserRank} from "./mock/user-rank.js";
import {render} from "./utils";
import {RENDER_AFTER} from "./const";

const FILM_COUNT = 22;
const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const EXTRA_FILM_COUNT = 2;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatElement = document.querySelector(`.footer__statistics`);

const user = generateUserRank();
const userRank = new UserRank(user);
render(siteHeaderElement, userRank.getElement());

const renderFilm = (filmListElement, film) => {
  const filmCard = new Film(film).getElement();
  const filmCardPoster = filmCard.querySelector(`.film-card__poster`);
  const filmCardTitle = filmCard.querySelector(`.film-card__title`);
  const filmCardComments = filmCard.querySelector(`.film-card__comments`);

  const filmPopup = new FilmPopup(film).getElement();
  const bodyElement = document.body;

  const showPopup = () => {
    bodyElement.classList.add(`hide-overflow`);
    bodyElement.appendChild(filmPopup);
    document.addEventListener(`keydown`, pressEscape);
  };

  const hidePopup = () => {
    bodyElement.removeChild(filmPopup);
    bodyElement.classList.remove(`hide-overflow`);
  };

  const pressEscape = (event) => {
    const isEscapeKey = event.key === `Escape` || event.key === `Esc`;
    if (isEscapeKey) {
      hidePopup();
      document.removeEventListener(`keydown`, pressEscape);
    }
  };

  filmCardPoster.addEventListener(`click`, showPopup);
  filmCardTitle.addEventListener(`click`, showPopup);
  filmCardComments.addEventListener(`click`, showPopup);

  const PopupCloseButton = filmPopup.querySelector(`.film-details__close-btn`);
  PopupCloseButton.addEventListener(`click`, hidePopup);

  render(filmListElement, filmCard);
};

const renderFilmsBoard = (container, films) => {

  if (films.length === 0) {
    render(container, new NoFilmsComponent().getElement());
    return;
  }

  const filmsBoard = new Films();
  render(container, filmsBoard.getElement());
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

  const mostCommented = new FilmsExtra(`Most commented`).getElement();
  const mostCommentedList = mostCommented.querySelector(`.films-list__container`);
  topCommentFilms.forEach((film) => renderFilm(mostCommentedList, film));
  render(filmsList, mostCommented, RENDER_AFTER);

  const topRated = new FilmsExtra(`Top rated`).getElement();
  const topRatedList = topRated.querySelector(`.films-list__container`);
  topRatingFilms.forEach((film) => renderFilm(topRatedList, film));
  render(filmsList, topRated, RENDER_AFTER);

  const moreButton = new MoreButton().getElement();

  render(filmsList, moreButton);

  moreButton.addEventListener(`click`, () => {
    const prevFilmCount = showingFilmCount;
    showingFilmCount = showingFilmCount + SHOWING_FILM_COUNT_BY_BUTTON;

    films.slice(prevFilmCount, showingFilmCount)
      .forEach((film) => renderFilm(siteFilmsListElement, film));

    if (showingFilmCount >= films.length) {
      moreButton.remove();
    }
  });
};

const films = generateFilms(FILM_COUNT);

const siteMenu = new SiteMenu(films);
render(siteMainElement, siteMenu.getElement());

render(siteMainElement, new Sort().getElement());
render(siteFooterStatElement, new FooterStat(films.length).getElement());

renderFilmsBoard(siteMainElement, films);
