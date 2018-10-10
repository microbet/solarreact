import React, { Component } from 'react';
import axios from 'axios';

class Admin extends Component {
	constructor() {
		super();
		this.state = {
			admin: ""
		}
	}

	handleClick() {
		this.setState( { admin: "letussee" } );
	}

	handleSubmit(event) {
		this.setState( { admin: "waiting" } );
		// ok this works, but let's try a one-way encryption of the password
		const data = {
			user: event.target.user.value,
			password: event.target.password.value 
		}
		axios.post('http://localhost:5000/api/login', data)
			.then(res => {
				var response = res.data;
				this.processResponse(response);
			})
		event.preventDefault();
	}


	processResponse(response) {
		if (response.message === 'approved') {
			this.setState( { admin: "verified" } );
		}
		else {
			this.setState( { admin: "dunno" } );
		}
	}

	render() {
		// let's say you're not logged in as admin
		if (this.state.admin === "verified") {
			// show them the login form
			// it should really be a link/button to the login form
			return(
				  <div>
				  <FileLS />
				  </div>
			  );
		} else if (this.state.admin === "letussee") {
				return(
					<div className="small">
					<form onSubmit={(event) => this.handleSubmit(event)}>
					<p className="smallText">Name
					<input className="smallInput" type="text" name="user" />
					password
					<input className="smallInput" type="text" name="password" />
					<input className="smallButton" type="submit" value="Submit" styles="width: 20px; height: 15px" /></p>
					</form>
					</div>
				);
		} else {
			  return(
				  <div className="small">
				<button className="smallButton" onClick={() => this.handleClick()}>
				 <p className="smallText">Admin</p>
				</button>
				  </div>
			);
		}
	}
}

export default Admin

class FileLS extends Component {
	constructor() {
		super();
		this.state = {
			filelist: []
		}
	}
	
	processResponse(res) {
		this.setState( { filelist: res.data.filelist } )
	}
	
	componentDidMount() {
		axios.post('http://localhost:5000/api/imagesearch') 
		.then(res => {
				console.log(res);
				this.processResponse(res);
			})
	}
	
	render() {
		var imgsrc_arr = [];
		this.state.filelist.forEach((element) => {
			imgsrc_arr.push('./img/' + element);
		});
		var img_arr = imgsrc_arr.map((thisimg) => {
			return <img height="80" width="80" alt="thumbnail house" className="img-thumbnail" src={thisimg} />
		});
		return(
			<div>
			{img_arr}
			</div>
		);
	}
}



