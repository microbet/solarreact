import React, { Component } from 'react';
import './App.css';

class App extends Component {
 	constructor() {
		super();
		this.state = {
			pics: []
		}
	}

  	componentWillMount() {
	  this.getPics();
	}
      getPics(){
	var pics = [];
	var parent = [];
	parent.name = './img/one.jpg';
	parent.children = ['./img/two.jpg', './img/three.jpg', './img/four.jpg'];
	pics.push(parent)
	this.setState({ pics: pics });
	 // console.log(pics);
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
                  src={this.props.pics[0].name}
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
		      <ChildPic src={source} />
	      );
        });

   }
// I really want to return three separate childpics - trying to figure out when react
	  // just does this automatically, or how can you include the return in loop
	  // I guess look back at how it was done with topics in the learnreact job
    return (<div style={subImageStyle}>{ImageSources}</div>);
  }
}

class ChildPic extends Component {

	render(){
		console.log(this.props.src)
		// not working yet
		return(
			<img className="img-thumbnail" height="80" width="80" src={this.props.src} />
		);
	}
	
}

/*
class Pictures extends Component {
  constructor() {
    super();
    this.state = {
      opacity: "0.5"
    };
  }

  mouseOut() {
    this.setState({ opacity: "0.5" });
  }

  mouseOver() {
    this.setState({ opacity: "1" });
  }

  render() {
    var subImageStyle = {
      opacity: this.state.opacity,
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "flex-end"
    };
    var childItems = this.props.pics[0].children.map(child => {
      return (
        <img
          key={child}
          onMouseOut={() => this.mouseOut()}
          onMouseOver={() => this.mouseOver()}
          class="img-thumbnail"
          src={child}
          height="80"
          width="80"
        />
      );
    });

    return <div style={subImageStyle}>{childItems}</div>;
  }
}
*/
