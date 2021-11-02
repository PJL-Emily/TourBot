import axios from "axios";

let getGeocode = async function(location) {
    let address = location.addr.split(" ").join("+");
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODER_KEY}`;
    
    const response = await axios.get(url);
    return response.data.results[0];
}

export default getGeocode;