import AbstractComponent from "./abstract-component";

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const createFilterMarkup = (filter) => {
  const {title, count, checked} = filter;
  return (
    `<a href="#${title}" class="main-navigation__item ${checked ? `main-navigation__item--active` : ``}">${capitalize(title)}
      ${title === `all` ? `movies` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createSiteMenuTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${filtersMarkup}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {

  /**
   * @param {array} filters
   * */
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const link = evt.target.tagName === `A` ? evt.target.href : evt.target.parentElement.href;
      const filter = link.split(`#`)[1];
      handler(filter);
    });
  }
}
