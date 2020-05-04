import AbstractComponent from "./abstract-component";

const getRankTitle = (rank) => {
  if (!rank) {
    return ``;
  }
  if (rank >= 21) {
    return `Movie Buff`;
  }
  if (rank >= 11) {
    return `Fan`;
  }
  return `Novice`;
};

const createUserRankTemplate = (user) => {
  const {rank, avatar} = user;
  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${getRankTitle(rank)}</p>
    <img class="profile__avatar" src="images/${avatar}" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserRank extends AbstractComponent {

  constructor(user) {
    super();
    this._user = user;
  }

  getTemplate() {
    return createUserRankTemplate(this._user);
  }
}
