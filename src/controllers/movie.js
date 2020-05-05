import {remove, render, replace} from "../utils/render";
import Film from "../components/film";
import FilmPopup from "../components/film-popup";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {

  /**
   * @param {Element} container
   * @param {function} onDataChange
   * @param {function} onViewChange
   */
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._pressEscape = this._pressEscape.bind(this);
  }

  /**
   * @param {Object} film
   * */
  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldPopupComponent = this._filmPopupComponent;
    this._filmComponent = new Film(film);
    this._filmPopupComponent = new FilmPopup(film);

    this._filmComponent.setClickTitleHandler(() => {
      this._showPopup();
    });
    this._filmComponent.setClickPosterHandler(() => {
      this._showPopup();
    });
    this._filmComponent.setClickCommentsHandler(() => {
      this._showPopup();
    });
    this._filmComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        inWatchList: !film.inWatchList,
      }));
    });
    this._filmComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        inWatched: !film.inWatched,
      }));
    });
    this._filmComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        inFavorite: !film.inFavorite,
      }));
    });

    this._filmPopupComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        inFavorite: !film.inFavorite,
      }));
    });
    this._filmPopupComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        inWatched: !film.inWatched,
      }));
    });
    this._filmPopupComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        inWatchList: !film.inWatchList,
      }));
    });

    this._filmPopupComponent.setClickCloseButtonHandler(() => {
      this._hidePopup();
    });

    if (oldPopupComponent) {
      replace(this._filmPopupComponent, oldPopupComponent);
    }
    if (oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hidePopup();
    }
  }

  _hidePopup() {
    this._mode = Mode.DEFAULT;
    const bodyElement = document.querySelector(`body`);
    bodyElement.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._pressEscape);
    remove(this._filmPopupComponent);
  }

  _pressEscape(event) {
    const isEscapeKey = event.key === `Escape` || event.key === `Esc`;
    if (isEscapeKey) {
      this._hidePopup();
    }
  }

  _showPopup() {
    this._onViewChange();
    const bodyElement = document.querySelector(`body`);
    bodyElement.classList.add(`hide-overflow`);
    this._filmPopupComponent.rerender();
    render(bodyElement, this._filmPopupComponent);
    document.addEventListener(`keydown`, this._pressEscape);
    this._mode = Mode.POPUP;
  }
}
