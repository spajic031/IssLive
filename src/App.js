import "./App.css";
import React from "react";

import whereIsIss from "./api/whereIsIss";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { useMapEvents } from "react-leaflet";
import L from "leaflet";
import Iframe from "react-iframe";
/* import { useEffect } from "react"; */

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      pos: {
        latitude: 0,
        longitude: 0,
        altitude: 0,
        velocity: 0,
      },
    };

    this.iss = this.iss.bind(this);
    this.getIss = this.getIss.bind(this);
  }

  getIss = async (term) => {
    const response = await whereIsIss.get("/v1/satellites/25544", {
      params: { query: term },
    });

    this.setState({ pos: response.data });
  };

  getIcon(_iconSize) {
    return L.icon({
      iconUrl: require("./img/iss.png"),
      iconSize: [_iconSize],
    });
  }
  iss() {
    setInterval(() => {
      this.getIss();
    }, 2000);
  }
  componentDidMount() {
    window.addEventListener("load", this.iss());
  }
  render() {
    const position = [this.state.pos.latitude, this.state.pos.longitude];

    const vel = this.state.pos.velocity.toFixed(1);
    const alt = this.state.pos.altitude.toFixed(1);
    const lat = this.state.pos.latitude.toFixed(2);
    const lon = this.state.pos.longitude.toFixed(2);

    function LocationMarker() {
      const map = useMapEvents({
        click() {
          map.flyTo(position, map.getZoom());
        },
      });
    }

    return (
      <div className="App">
        <div className="msg-overlay">
          <h1 className="msg">Tap on the map to see a ISS live location</h1>
        </div>
        <div className="window">
          <h1 className="name">ISS Tracker</h1>
          <div className="values-wrapper">
            <div>
              <div className="values">
                <h1>Longitude</h1>
                <h1>{lon}°</h1>
              </div>
              <div className="values">
                <h1>Latitude</h1>
                <h1>{lat}°</h1>
              </div>
            </div>
            <div>
              <div className="values">
                <h1>Altitude</h1>
                <h1>{alt} Km</h1>
              </div>
              <div className="values">
                <h1>Velocity </h1>
                <h1>{vel} Km/h </h1>
              </div>
            </div>
          </div>

          <Iframe
            className="iframe"
            src="https://ustream.tv/embed/17074538"
            scrolling="no"
            allowfullscreen
            webkitallowfullscreen
            frameborder="0"
          />
        </div>
        <MapContainer center={position} zoom={3} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={this.getIcon(60)}>
            <Popup>
              Inernational Space Station <br /> Live
            </Popup>
          </Marker>
          <LocationMarker />
        </MapContainer>
      </div>
    );
  }
}
export default App;
