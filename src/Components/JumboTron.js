import React, { Component } from 'react';

class JumboTron extends Component {
	render() {
		return(
			
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Album example</h1>
		  <p className="lead text-muted">Here is where I will try to show the history.  Did this reload the whole page?
		I guess that makes sense.    Hlen {History.length} Hcur {History.current} Hnext {History.next} Hprev {History.previous} Hstate {History.state} </p>
          <p>
            <a href="" className="btn btn-primary my-2">Main call to action</a>
            <a href="" className="btn btn-secondary my-2">Secondary action</a>
          </p>
        </div>
      </section>

		);
	}
}

export default JumboTron
