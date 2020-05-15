import AbstractComponent from "./abstract-component";
import {StatisticsFilterName} from "../const";

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const createFilterMarkup = (filter) => {
  const {title, count, checked} = filter;
  return (
    `<a href="#${title}" class="main-navigation__item ${checked ? `main-navigation__item--active` : ``}">${capitalize(title)}
      ${title === `all` ? `movies` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createSiteMenuTemplate = (filters, activeFilter) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);
  const statsActive = activeFilter === StatisticsFilterName ? `main-navigation__item--active` : ``;
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${filtersMarkup}
        </div>
        <a href="#stats" class="main-navigation__additional ${statsActive}">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {

  /**
   * @param {array} filters
   * @param {string} activeFilter
   * */
  constructor(filters, activeFilter) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._activeFilter);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const targetTag = evt.target.tagName;
      if (targetTag !== `A` && targetTag !== `SPAN`) {
        return;
      }
      const link = targetTag === `A` ? evt.target.href : evt.target.parentElement.href;
      const filter = link.split(`#`)[1];
      handler(filter);
    });
  }
}
