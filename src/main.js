import {createUserRankTemplate} from "./components/user-rank.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createSortTemplate} from "./components/sort.js";
import {createFilmsTemplate} from "./components/films.js";
import {createFilmTemplate} from "./components/film.js";
import {createShowMoreButtonTemplate} from "./components/more-button.js";
import {createFooterStatTemplate} from "./components/footer-stat.js";
import {createFilmPopupTemplate} from "./components/film-popup.js";
import {generateFilms} from "./mock/film.js";
import {generatePopup} from "./mock/film-popup.js";
import {generateUserRank} from "./mock/user-rank.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const FILM_COUNT = 18;
const SHOWING_FILM_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const EXTRA_FILM_COUNT = 2;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatElement = document.querySelector(`.footer__statistics`);
const siteFooterElement = document.querySelector(`.footer`);

const user = generateUserRank();

const films = generateFilms(FILM_COUNT);
const genresCount = films.reduce(function (o, i) {
  if (!o.hasOwnProperty(i.genre)) {
    o[i.genre] = 0;
  }
  o[i.genre]++;
  return o;
}, {});
const filters = Object.keys(genresCount).map(function (id) {
  return {title: id, count: genresCount[id]};
});

render(siteMainElement, createSiteMenuTemplate(filters), `beforeend`);
render(siteHeaderElement, createUserRankTemplate(user), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmsTemplate(), `beforeend`);

const popupFilm = generatePopup(films[0]);
render(siteFooterElement, createFilmPopupTemplate(popupFilm), `afterend`);

const siteFilmsListElement = document.querySelector(`.films-list .films-list__container`);

render(siteFilmsListElement, createShowMoreButtonTemplate(), `afterend`);

render(siteFooterStatElement, createFooterStatTemplate(films.length), `beforeend`);

let showingFilmCount = SHOWING_FILM_COUNT_ON_START;
films.slice(0, showingFilmCount)
  .forEach((film) => render(siteFilmsListElement, createFilmTemplate(film), `beforeend`));

const siteExtraFilmsListElement = document.querySelectorAll(`.films-list--extra .films-list__container`);

siteExtraFilmsListElement.forEach((it) => {
  const filmsExtra = generateFilms(EXTRA_FILM_COUNT);
  filmsExtra.forEach((film) => render(it, createFilmTemplate(film), `beforeend`));
});

const loadMoreButton = siteMainElement.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevFilmCount = showingFilmCount;
  showingFilmCount = showingFilmCount + SHOWING_FILM_COUNT_BY_BUTTON;

  films.slice(prevFilmCount, showingFilmCount)
    .forEach((film) => render(siteFilmsListElement, createFilmTemplate(film), `beforeend`));

  if (showingFilmCount >= films.length) {
    loadMoreButton.remove();
  }
});

const siteFilmDetails = document.querySelector(`.film-details`);
const closePopupButton = siteFilmDetails.querySelector(`.film-details__close-btn`);

closePopupButton.addEventListener(`click`, () => {
  siteFilmDetails.remove();
});

window.addEventListener(`keydown`, (event) => {
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case `Escape`:
    case `Esc`:
      const popupWindow = document.querySelector(`.film-details`);
      if (popupWindow) {
        popupWindow.remove();
      }
      event.preventDefault();
      break;
  }
}, true);
