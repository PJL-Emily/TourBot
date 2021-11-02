import React, { Component } from 'react';
import { GoogleMapReact } from 'google-maps-react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import getGeocode from '../../../services/map.service';

// const google = window.google;
// let geocoder = new google.maps.Geocoder();

const mapStyles = {
    width: '55%',
    height: '80%',
    position: 'relative',
    left: 0
};

export class MapContainer extends Component {
    constructor(props) {
        super();
        
        let { locations } = props;
        let markers = [];
        for(let i = 0; i < locations.length; i++) {
            // geocoder.geocode({'address': locations[i].addr}, 
            // function(results, status) {
            //     if (status == 'OK') {
            //         console.log("results", results);
            //     //   this.setState({
            //     //     address: results.geometry.location
            //     //   })
            //     } 
            //     else {
            //         console.log('Geocode was not successfull because ' + status)
            //     }
            //   });
            let coords = getGeocode(locations[i]);
            console.log("coords", coords);
            markers = [...markers, {
                lat: coords.lat,
                lng: coords.lng,
                name: locations[i].name
            }];
        }
        
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            markers: [
                {
                    lat: -1.2884,
                    lng: 36.8233,
                    name: 'test1'
                },
                {
                    lat: -1.2894,
                    lng: 36.8263,
                    name: 'test2'
                },
                {
                    lat: -1.2804,
                    lng: 36.8203,
                    name: 'test3'
                }
            ] // markers
        };
    }

    onMarkerClick = (props, marker, e) => {
        // console.log("onMarkerClick props: ", props);
        this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
        });
    };

    onClose = props => {
        if (this.state.showingInfoWindow) {
        this.setState({
            showingInfoWindow: false,
            activeMarker: null
        });
    }};

    render() {
        console.log("locations", this.state.markers);
        return (
        <Map
            google={this.props.google}
            zoom={12}
            style={mapStyles}
            initialCenter={
            {
                lat: this.state.markers[0].lat,
                lng: this.state.markers[0].lng
            }
            }
        >
            {this.state.markers.map(marker => (
                <Marker
                    onClick={this.onMarkerClick}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    name={marker.name}
                    key={marker.name}
                />
                
            ))}

            <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
            >
                <div>
                    <h4>{this.state.selectedPlace.name}</h4>
                </div>
            </InfoWindow>
            
        </Map>
        );
    }
}

export default GoogleApiWrapper({
//   apiKey: process.env.REACT_APP_API_KEY
})(MapContainer);