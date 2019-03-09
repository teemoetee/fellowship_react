import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import './bootstrap-unedited/css/bootstrap.css';
import './bootstrap-unedited/css/bootstrap.min.css';
import './bootstrap-unedited/css/bootstrap-grid.css';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';



class App extends Component {
  constructor() {
    super();
    this.state = {
      fields: [],
      streamers: [],
      dropdownopen: false
    }
    this.toggleTruncate = this.toggleTruncate.bind(this);
    this.formatStreamerBio = this.formatStreamerBio.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
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
      }).map(streamer => {
        return {...streamer, truncated: true};
      });
      var fields = data.map(streamer => streamer.field);
      fields = _.uniq(fields);
      fields = fields.map(field => {
        return {name: field, streamers: data.filter(streamer => streamer.field === field)}
      })
      this.setState({fields});
      console.table(fields);
      this.setState({streamers: data});
    })
    //fetch data from twitch helix api
    // fetch('https://api.twitch.tv/kraken/users/rockitsage?client_id=ts2wybg407z8q35h4rezckkn9ttrux')
    // .then((twitch) => {
    //   console.log(twitch.json());
      
    // })
  }

  toggleTruncate(id, fieldName){
    console.log(id);
    let newFields = [...this.state.fields];
    let newField = newFields.find(field => field.name === fieldName);
    let newFieldIndex = newFields.findIndex(field => field.name === fieldName);
    let newStreamer = newField.streamers.find(streamer => streamer.id === id);
    let newStreamerIndex = newField.streamers.findIndex(streamer => streamer.id === id);
    newStreamer.truncated = !newStreamer.truncated;
    newField.streamers[newStreamerIndex] = newStreamer;
    newFields[newFieldIndex] = newField;
    this.setState({fields: newFields});
  }
  formatStreamerBio(bio, truncated) {
    // toggle some bio shit with some split nonsense
    let truncateLength = 150;
    if(truncated && bio.length >= truncateLength) {
      return bio.slice(0,truncateLength) + "...";
    }
    return bio;
  }

  toggle() {
    this.setState({
      dropdownopen: !this.state.dropdownopen
    });
  }

  render() {
    return (
      <div className="App">
      <nav class="navbar navbar-expand-lg navbar-dark bg-twitch sticky-top testfont">
      <a class="navbar-brand" href="#">TKF</a>
      <ButtonDropdown isOpen={this.state.dropdownopen} toggle={this.toggle}>
      <DropdownToggle caret>
          Select
        </DropdownToggle>
      <DropdownMenu>
      {this.state.fields.map(field => {
        return(
          <DropdownItem href={"#"+field.name}>{field.name}</DropdownItem>
        );
      })}
      </DropdownMenu>
      </ButtonDropdown>

      </nav>
      <div className="flex-container">
      <div class="jumbotron text-white bg-secondary" id="welcome">
        <div class="container">
          <h1 class="display-4">Welcome to TKF</h1>
          <p class="lead">We are a <b className="text-purple">community of like-minded people</b> here to seek knowledge and share knowledge with others. Our primary goal is to share peer-reviewed information on a variety of topics in a casual, highly-interactive environment on Twitch. We seek to <b className="text-purple">serve the people by educating</b>, finding and supporting other educational content creators, creating a central hub for all things educational through live-streaming, and inspiring others to discover the value in learning.</p>
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
                  
                    <div className="d-flex row">{field.streamers.map(streamer => {
                      return(
                        <div className="m-3 shadow text-white bg-secondary col-xl-3 col-lg-4 col-md-6 col-sm-12 rounded">
                          {/* make streamername a link to the twitch url from streamer */}
                          <div className="card-body">
                          <a href={streamer.streamerurl} target="_blank" rel="noopener noreferrer"><div className="card-title text-purple"><b>{streamer.streamername}</b></div></a>
                          <div className="card-text">{this.formatStreamerBio(streamer.streamerbio, streamer.truncated)}</div>
                          <button className="btn btn-outline-dark btn-sm" onClick={() => this.toggleTruncate(streamer.id, field.name)}>Read More</button>
                          <hr></hr>
                          <div>{streamer.streamerlinks.map(links => {
                            return(
                             
                              <div className="text-truncate card-text">
                              <a className="text-purple" href={links} target="_blank" rel="noopener noreferrer">{links}</a>
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



