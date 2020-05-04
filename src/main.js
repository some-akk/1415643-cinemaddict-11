import UserRank from "./components/user-rank";
import SiteMenu from "./components/site-menu";
import Sort from "./components/sort";
import FooterStat from "./components/footer-stat";
import {generateFilms} from "./mock/film";
import {generateUserRank} from "./mock/user-rank";
import {render} from "./utils/render";
import {PageController} from "./controllers/page";

const FILM_COUNT = 18;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatElement = document.querySelector(`.footer__statistics`);

const user = generateUserRank();
const userRank = new UserRank(user);
render(siteHeaderElement, userRank);

const films = generateFilms(FILM_COUNT);
const siteMenu = new SiteMenu(films);

render(siteMainElement, siteMenu);
render(siteMainElement, new Sort());
render(siteFooterStatElement, new FooterStat(films.length));

const page = new PageController(siteMainElement);
page.render(films);
