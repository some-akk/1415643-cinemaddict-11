import AbstractComponent from "./abstract-component";

const createFooterStatTemplate = (number) => {
  const filmCount = new Intl.NumberFormat(`ru-RU`).format(number);
  return `<p>${filmCount} movies inside</p>`;
};

export default class FooterStat extends AbstractComponent {

  /**
   * @param {Movies} movies
   */
  constructor(movies) {
    super();
    this._films = movies.getFilms();
  }

  getTemplate() {
    return createFooterStatTemplate(this._films.length);
  }
}
