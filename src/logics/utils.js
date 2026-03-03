import { places } from './places';
export function getPlaceDescription(placeId, playerGrade) {
  const place = places.find(p => p.id === placeId);
  
  if (!place || !place.descriptions) {
    return '';
  }
  
  const descriptionIndex = Math.max(0, Math.min(5, Math.floor((playerGrade - 3) / 5) + 1));
  
  return place.descriptions[descriptionIndex] || place.descriptions[0];
}
