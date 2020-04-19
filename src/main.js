import UserRank from "./components/user-rank";
import SiteMenu from "./components/site-menu";
import Sort from "./components/sort";
import Films from "./components/films";
import Film from "./components/film";
import FilmPopup from "./components/film-popup";
import FooterStat from "./components/footer-stat";
import MoreButton from "./components/more-button";

import {generateFilms} from "./mock/film.js";
import {generatePopup} from "./mock/film-popup.js";
import {generateUserRank} from "./mock/user-rank.js";
import {render} from "./utils";

const FILM_COUNT = 18;
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

  const popupData = generatePopup(film);
  const filmPopup = new FilmPopup(popupData).getElement();
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
    switch (event.key) {
      case `Escape`:
      case `Esc`:
        hidePopup();
        document.removeEventListener(`keydown`, pressEscape);
        break;
    }
  };

  filmCardPoster.addEventListener(`click`, showPopup);
  filmCardTitle.addEventListener(`click`, showPopup);
  filmCardComments.addEventListener(`click`, showPopup);

  const PopupCloseButton = filmPopup.querySelector(`.film-details__close-btn`);
  PopupCloseButton.addEventListener(`click`, hidePopup);

  render(filmListElement, filmCard);
};

const renderFilmsBoard = (filmsBoard, films) => {

  const filmsList = document.querySelector(`.films-list`);
  const siteFilmsListElement = filmsList.querySelector(`.films-list__container`);
  const siteExtraFilmsListElement = filmsList.querySelectorAll(`.films-list--extra .films-list__container`);

  let showingFilmCount = SHOWING_FILM_COUNT_ON_START;
  films.slice(0, showingFilmCount)
    .forEach((film) => renderFilm(siteFilmsListElement, film));

  siteExtraFilmsListElement.forEach((it) => {
    const filmsExtra = generateFilms(EXTRA_FILM_COUNT);
    filmsExtra.forEach((film) => renderFilm(it, film));
  });

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

const filmsBoard = new Films();
render(siteMainElement, filmsBoard.getElement());

renderFilmsBoard(filmsBoard, films);
