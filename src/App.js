import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
	    <Head />
	    <JumboTron />
	    <Carousel />
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
			return (thispic[1]);
		}
	}

	getFamily(id) {
		// if they are a parent, get their children
	 	var childArr = this.getChildren(id);
		return childArr;
	}

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
  render() {
	  // I get the whole pic array, need to decide which one to display
	  // as the main pic first
	  // SELECT src FROM pics WHERE id=1
	  var db = new MicroDB();
	  var mainpic = db.select('src', 'id=1')
	  // I think mainpic needs to be put into the state here and then have
	  // a callback function sent down to Pictures, which sends a callback
	  // down to ChildPic so that mainpic can be changed when the user
	  // clicks on the thumbnail
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
                  src={mainpic}
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
                    <Pictures mainpicArr={[1, mainpic]} />
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
   if (this.props.mainpicArr) {
	   var mainpicID = this.props.mainpicArr[0];
	   // ImageSources = "SELECT src FROM pics WHERE sameFamily(mainpicID_"
	  var db = new MicroDB();
	   // really need to figure out why this is called more than once at this point
	  var familyArr = db.getFamily(mainpicID);
	   
      var ImageSources = familyArr.map(memberArr => {
	      return (
		      <ChildPic src={memberArr[1]} key={memberArr[0]} id={memberArr[0]} mainsrc={this.props.mainpicArr[1]} mainid={this.props.mainpicArr[0]} />
	      );
        });

   }
    return (<div style={subImageStyle}>{ImageSources}</div>);
  }
}

class ChildPic extends Component {
  constructor() {
    super();
    this.state = {
      opacity: "0.7"
    };
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
		console.log(this.props.src) // should be 1_1.jpg
		console.log(this.props.id) // should be 2
		console.log(this.props.mainsrc)  // should be 1.jpg
		console.log(this.props.mainid) // should be 1
		console.log(src)
		console.log(id)
		console.log(mainsrc)
		console.log(mainid)

	var text;
	document.getElementById('firstslide').src = this.src; 
	document.getElementById(this.id).src =  this.mainsrc; 
		var temp = this.mainsrc;
		this.mainsrc = this.src;
		this.src = temp;
		// I left off here.  getting tired.  I think the thumb and the mainpic are 
		// different objects and even the thumbs are different object from each
		// other and they don't share "this".  The data will either have to 
		// be changed in props or state - probably props or the DB object, but
		// for Reactness I should use props and leave DB for the immutable data
		// source only

		// family is just getting children so far and while I'm switching images
		// i'm not doing anything to the props, so the handleclick doesn't act
		// any different.  I need to use something other than props
		// to get what's in main after I get here
		//
		// what I think I need is just somethng that says what the main
		// pic is and have that in either props or state and then always
		// read that and get the family to show for thumbs
		//
		// try setting a props property in here and see if it fails
		this.props.src = './img/badimage.jpg';

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

		// what if I make the child into the parent and the parent into the child?

  render() {
	  this.src = this.props.src;
	  this.id = this.props.id;
	  this.mainsrc = this.props.mainsrc;
	  this.mainid = this.props.mainid;
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

