import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import './bootstrap-unedited/css/bootstrap.css';
import './bootstrap-unedited/css/bootstrap.min.css';
import './bootstrap-unedited/css/bootstrap-grid.css';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavItem, NavLink, Button } from 'reactstrap';
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';
import InstagramEmbed from 'react-instagram-embed';
import api from "./api";



class App extends Component {
  constructor() {
    super();
    this.state = {
      fields: [],
      streamers: [],
      profile: [],
      logo: [],
      dropdownopen: false,
      readbtntext: 'Read More',
      readstate: false
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
      })
      .map(streamer => {
        return {...streamer, truncated: true};
      });
      var fields = data.map(streamer => streamer.field);
      fields = _.uniq(fields);
      fields = fields.map(field => {
        return {name: field, streamers: data.filter(streamer => streamer.field === field)}
      })
      var profile = data.map(streamer => streamer.streamername);
      profile = _.uniq(profile);
      profile = profile.map(profiles => {
        return {name: profiles};
      })
      this.setState({fields});
      //console.table(fields);
      this.setState({streamers: data});
      this.setState({profile});
      //console.log(profile);
      //console.log(this.state.streamers);
    })
  }
  toggleTruncate(id, fieldName){
    //console.log(id);
    let newFields = [...this.state.fields];
    let newField = newFields.find(field => field.name === fieldName);
    let newFieldIndex = newFields.findIndex(field => field.name === fieldName);
    let newStreamer = newField.streamers.find(streamer => streamer.id === id);
    let newStreamerIndex = newField.streamers.findIndex(streamer => streamer.id === id);
    newStreamer.truncated = !newStreamer.truncated;
    newField.streamers[newStreamerIndex] = newStreamer;
    newFields[newFieldIndex] = newField;
    this.setState({fields: newFields});
    this.setState(prevState => ({
      readstate: !prevState.readstate
    }));
    if(this.state.readstate === false){
      this.setState({readbtntext: 'Read Less'});
    }
    if(this.state.readstate === true){
      this.setState({readbtntext: 'Read More'})
    }

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
  discordInvite() {
    window.location.assign('https://discord.gg/HSYKvSc');
  }
  render() {
    return (
      <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-twitch sticky-top testfont">
      <div>
      <a className="navbar-brand" href="#">TKF</a>
      <ButtonDropdown isOpen={this.state.dropdownopen} toggle={this.toggle}>
      <DropdownToggle caret>
          Select
        </DropdownToggle>
      <DropdownMenu>
      
      {this.state.fields.map(field => {
        return(
          <DropdownItem key={field.name} href={"#"+field.name}>{field.name}</DropdownItem>
        );
      })}
      {/* <hr></hr>
      <DropdownItem href="#socialmedia">Social Media</DropdownItem> */}
      </DropdownMenu>
      </ButtonDropdown>
      <Button outline color="primary" onClick={this.discordInvite.bind(this)}>Join Our Discord!</Button>
      
      </div>
      </nav>
      <div className="flex-container">
      <div className="jumbotron text-white bg-secondary" id="welcome">
        <div className="container">
          <h1 className="display-4 text-gold">Welcome to TKF</h1>
          <p className="lead">We are a <b className="text-purple">community of like-minded people</b> here to seek knowledge and share knowledge with others. Our primary goal is to share peer-reviewed information on a variety of topics in a casual, highly-interactive environment on Twitch. We seek to <b className="text-purple">serve the people by educating</b>, finding and supporting other educational content creators, creating a central hub for all things educational through live-streaming, and inspiring others to discover the value in learning.</p>
        </div>
      </div>
      </div>

      {/* putting streamer and bio in appropriate field and displaying crudely maybe change to grid display instead of card */}
      {this.state.fields.map(field => {
        return (
          <div className="row">
            <div className="container-fluid">
                  <h5 className="display-4 text-purple" id={field.name} align="center">{field.name}</h5>
                  <hr></hr>
                  <hr></hr>
                  
                    <div className="d-flex row">{field.streamers.map(streamer => {
                      return(
                        <div className="m-3 shadow text-white bg-secondary col-xl-3 col-lg-4 col-md-6 col-sm-12 rounded">
                          {/* make streamername a link to the twitch url from streamer */}
                          <div className="card-body">
                          <a href={streamer.streamerurl} target="_blank" rel="noopener noreferrer"><div className="card-title text-gold"><b>{streamer.streamername}</b></div></a>
                          <div className="card-text">{this.formatStreamerBio(streamer.streamerbio, streamer.truncated)}</div>
                          <button className="btn btn-outline-dark btn-sm" onClick={() => this.toggleTruncate(streamer.id, field.name)}>{this.state.readbtntext}</button>
                          <hr></hr>
                          
                          <div>{streamer.streamerlinks.map(links => {
                            return(
                             
                              <div className="text-truncate card-text">
                              <a href={links} target="_blank" rel="noopener noreferrer">{links}</a>
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
          {/* <div className= 'd-flex row' id="socialmedia"> */}
          {/* <TwitterTimelineEmbed
            sourceType="profile"
            screenName="TheKnowledgeFe1"
            options={{height: 530, width: 400}} 
          /> */}
          {/* change url to whatever tkf has as their first post */}
          {/* <InstagramEmbed
            url='https://www.instagram.com/p/BwGf5F9DrkB/?utm_source=ig_embed&amp;utm_medium=loading'
            maxWidth={400}
            height={400}
            hideCaption={true}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          /> */}
          {/* <iframe src="https://discordapp.com/widget?id=438876315764916224&theme=light" width="400" height="530" allowtransparency="true" frameBorder="0"></iframe> */}
          {/* </div> */}
      </div>
      
    );
    
  }
  
}

export default App;



