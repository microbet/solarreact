import React, { Component } from 'react';
import './App.css';

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
      </div>
	 );
  }
}

export default App;

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
	      var id = 1;
	      var src = './img/1.jpg';
	      var parent_id = 0;
	      var pic = [id, src, parent_id];
		var pics = [];
	      pics.push(pic);
	      id = 2;
	      src = './img/1_1.jpg'
	      parent_id = 1;
	      pic = [id, src, parent_id]
	      pics.push(pic);
	      id = 3;
	      src = './img/1_2.jpg'
	      parent_id = 1;
	      pic = [id, src, parent_id]
	      pics.push(pic);
	      id = 4;
	      src = './img/1_3.jpg'
	      parent_id = 1;
	      pic = [id, src, parent_id]
	      pics.push(pic);
		 this.pics = pics;
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
		// only working for id now - needs more work
		// there are only three choices and only ever will be - nothing fancy here
		if (selection === 'src') {
			return (thispic);
		}
	}
/*
	getFamily(id) {
		if (this.pics[id][2] === 0) { // if they are a parent, get their children
	 		var childArr = this.getChildren(id);
		}
		else { // they are a child, so get their parent
			// I really just need to send the whole subarray up here
			// then I just get the parent like this
			var parent = this.picshh
		}
		return childArr;
	}
	*/

	getFamily(id) {
		var famArr = [];
		var i = id;
		var len = this.pics.length;
		// first go up the pic array looking for relatives
		while (i < len) {
			if (this.pics[i][2] !== id && this.pics[i][2] !== 0) { // neither child nor sibling
				break;
			}
			famArr.push(this.pics[i])
			i++
		}
		// now go down the pic array looking for relatives
		var j = id - 1;
		while (j > 0) {
			if (this.pics[i][2] !== id && this.pics[i][2] !== 0) { // neither child nor sibling
				break;
			}
			famArr.push(this.pics[i])
			j--
		}
		return famArr;
	}

	/*
	getChildren(id) {
		var childArr = [];
		var i = id;
		var len = this.pics.length;
		while (i < len) {
			if (this.pics[i][2] !== id) { break; }
			childArr.push([this.pics[i][0], this.pics[i][1]]);
			i++
		}
		return childArr;
	}
		*/	
}

class Head extends Component {

	render() {
			  return(
						 <div>

						   <div className="collapse bg-dark" id="navbarHeader">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-7 py-4">
              <h4 className="text-white">About</h4>
              <p className="text-muted">Jay Hirsch General and Electrical has been designing and installing photovoltaic systems since 2008. Committment to our clients for the long term is our number one specialty.  Not far behind that it flexibility.  We can do anything from just design, to helping homeowners, to turnkey installations of small or large systems.  We work with string and microinverters, grid-tied, hybrid and off grid systems.  We have a general contractor's license as well as electrical and can do any work on roofing or electrical service upgrades that may be needed along with solar installation.  We work for homeowners and corporations as prime or sub-contractors.</p>
            </div>
            <div className="col-sm-4 offset-md-1 py-4">
              <h4 className="text-white">Contact</h4>
              <ul className="list-unstyled">
                <li><a href="" className="text-white">Follow on Twitter</a></li>
                <li><a href="" className="text-white">Like on Facebook</a></li>
                <li><a href="" className="text-white">Email me</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container d-flex justify-content-between">
          <a href="" className="navbar-brand d-flex align-items-center">
	    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="2" y="6" width="20" height="15"></rect><rect x="5" y="10" width="4" height="9" strokeWidth="1"></rect><rect x="13" y="10" width="5" height="4" strokeWidth="1"></rect><line x1="0" y1="7" x2="12" y2="1"></line><line x1="12" y1="1" x2="24" y2="7"></line></svg>
            <strong>Home</strong>
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
						 </div>
			  );
	}
}

class JumboTron extends Component {
	render() {
		return(
			
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Album example</h1>
          <p className="lead text-muted">C:\Users\UserName\AppData\Local\GitHubDesktop\app-1.0.5\resources\app\git\cmd\ </p>
          <p>
            <a href="" className="btn btn-primary my-2">Main call to action</a>
            <a href="" className="btn btn-secondary my-2">Secondary action</a>
          </p>
        </div>
      </section>

		);
	}
}

class Carousel extends Component {
	constructor(props) {
		super(props);
	 // 	var db = new MicroDB();
	  //	var mainpic = db.select('src', 'id=1')
//		mainpic = this.mainpic ? 
		var mainpic =  this.mainpic ? this.mainpic : this.props.pics[0] 
		this.state = {
			mainpic :  mainpic 
			}
	}
  render() {
	  var mainpic = this.state.mainpic;
	//  var db = new MicroDB();
	 // var mainpic = db.select('src', 'id=1')
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
	  // I left off here.  I think I need to know from carousel whether
	  // a parent or child is in the main picture
   if (this.props.mainpic) {
	   var mainpicID = this.props.mainpic[0];
	   // ImageSources = "SELECT src FROM pics WHERE sameFamily(mainpicID_"
	  var db = new MicroDB();
	   // really need to figure out why this is called more than once at this point
	  var famArr = db.getFamily(mainpicID);
	   
		   //   <ChildPic src={memberArr[1]} key={memberArr[0]} id={memberArr[0]} mainsrc={this.props.mainpicArr[1]} mainid={this.props.mainpicArr[0]} changeMain={ (mainpic) => this.setState({mainpic})} />

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
//	document.getElementById('firstslide').src = this.src; 
//	document.getElementById(this.id).src =  this.mainsrc; 
		// console.log(this.src)
		var temp = this.mainsrc;
		this.mainsrc = this.src;
		this.src = temp;
		// console.log(this.src)

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
	  // so it's getting close...handleClick makes the thumbs disappear, but I don't think
	  // it'll be hard to fix
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

