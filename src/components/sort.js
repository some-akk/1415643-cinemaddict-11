import AbstractComponent from "./abstract-component";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
  COMMENTS: `comments`,
};

const sortOrders = [
  {key: SortType.DEFAULT, title: `default`},
  {key: SortType.DATE, title: `date`},
  {key: SortType.RATING, title: `rating`},
];

const createSortMarkup = (order, isActive) => {
  const activeClass = isActive ? `sort__button--active` : ``;
  return `<li><a href="#" class="sort__button ${activeClass}" data-sort-type="${order.key}">Sort by ${order.title}</a></li>`;
};


const createSortTemplate = (sortType) => {
  const sortMarkup = sortOrders.map((type) => createSortMarkup(type, type.key === sortType)).join(`\n`);
  return (
    `<ul class="sort">
        ${sortMarkup}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {

  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }
      this.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);
      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      handler(this._currentSortType);
    });
  }
}
