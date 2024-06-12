import BoardPresenter from './presenter/board-presenter.js';
import OffersModel from './models/offers-model.js';
import PointsModel from './models/points-model.js';
import { RenderPosition, render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import DestinationsModel from './models/destinations-model.js';
import FiltersModel from './models/filters-model.js';
import NewPointView from './view/create-new-point-view.js';
import PointsApiService from './service/api-service.js';

const tripInfoElement = document.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const AUTHORIZATION = 'Basic ishkjoajoiio';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const apiService = new PointsApiService(END_POINT, AUTHORIZATION);
const offersModel = new OffersModel(apiService);
const destinationsModel = new DestinationsModel(apiService);
const pointsModel = new PointsModel({apiService, destinationsModel, offersModel});
const filtersModel = new FiltersModel();

const newPointComponent = new NewPointView({
  onClick: newPointClickHandler
});

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  tripInfoContainer: tripInfoElement,
  offersModel,
  pointsModel,
  destinationsModel,
  filtersModel,
  newPointButtonComponent: newPointComponent
});

const filterPresenter = new FilterPresenter({container: filterElement, pointsModel, filtersModel});

function newPointClickHandler() {
  boardPresenter.createPoint();
  newPointComponent.element.disabled = true;
}

render(newPointComponent, tripInfoElement, RenderPosition.BEFOREEND);

filterPresenter.init();
boardPresenter.init();
pointsModel.init();
