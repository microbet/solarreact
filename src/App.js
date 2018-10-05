import React, { Component } from 'react';
import './App.css';

class App extends Component {
	DB = new DB;
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

class DB {
	// this is a microscopic database acting on pics array
	      // picture data is going to be like a relational database
	      // every picture has [unique id, source, parent id]
	      // if parent_id is zero then it is a parent
	      // I don't think there will ever be any grandchildren
	      // so this should suffice
	constructor(id, src, parent_id) {
		this.id = id;
		this.src = src;
		this.parent_id = parent_id;
		this.pic = [];
		this.pics = [];
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
		console.log(this.pics)
	}

	static select(selection, condition) {
		// condition is of form x=y
		var condArr = condition.split('=');
		var condName = condArr[0];
		var condVal = condArr[1];
		if (condName === 'id') {  // this case is easy, id being ordered is enforced
			condVal = parseInt(condVal); // it will be an int, but typing is the rage 
			var index = condVal - 1;
			console.log(this)
			var thispic = this.pics[index]
		}
		// only working for id now - needs more work
		// there are only three choices and only ever will be - nothing fancy here
		if (selection === 'src') {
			return (thispic[1]);
		}
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
	  var firstpic = DB.select('src', 'id=1')
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
                  src={firstpic}
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
                    <Pictures pics={this.props.pics} />
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
   let ImageSources;
   if (this.props.pics) {
      ImageSources = this.props.pics[0].children.map(source => {
	      return (
		      <ChildPic src={source} parentSrc={this.props.pics[0].name} />
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
      opacity: "0.5"
    };
  }

  mouseOut(src) {
    this.setState({
      opacity: "0.5"
    });
  }

  mouseOver(src) {
    this.setState({
      opacity: "1"
    });
  }

	handleClick(src) {
		console.log(this.props.src)
		console.log(this.props.parentSrc)

	var text;
	document.getElementById('firstslide').src = this.props.src; // "./img/two.jpg";
		// so the text needs to be in the pic array
		// need interface to upload pics
		// need json file to store info
	if ( this.props.src == "./img/1_1.jpg" ) {
		text = "This gives you a good look at how we mount on an existing torchdown roof.  The grey dams surround the mounts and a liquid sealant is poured in.  It hardens to provide an inpenetrable seal.";
	}
	if ( this.props.src == "./img/1.jpg" ) {
		text = "This array is tilted slightly to get more production on a nearly flat roof.";
	}
	if ( this.props.src == "./img/1_2.jpg" ) {
		text = "The disconnect and main service panel.";
	}
	if ( this.props.src == "./img/1_3.jpg" ) {
		text = "They have a flush mounted portion on a pitched roof.  This is a pretty large system.";
	}
	document.getElementById('firstslidecaption').innerHTML = text;
}

		// what if I make the child into the parent and the parent into the child?

  render() {
    var thumbStyle = {
      opacity: this.state.opacity
    };
    return (
      <img
        onMouseOut={() => this.mouseOut(this.props.src)}
        onMouseOver={() => this.mouseOver(this.props.src)}
	onClick={() => this.handleClick(this.props.src)}
        style={thumbStyle}
        className="img-thumbnail"
        height="80"
        width="80"
        src={this.props.src}
	alt="solar"
	    key={this.props.src}
      />
    );
  }
}

