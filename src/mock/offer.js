import { OFFERS, PRICE } from "../const";
import { getRandomInteger, getRandomValue } from "../utils";

function generateOffer() {
  const offer = getRandomValue(OFFERS);

  return {
    id: crypto.randomUUID(),
    title: offer,
    price: getRandomInteger(PRICE.MIN, (PRICE.MAX / 10))
  };
}

export { generateOffer };
