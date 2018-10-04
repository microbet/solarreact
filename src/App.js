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
	var pics = new Array();
	var parent = new Array();
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

						   <div class="collapse bg-dark" id="navbarHeader">
        <div class="container">
          <div class="row">
            <div class="col-sm-8 col-md-7 py-4">
              <h4 class="text-white">About</h4>
              <p class="text-muted">Jay Hirsch General and Electrical has been designing and installing photovoltaic systems since 2008. Committment to our clients for the long term is our number one specialty.  Not far behind that it flexibility.  We can do anything from just design, to helping homeowners, to turnkey installations of small or large systems.  We work with string and microinverters, grid-tied, hybrid and off grid systems.  We have a general contractor's license as well as electrical and can do any work on roofing or electrical service upgrades that may be needed along with solar installation.  We work for homeowners and corporations as prime or sub-contractors.</p>
            </div>
            <div class="col-sm-4 offset-md-1 py-4">
              <h4 class="text-white">Contact</h4>
              <ul class="list-unstyled">
                <li><a href="#" class="text-white">Follow on Twitter</a></li>
                <li><a href="#" class="text-white">Like on Facebook</a></li>
                <li><a href="#" class="text-white">Email me</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar navbar-dark bg-dark shadow-sm">
        <div class="container d-flex justify-content-between">
          <a href="#" class="navbar-brand d-flex align-items-center">
	    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><rect x="2" y="6" width="20" height="15"></rect><rect x="5" y="10" width="4" height="9" stroke-width="1"></rect><rect x="13" y="10" width="5" height="4" stroke-width="1"></rect><line x1="0" y1="7" x2="12" y2="1"></line><line x1="12" y1="1" x2="24" y2="7"></line></svg>
            <strong>Home</strong>
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
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
			
      <section class="jumbotron text-center">
        <div class="container">
          <h1 class="jumbotron-heading">Album example</h1>
          <p class="lead text-muted">C:\Users\UserName\AppData\Local\GitHubDesktop\app-1.0.5\resources\app\git\cmd\ </p>
          <p>
            <a href="#" class="btn btn-primary my-2">Main call to action</a>
            <a href="#" class="btn btn-secondary my-2">Secondary action</a>
          </p>
        </div>
      </section>

		);
	}
}

class Carousel extends Component {
  render() {
    return (
      <div class="album py-5 bg-light">
        <div class="container">
          <div
            id="carouselExampleControls"
            class="carousel slide"
            data-ride="carousel"
          >
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img
                  class="d-block w-100"
                  src={this.props.pics[0].name}
                  alt="First slide"
                  id="firstslide"
                />

                <div class="carousel-caption">
                  <p
                    class="overimage"
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
          class="carousel-control-prev"
          href="#carouselExampleControls"
          role="button"
          data-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true" />
          <span class="sr-only">Previous</span>
        </a>
        <a
          class="carousel-control-next"
          href="#carouselExampleControls"
          role="button"
          data-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true" />
          <span class="sr-only">Next</span>
        </a>
      </div>
    );
  }
}


class Pictures extends Component {
  constructor(props) {
    super(props);
	  var childArr = []
	//  console.log(this.props.pics[0].children)
	 // childArr = this.props.pics[0].children.map(child => ( child '0.5' ))
	  this.props.pics[0].children.forEach(function(child) {
		  childArr.push([child, '0.5'])
	  });
	//  console.log(childArr)
		  this.state = {
			  childArr: childArr, 
    			  opacity: "0.5"
		  }
   // this.state = {
    //  opacity: "0.5"
  //  };
	 // console.log(this.state.childArr)
  }

  mouseOut(child) {
	  var len = this.state.childArr.length;
	  for (var i=0; i<len; i++) {
		  if ( this.state.childArr[0] === child ) {
			  this.state.childArr[1] = '0.5';
		  }
	   }

	  // this.state.childArr.forEach(function(child) {
	// 	  if (this.state.childArr[0] === child) {
	// 		  this.state.childArr[1] = '0.5';
	// 	  }
	  // 	}
	//   );
	  //var index = this.state.childArr.indexOf([child, '1']);
//	  if (index !== -1) {
//		  this.state.childArr[index] = [child, '0.5'];
//	  }
  }

  mouseOver(child) {
//	  console.log(this.state.childArr)
//	  console.log(this.state.childArr[0])
//	  console.log(this.state.childArr[1])
	  var len = this.state.childArr.length;
	  for (var i=0; i<len; i++) {
		  if ( this.state.childArr[i][0] === child ) {
			  this.state.childArr[i][1] = '1';
		  }
	   }
	//  console.log(this.state.childArr)


	//  var index = this.state.childArr.indexOf(["{child}", "0.5"]);
//	  console.clear;
//	  console.log(this.state.childArr)
//	  console.log(child)
//	  console.log(this.state.childArr[index])

//	  if (index !== -1) {
//		  this.state.childArr[index] = [child, '1'];
//	  }
  }

  render() {
    var subDivStyle = {
	    opacity: this.state.opacity,
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "flex-end"
    };
	  // I left off here
	var len = this.state.childArr.length;
	  for(var i=0; i<len; i++) {
	     var subImgStyle = "opacity: " + this.state.childArr[i][1]; 
		  var childItemsreturn(
      		  <img
	  		    style={subImgStyle}
          key={this.state.childArr[i]}
          onMouseOut={() => this.mouseOut(this.state.childArr[i])}
          onMouseOver={() => this.mouseOver(this.state.childArr[i])}
          class="img-thumbnail"
          src={this.state.childArr[i]}
          height="80"
          width="80"
        />
		  );
    };

    return <div style={subDivStyle}>{childItems}</div>;
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
