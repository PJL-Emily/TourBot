import axios from "axios";

let getGeocode = async function(location) {
    let address = location.addr.split(" ").join("+");
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_GEOCODER_KEY}`;
    
    const response = await axios.get(url);
    console.log("response", response);
    const data = response.data.results[0];
    // console.log("getGeoCode: ", data);
    const coords = {
        lat: data.geometry.location.lat,
        lng: data.geometry.location.lng
    };
    return coords;
}

export default getGeocode;