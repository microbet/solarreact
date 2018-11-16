import React, { Component } from 'react';
import './App.css';
import Head from './Components/Head';
import JumboTron from './Components/JumboTron';
import Admin from './Components/Admin';
import MicroDB from './Tools/MicroDB';
// import axios from 'axios';

class App extends Component {
	constructor() {
		super();
		// let every component have access to all the data?
		// convenient and I'm sure fine in this app because there could 
		// never be a huge amount, dunno what happens when there is
		var db = new MicroDB();
		this.state = {
			pics : db.getData(),
			familyId : 4,
		}
	}
  render() {
    return (
      <div className="App">
	    <Head />
	    <JumboTron />
	    <Carousel pics={this.state.pics} familyId={this.state.familyId} />
	    <br />
	    <Admin familyId={this.state.familyId} />
      </div>
	 );
  }
}

export default App;

class Carousel extends Component {
	constructor(props) {
		super(props);
		var mainpic =  this.mainpic ? this.mainpic : this.props.pics[this.props.familyId - 1] 
		this.state = {
			mainpic :  mainpic 
			}
	}
  render() {
	  var mainpic = this.state.mainpic;
	  var caption = this.props.pics[this.props.familyId-1][3];
    return (
      <div className="album py-5 bg-light">
        <div className="container">
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
			  { this.state.mainpic ? (
                <img
                  className="d-block w-100"
                  src={this.state.mainpic[1]}
                  alt="First slide"
                  id="firstslide"
                />
			      ) : (
				   <div></div>
				   )
			 }

                <div className="carousel-caption">
                  <p
                    className="overimage"
                    styles="background-color: rgba(200, 200, 200, 0.5);"
                    id="firstslidecaption"
                  >
				  { caption ? (
					<span>{caption}</span>
					) : (
					<span></span>
					)
				  }
                  </p>
                  <div>
                    <Pictures mainpic={mainpic} changeMain={ (mainpic) => this.setState({mainpic})} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a
          className="carousel-control-prev"
          href="#carouselExampleControls"
          role="button"
          data-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#carouselExampleControls"
          role="button"
          data-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </a>
      </div>
    );
  }
}


class Pictures extends Component {

  render() {
    var subImageStyle = {
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "flex-end"
    };
   if (this.props.mainpic) {
	   var mainpicID = this.props.mainpic[0];
	  var db = new MicroDB(); // it is not really a database
	  var famArr = db.getFamily(mainpicID, false, true);
      var ImageSources = famArr.map(memberArr => {
	      return (
		      <ChildPic caption={memberArr[3]} src={memberArr[1]} key={memberArr[0]} id={memberArr} mainpic={this.props.mainpic} changeMain={this.props.changeMain} />
	      );
        });
   }
    return (<div style={subImageStyle}>{ImageSources}</div>);
  }
}

class ChildPic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: "0.7"
    };
  this.src = this.props.src;
  this.id = this.props.id;
  this.mainpic = this.props.mainpic;
	  this.mainsrc = this.mainpic[1]
  this.mainid = this.mainpic[0];
  }

  mouseOut(src) {
    this.setState({
      opacity: "0.7"
    });
  }

  mouseOver(src) {
    this.setState({
      opacity: "1"
    });
  }

	handleClick(src, id, mainsrc, mainid) {
		this.props.changeMain(id) // this is sending info back to parent/grandparent 

	//var text;
		var temp = this.mainsrc;
		this.mainsrc = this.src;
		this.src = temp;

	document.getElementById('firstslidecaption').innerHTML = this.props.caption;
}

  render() {
    var thumbStyle = {
      opacity: this.state.opacity
    };
    return (
      <img
        onMouseOut={() => this.mouseOut(this.src)}
        onMouseOver={() => this.mouseOver(this.src)}
	onClick={() => this.handleClick(this.src, this.id, this.mainsrc, this.mainid)}
        style={thumbStyle}
        className="img-thumbnail"
        height="80"
        width="80"
        src={this.src}
	alt="solar"
	    key={this.id}
	    id={this.id}
      />
    );
  }
}
