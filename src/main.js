import {createUserRankTemplate} from "./components/user-rank.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createSortTemplate} from "./components/sort.js";
import {createFilmsTemplate} from "./components/films.js";
import {createFilmTemplate} from "./components/film.js";
import {createExtraFilmTemplate} from "./components/extra-film.js";
import {createShowMoreButtonTemplate} from "./components/more-button.js";
import {createFooterStatTemplate} from "./components/footer-stat.js";
import {createFilmPopupTemplate} from "./components/film-popup.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatElement = document.querySelector(`.footer__statistics`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createUserRankTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteFooterStatElement, createFooterStatTemplate(), `beforeend`);
render(siteMainElement, createFilmsTemplate(), `beforeend`);
render(siteFooterElement, createFilmPopupTemplate(), `afterend`);

const siteFilmsListElement = document.querySelector(`.films-list .films-list__container`);

render(siteFilmsListElement, createShowMoreButtonTemplate(), `afterend`);

for (let i = 0; i < FILM_COUNT; i++) {
  render(siteFilmsListElement, createFilmTemplate(), `beforeend`);
}

const siteExtraFilmsListElement = document.querySelectorAll(`.films-list--extra .films-list__container`);

siteExtraFilmsListElement.forEach((it) => {
  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    render(it, createExtraFilmTemplate(), `beforeend`);
  }
});
