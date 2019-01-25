import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import './bootstrap-unedited/css/bootstrap.css';
import './bootstrap-unedited/css/bootstrap.min.css';
import './bootstrap-unedited/css/bootstrap-grid.css';


class App extends Component {
  constructor() {
    super();
    this.state = {
      fields: [],
      streamers: [],
      streamer: null,
      streamerbio: null,
      streamerurl: null,
      streamerimg: null,
      streamerlinks: [],
      field: null
    }
  }
  componentDidMount() {
    console.log("bleh");
    fetch('http://localhost:3003/streamers')
    .then((data) => {
      return data.json();
    })
    .then(data => {
      data = data.map(streamer => {
        if(streamer.streamerlinks !== null){
          return {...streamer, streamerlinks: streamer.streamerlinks.split(",")};
        }
        else{
          return {...streamer, streamerlinks: []};
        }
      });
      console.table(data);
      var fields = data.map(streamer => streamer.field);
      fields = _.uniq(fields);
      fields = fields.map(field => {
        return {name: field, streamers: data.filter(streamer => streamer.field === field)}
      })
      this.setState({fields});
      console.table(fields);
      this.setState({streamers: data});
    })
  }

  render() {
    return (
      <div className="App">
      <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <a class="navbar-brand" href="#">TKF</a>
      
      </nav>
      <div class="jumbotron jumbotron-fluid" id="welcome">
        <div class="container">
          <h1 class="display-4">Welcome to TKF</h1>
          <p class="lead">We are a community of like-minded people here to seek knowledge and share knowledge with others. Our primary goal is to share peer-reviewed information on a variety of topics in a casual, highly-interactive environment on Twitch. We seek to serve the people by:</p>
          <ol>
            <li>Educating</li>
            <li>Finding and supporting other educational content creators</li>
            <li>Creating a central hub for all things educational through live-streaming</li>
            <li>Inspiring others to discover the value in learning</li>
          </ol>
        </div>
      </div>
      
      {/* how to get cards to work properly */}
      {/* <div className="card-group">
        <div className="row">{this.state.streamers.map(streamer => {
          return(
            <div className="card col-4">
              <div className="card-body">
                <h5 className="card-title">{streamer.streamername}</h5>
              </div>
            </div>
          );
          })}
        </div>
      </div> */}

      {/* putting streamer and bio in appropriate field and displaying crudely */}
      {this.state.fields.map(field => {
        return (
          <div class="row">
            <div class="col-lg-auto">
                  <h5>{field.name}</h5>
                    {field.streamers.map(fields => {
                      return(
                        <div className="container-fluid">
                          <div>{fields.streamername}</div>
                          <div>{fields.streamerbio}</div>
                        </div>
                      );
                    })}
            </div>
          </div>
          );
          })}
      </div>
    </div>   
    );
  }
}

export default App;



