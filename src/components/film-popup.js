import AbstractSmartComponent from "./abstract-smart-component";
import {formatDateByMask, formatDateFromNow, getFormatDateDuration} from "../utils/common";
import {DATE_FORMAT, EMOTIONS} from "../const";
import {encode} from "he";

const createGenres = (genre) => {
  return `<span class="film-details__genre">${genre}</span>`;
};

const createComment = (comment) => {
  const {emotion, date, author, text, id} = comment;
  const dateFormat = formatDateFromNow(date);
  return (
    `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${dateFormat}</span>
            <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
          </p>
        </div>
      </li>`
  );
};

const createEmotionList = (type, isChecked) => {
  const checked = isChecked ? `checked` : ``;
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${type}" value="${type}" ${checked}>
    <label class="film-details__emoji-label" for="emoji-${type}">
      <img src="./images/emoji/${type}.png" width="30" height="30" alt="emoji">
    </label>`
  );
};

const createFilmPopupTemplate = (film, comment = {}) => {
  const {
    title, titleOriginal, poster, description, comments, rating, duration, inWatchList, inWatched, inFavorite,
    genres, release, country, director, writers, actors, category,
  } = film;

  const commentsCount = comments ? comments.length : 0;
  const commentsList = commentsCount ? comments.map((it) => createComment(it)).join(`\n`) : ``;
  const genresList = genres.map((it) => createGenres(it)).join(`\n`);
  const isWatchList = inWatchList ? `checked` : ``;
  const isWatched = inWatched ? `checked` : ``;
  const isFavorite = inFavorite ? `checked` : ``;
  const releaseDate = formatDateByMask(release, DATE_FORMAT.DATE);
  const commentEmoji = comment.emotion ? comment.emotion : `smile`;
  const commentText = comment.text ? comment.text : ``;
  const emotionList = EMOTIONS.map((it) => createEmotionList(it, commentEmoji === it)).join(`\n`);
  const durationHuman = getFormatDateDuration(duration);
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

              <p class="film-details__age">${category}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${titleOriginal}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${durationHuman}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${genres.length > 1 ? `s` : ``}</td>
                  <td class="film-details__cell">${genresList}</td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchList}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

            <ul class="film-details__comments-list">${commentsList}</ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                <img src="images/emoji/${commentEmoji}.png" width="55" height="55" alt="emoji-${commentEmoji}">
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText}</textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emotionList}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmPopup extends AbstractSmartComponent {

  constructor(film) {
    super();
    this._film = film;
    this._filmPopupCommentDeleteButtonClickHandler = null;
    this._filmPopupCloseButtonClickHandler = null;
    this._filmPopupFavoritesButtonClickHandler = null;
    this._filmPopupWatchedButtonClickHandler = null;
    this._filmPopupWatchlistButtonClickHandler = null;
    this._subscribeOnEvents();
    this._comment = {
      emotion: `smile`
    };
  }

  getCommentData() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);
    return {
      text: encode(formData.get(`comment`)),
      emotion: formData.get(`comment-emoji`),
    };
  }

  getFilmData() {
    return this._film;
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film, this._comment);
  }

  recoveryListeners() {
    this.setCommentDeleteButtonClickHandler(this._filmPopupCommentDeleteButtonClickHandler);
    this.setClickCloseButtonHandler(this._filmPopupCloseButtonClickHandler);
    this.setFavoritesButtonClickHandler(this._filmPopupFavoritesButtonClickHandler);
    this.setWatchedButtonClickHandler(this._filmPopupWatchedButtonClickHandler);
    this.setWatchlistButtonClickHandler(this._filmPopupWatchlistButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  setClickCloseButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._filmPopupCloseButtonClickHandler = handler;
  }

  setCommentDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `BUTTON`) {
        return;
      }
      evt.preventDefault();
      handler(evt.target.dataset.commentId);
    });
    this._filmPopupCommentDeleteButtonClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);
    this._filmPopupFavoritesButtonClickHandler = handler;
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);
    this._filmPopupWatchedButtonClickHandler = handler;
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);
    this._filmPopupWatchlistButtonClickHandler = handler;
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._comment.emotion = evt.target.value;
      this._comment = this.getCommentData();
      this.rerender();
    });
  }
}
