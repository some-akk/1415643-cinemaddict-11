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
    this._filmId = null;
    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._pressKeys = this._pressKeys.bind(this);
  }

  destroy() {
    remove(this._filmPopupComponent);
    remove(this._filmComponent);
    document.removeEventListener(`keydown`, this._pressKeys);
  }

  /**
   * @param {Object} film
   * */
  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldPopupComponent = this._filmPopupComponent;
    this._filmId = film.id;
    this._filmComponent = new Film(film);
    this._filmPopupComponent = new FilmPopup(film);

    this._setFilmCardHandlers(film);
    this._setFilmPopupHandlers(film);

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
    document.removeEventListener(`keydown`, this._pressKeys);
    remove(this._filmPopupComponent);
  }

  _pressKeys(event) {
    const isEscapeKey = event.key === `Escape` || event.key === `Esc`;
    const isCtrlEnter = event.key === `Enter` && event.ctrlKey;
    if (isEscapeKey) {
      this._hidePopup();
    } else if (isCtrlEnter) {
      this._saveComment();
    }
  }

  _saveComment() {
    const filmData = this._filmPopupComponent.getFilmData();
    const commentData = this._filmPopupComponent.getCommentData();
    if (commentData.text && commentData.emotion) {
      const comments = [].concat(filmData.comments, Object.assign(commentData, {author: `User Name`, date: new Date()}));
      this._onDataChange(this, filmData, Object.assign({}, filmData, {comments}));
    }
  }

  _setFilmCardHandlers(film) {
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
  }

  _setFilmPopupHandlers(film) {
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

    this._filmPopupComponent.setCommentDeleteButtonClickHandler((id) => {
      const index = film.comments.findIndex((it) => it.id === id);
      const comments = [].concat(film.comments.slice(0, index), film.comments.slice(index + 1));
      this._onDataChange(this, film, Object.assign({}, film, {comments}));
    });
  }

  _showPopup() {
    this._onViewChange();
    const bodyElement = document.querySelector(`body`);
    bodyElement.classList.add(`hide-overflow`);
    this._filmPopupComponent.rerender();
    render(bodyElement, this._filmPopupComponent);
    document.addEventListener(`keydown`, this._pressKeys);
    this._mode = Mode.POPUP;
  }
}
