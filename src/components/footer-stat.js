import {createElement} from "../utils";

const createFooterStatTemplate = (number) => {
  const filmCount = new Intl.NumberFormat(`ru-RU`).format(number);
  return `<p>${filmCount} movies inside</p>`;
};

export default class FooterStat {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
}
