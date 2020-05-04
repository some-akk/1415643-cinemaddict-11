import AbstractComponent from "./abstract-component";

const createFilmsExtraTemplate = (name) => {
  return (
    `<section class="films-list--extra">
        <h2 class="films-list__title">${name}</h2>
        <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmsExtra extends AbstractComponent {

  constructor(name) {
    super();
    this._name = name;
  }

  getTemplate() {
    return createFilmsExtraTemplate(this._name);
  }
}
