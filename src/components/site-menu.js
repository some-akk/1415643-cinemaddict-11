import {createElement} from "../utils";

const createFilterMarkup = (filter) => {
  const {title, count} = filter;
  return (
    `<a href="#${title.toLowerCase()}" class="main-navigation__item">${title} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const getFiltersCount = (films) => {
  return [
    {
      title: `Watchlist`,
      count: films.filter((it) => it.inWatchList).length,
    },
    {
      title: `History`,
      count: films.filter((it) => it.inWatched).length,
    },
    {
      title: `Favorites`,
      count: films.filter((it) => it.inFavorite).length,
    },
  ];
};

const createSiteMenuTemplate = (films) => {
  const filters = getFiltersCount(films);
  const filtersMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
          <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
          ${filtersMarkup}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class SiteMenu {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
}
