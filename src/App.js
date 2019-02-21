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
      field: null,
      isTruncated: true
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
      <nav class="navbar navbar-expand-lg navbar-dark bg-twitch sticky-top">
      <a class="navbar-brand" href="#">TKF</a>
      {this.state.fields.map(field => {
        return(
          <a class="nav-link text-purple" href={"#"+field.name}>{field.name}</a>
        );
      })}
      </nav>
      <div className="flex-container">
      <div class="jumbotron text-white bg-secondary" id="welcome">
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
      </div>

      {/* putting streamer and bio in appropriate field and displaying crudely maybe change to grid display instead of card */}
      {this.state.fields.map(field => {
        return (
          <div class="row">
            <div class="container-fluid">
                  <h5 className="display-4 text-purple" id={field.name} align="center">{field.name}</h5>
                  <hr></hr>
                  <hr></hr>
                  
                    <div className="d-flex row">{field.streamers.map(fields => {
                      return(
                        
                        <div className="m-3 shadow text-white bg-secondary col-xl-3 col-lg-4 col-md-6 col-sm-12">
                          {/* make streamername a link to the twitch url from fields */}
                          <div className="card-body">
                          <a href={fields.streamerurl} target="_blank"><div className="card-title text-purple"><b>{fields.streamername}</b></div></a>
                          <div className="card-text">{fields.streamerbio}</div>
                          <hr></hr>
                          More Content
                          <hr></hr>
                          <div>{fields.streamerlinks.map(links => {
                            return(
                             
                              <div className="text-truncate card-text">
                              <a className="text-purple" href={links} target="_blank">{links}</a>
                            </div>
                            );
                          })}</div>
                        </div>
                        </div>
                        );
                    })}
                    </div>
                    </div>
            </div>
          );
          })}
      </div>
    );
  }
}

export default App;



