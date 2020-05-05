import FooterStat from "./components/footer-stat";
import PageController from "./controllers/page";
import SiteMenu from "./components/site-menu";
import UserRank from "./components/user-rank";
import {generateFilms} from "./mock/film";
import {generateUserRank} from "./mock/user-rank";
import {render} from "./utils/render";
import {FILM_COUNT} from "./const";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatElement = document.querySelector(`.footer__statistics`);
const user = generateUserRank();
const films = generateFilms(FILM_COUNT);

render(siteHeaderElement, new UserRank(user));
render(siteMainElement, new SiteMenu(films));
render(siteFooterStatElement, new FooterStat(films.length));

const page = new PageController(siteMainElement);
page.render(films);
