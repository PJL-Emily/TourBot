import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import getGeocode from '../../../services/map.service';

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
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            locations: locations,
            markers: []
        };
    }

    fetchGeocode() {
        const setGeocodeList = async () => {
            for(let i = 0; i < this.state.locations.length; i++) {
                getGeocode(this.state.locations[i])
                .then((results) => {
                    // console.log("geocode results", results);
                    this.setState({
                        markers: [...this.state.markers, {
                            lat: results.geometry.location.lat,
                            lng: results.geometry.location.lng,
                            name: this.state.locations[i].name
                        }]
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        };
        
        setGeocodeList();
    }

    componentDidMount() {
        this.fetchGeocode();
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.locations.length > this.state.locations.length){
            console.log("should update locations");
            this.setState({
                locations: nextProps.locations
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.locations.length > prevProps.locations.length){
            this.fetchGeocode();
        }
    }

    onMarkerClick = (props, marker, e) => {
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
        if(this.state.markers.length > 0) {
            return (
                <Map
                    google={this.props.google}
                    zoom={11}
                    style={mapStyles}
                    initialCenter={{
                        lat: this.state.markers[0].lat,
                        lng: this.state.markers[0].lng
                    }}
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
        else {
            return null;
        }
    }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_API_KEY
})(MapContainer);