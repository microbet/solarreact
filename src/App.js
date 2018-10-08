import React, { Component } from 'react';
import './App.css';
import ImageData from './ImageData.json';
import Head from './Components/Head';
import JumboTron from './Components/JumboTron';
import Admin from './Components/Admin';

class App extends Component {
	constructor() {
		super();
		// let every component have access to all the data?
		// convenient and I'm sure fine in this app because there could 
		// never be a huge amount, dunno what happens when there is
		var db = new MicroDB();
		this.state = {
			pics : db.getData()
		}
	}
  render() {
    return (
      <div className="App">
	    <Head />
	    <JumboTron />
	    <Carousel pics={this.state.pics} />
	    <Admin />
      </div>
	 );
  }
}

export default App;

// working on Auth0
// https://medium.appbase.io/how-to-implement-authentication-for-your-react-app-cf09eef3bb0b
// https://medium.appbase.io/securing-a-react-web-app-with-server-side-authentication-1b7c7dc55c16
// domain = newenergy.auth0.com Client ID = sGfCvajG_5moTi6sntLfW8_C8ujWZPC8
// need to understand each piece - working on History before just importing
// https://www.youtube.com/watch?v=7nafaH9SddU
// their history function

class MicroDB {
	// this is a microscopic database acting on pics array
	// it's a little like a relational database, but not really
	// the data is and must be very structured  id's go in order only
	// children always immediately follow their parent
	constructor(id, src, parent_id) {
		this.id = 1;
		this.src = src;
		this.parent_id = parent_id;
		this.pic = [];
		this.getData();
	}

	getData() {
		this.pics = ImageData;
		return this.pics;
	}

	select(selection, condition) {
		// condition is of form x=y
		// I think I should probably return src and id everytime
		var condArr = condition.split('=');
		var condName = condArr[0];
		var condVal = condArr[1];
		if (condName === 'id') {  // this case is easy, id being ordered is enforced
			condVal = parseInt(condVal, 10); // it will be an int, but typing is the rage 
			var index = condVal - 1; // id is ALWAYS index+1
			var thispic = this.pics[index]
		}
		if (selection === 'src') {
			return (thispic);
		}
	}

	getFamily(id) {
		var famArr = [];
		var i = id;
		var len = this.pics.length;
		// first go up the pic array looking for relatives
		while (i < len) {
			if ((this.pics[i-1][2] === this.pics[i][2]) || (this.pics[i][2] === this.pics[i-1][0])) { // either sibling or child
				famArr.push(this.pics[i])
				i++
			}
			else { break; }
		}
		// now go down the pic array looking for relatives
		var j = id - 2;
		while (j >= 0) {
			if ((this.pics[j][2] === this.pics[j+1][2]) || (this.pics[j][0] === this.pics[id-1][2])) { // either sibling or child
				famArr.unshift(this.pics[j]) // keep array sorted
				j--
			}
			else { break; }
		}
		return famArr;
	}
}

class Carousel extends Component {
	constructor(props) {
		super(props);
		var mainpic =  this.mainpic ? this.mainpic : this.props.pics[0] 
		this.state = {
			mainpic :  mainpic 
			}
	}
  render() {
	  var mainpic = this.state.mainpic;
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
                <img
                  className="d-block w-100"
                  src={this.state.mainpic[1]}
                  alt="First slide"
                  id="firstslide"
                />

                <div className="carousel-caption">
                  <p
                    className="overimage"
                    styles="background-color: rgba(200, 200, 200, 0.5);"
                    id="firstslidecaption"
                  >
                    Here is placeholder caption. I hope I don't leave this on
                    the site. :)
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
	  var famArr = db.getFamily(mainpicID);
      var ImageSources = famArr.map(memberArr => {
	      return (
		      <ChildPic src={memberArr[1]} key={memberArr[0]} id={memberArr[0]} mainpic={this.props.mainpic} changeMain={this.props.changeMain} />
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
		this.props.changeMain([id, src]) // this is sending info back to parent/grandparent 

	var text;
		var temp = this.mainsrc;
		this.mainsrc = this.src;
		this.src = temp;

	if ( this.props.src === "./img/1_1.jpg" ) {
		text = "This gives you a good look at how we mount on an existing torchdown roof.  The grey dams surround the mounts and a liquid sealant is poured in.  It hardens to provide an inpenetrable seal.";
	}
	if ( this.props.src === "./img/1.jpg" ) {
		text = "This array is tilted slightly to get more production on a nearly flat roof.";
	}
	if ( this.props.src === "./img/1_2.jpg" ) {
		text = "The disconnect and main service panel.";
	}
	if ( this.props.src === "./img/1_3.jpg" ) {
		text = "They have a flush mounted portion on a pitched roof.  This is a pretty large system.";
	}
	document.getElementById('firstslidecaption').innerHTML = text;
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

