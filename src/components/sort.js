import {createElement} from "../utils";

const sortOrders = [
  `default`,
  `date`,
  `rating`,
];

const createSortMarkup = (type, isActive) => {
  const activeClass = isActive ? `sort__button--active` : ``;
  return `<li><a href="#" class="sort__button ${activeClass}">Sort by ${type}</a></li>`;
};


const createSortTemplate = () => {
  const sortMarkup = sortOrders.map((type, index) => createSortMarkup(type, index === 0)).join(`\n`);
  return (
    `<ul class="sort">
        ${sortMarkup}
    </ul>`
  );
};

export default class Sort {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
}
