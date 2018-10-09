import React, { Component } from 'react';

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

export default Head
