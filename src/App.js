import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadingLatlng: false,
      hasLatlng: false,
      latlng: {},
      loadingWeather: false,
      hasWeather: false,
      searchCity: '',
      weatherMain: '',
      weatherDesc: '',
      weatherTemp: 0
    }

    this.getLatLng = this.getLatLng.bind(this)
    this.renderMsg = this.renderMsg.bind(this)
    this.getWeather = this.getWeather.bind(this)
    this.handleSearchBar = this.handleSearchBar.bind(this)
  }

  getWeather(result) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${result.lat}&lon=${result.lng}&APPID=72af66db614bf9fd03583352142dd7a7`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          loadingWeather: false,
          hasWeather: true,
          weatherMain: data.weather[0].main,
          weatherDesc: data.weather[0].description,
          weatherTemp: data.main.temp - 273.15
        })

      })
  }

  getLatLng(city) {
    this.setState({
      loadingLatlng: true
    })

    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}`)
    .then(response => response.json())
    .then(data => {
      if(data.status !== "OK"){
        this.setState({
          loadingLatlng: false,
          hasLatlng: false
        })

        throw new Error('Did not get lat lng')
      } else {
        this.setState({
          loadingLatlng: false,
          hasLatlng: true,
          latlng: data.results[0].geometry.location
        })
        return data.results[0].geometry.location
      }
    })
  }

  componentDidMount() {
    this.getLatLng(this.state.searchCity)
      .then(result => this.getWeather(result))
      .catch(err => console.log('Error', err))
  }

  handleSearchBar(e) {
    this.setState({searchCity: e.target.value})
    this.getLatLng(this.state.searchCity)
      .then(result => this.getWeather(result))
      .catch(err => console.log('Error', err))

  }

  renderMsg() {
    if (this.state.loadingLatlng) {
      return (
        <div>
          Loading...
        </div>
      )
    }

    if (!this.state.loadingLatlng && this.state.hasLatlng) {
      return (
        <div>
          The Lat and Lng of {this.state.searchCity} is:
          <div>Lat: {this.state.latlng.lat}</div>
          <div>Lng: {this.state.latlng.lng}</div>
          <div>Weather: {this.state.weatherMain}</div>
          <div>Weather2: {this.state.weatherDesc}</div>
          <div>Temp: {this.state.weatherTemp}</div>
        </div>
      )
    }

    return <div>Somethings gone wrong...</div>
  }

  render() {
    return (
      <div className="App">
        <h1>Weather App</h1>
        <input
          id="search"
          placeholder="City..."
          type="text"
          value={this.state.searchCity}
          onChange={this.handleSearchBar}>
        </input>
        {this.renderMsg()}
      </div>
    );
  }
}

export default App;
