import AbstractComponent from "./abstract-component";

const createFooterStatTemplate = (number) => {
  const filmCount = new Intl.NumberFormat(`ru-RU`).format(number);
  return `<p>${filmCount} movies inside</p>`;
};

export default class FooterStat extends AbstractComponent {

  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStatTemplate(this._films);
  }
}
