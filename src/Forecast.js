import React, { Component } from 'react'

class Forecast extends Component {
  constructor(props) {
    super(props)

    this.getIcon = this.getIcon.bind(this)
  }

  getIcon(){
    const url = `http://openweathermap.org/img/w/${this.props.icon}.png`
    return url
  }

  render() {
    return (
      <div>
        {this.props.time}
        {this.props.temp}
        <img src={this.getIcon()}/>
      </div>
    )
  }
}

export default Forecast
