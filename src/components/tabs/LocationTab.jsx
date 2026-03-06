import { places } from '../../logics/places'
import { getLocationDescription } from '../../logics/utils'

function LocationTab({ locationId, grade }) {
  const place = places.find(p => p.id === locationId)
  const description = getLocationDescription(locationId, grade)
  
  if (!place) {
    return <div className="tab-content">Location not found</div>
  }
  
  return (
    <div className="tab-content location-tab">
      <h2 className="location-title">{place.name}</h2>
      
      <div className="location-main">
        <img 
          src={place.image} 
          alt={place.name}
          className="location-image"
        />
        <div className="location-info">
          <p className="location-description">{description}</p>
          
          <h3>Secret Location</h3>
          <p><strong>{place.secretLocation?.name}:</strong> {place.secretLocation?.description}</p>
          
          <h3>Party Location</h3>
          <p><strong>{place.partyLocation?.name}:</strong> {place.partyLocation?.description}</p>
          
          <h3>Harvest Location</h3>
          <p><strong>{place.harvestLocation?.name}:</strong> {place.harvestLocation?.description}</p>
        </div>
      </div>
      
      <div className="location-npcs">
        <h3>Notable NPCs</h3>
        <div className="npc-grid">
          {place.npcs?.map((npc, index) => (
            <div key={index} className="npc-card">
              <span className="npc-name">{npc.firstName} {npc.surname}</span>
              <span className="npc-desc">{npc.description}</span>
              <span className="npc-fav">Fav: {npc.favProduct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LocationTab
