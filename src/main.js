import TripInfoView from './view/trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import MockService from './service/mock-service.js';
import OffersModel from './models/offers-model.js';
import PointsModel from './models/points-model.js';
import { RenderPosition, render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import DestinationsModel from './models/destinations-model.js';
import FiltersModel from './models/filters-model.js';
import NewPointView from './view/create-new-point-view.js';

const tripInfoElement = document.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const mockService = new MockService();
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const destinationsModel = new DestinationsModel(mockService);
const filtersModel = new FiltersModel();

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  offersModel,
  pointsModel,
  destinationsModel,
  filtersModel,
  onNewPointDestroy: newPointFormCloseHandler
});

const filterPresenter = new FilterPresenter({container: filterElement, pointsModel, filtersModel});

const newPointComponent = new NewPointView({
  onClick: newPointClickHandler
});

function newPointFormCloseHandler() {
  newPointComponent.element.disabled = false;
}

function newPointClickHandler() {
  boardPresenter.createPoint();
  newPointComponent.element.disabled = true;
}

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(newPointComponent, tripInfoElement, RenderPosition.BEFOREEND);

boardPresenter.init();
filterPresenter.init();
