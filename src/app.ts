import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;
const mapElement = document.getElementById('map') as HTMLElement

const GOOGLE_API_KEY = 'API_KEY';

enum GetLocationResponseStatus { OK = 'OK', ZERO_RESULT = 'ZERO_RESULT' }
type GetLocationResponse = {
  results: {
    geometry: {
      location: {
        lat: number,
        lng: number,
      }
    }
  }[],
  status: GetLocationResponseStatus
}

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios.get<GetLocationResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then(response => {
      if (response.data.status !== GetLocationResponseStatus.OK) {
        throw new Error('Could not fetch location!')
      }
      
      const coordinates = response.data.results[0].geometry.location
      const map = new google.maps.Map(mapElement, {
        center: coordinates,
        zoom: 16
      });
      
      new google.maps.Marker({
        position: coordinates,
        map
      })
    }).catch((err) => {
      alert(err.message)
    });
}

form.addEventListener('submit', searchAddressHandler);