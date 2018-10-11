import React, { Component } from 'react';
import axios from 'axios';

class Admin extends Component {
	constructor() {
		super();
		this.state = {
	//		admin: ""   // commented out for testing, comment out next line instead in prod
			admin: "verified",
			isHidden: false
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
 
	uploadClick() {
//		const components = [
	//		FileLS,
		//	UploadPics
//		];
	//	this.setState( { whichComp : 'UploadPics' } )
		this.setState( { 
			isHidden: true,
			});
		
	}

//function Story(props) {
  // Correct! JSX type can be a capitalized variable.
//  const SpecificStory = components[props.storyType];
//  return <SpecificStory story={props.story} />;
//}
//	}
	
	render() {
		// let's say you're not logged in as admin
		if (this.state.admin === "verified") {
			// show them the login form
			// it should really be a link/button to the login form
	//		if (this.state.whichComp === "FileLS") {
		//		var adminComp = "<FileLS admin={this.state.admin}/> ";
	//		} else {
	//			var adminComp =	"<UploadPics admin={this.state.admin}>"; 
	//	
	//	}
//			const adminComp = "hi";
			return(
				  <div>
				  {!this.state.isHidden && <FileLS admin={this.state.admin} /> }
				  <UploadPics admin={this.state.admin} />
				  <button className="mediumButton" onClick={() => this.uploadClick()}>
				  <p className="mediumText">Upload Pics?</p>
				  </button>
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
			filelist: [],
			selected: '',
			displaced: '',
			message: ''
		}
	}
	
	processResponse(res) {
		this.setState( { filelist: res.data.filelist } )
	}

	componentDidMount() {
		axios.post('http://localhost:5000/api/imagesearch') 
		.then(res => {
				this.processResponse(res);
			})
	}

	allowDrop(event) {  // drop is allowed here
		event.preventDefault();
	}

	drag(event) { // you are dragging image
		this.setState({ selected: event.target.src });
	}

	getPath(url) {
		var splitup = url.split('/');
		var src = splitup[splitup.length-1];
		var srcArr = src.split('#');
		src = srcArr[0];
		return src
	}

	// something goes wrong when you drop an image on itself

	drop(event) {  // dropped
		// need to send a call to the server that this.state.selected and target.id
		// need to change names 
		var displacedPath = this.getPath(event.target.src);
		var selectedPath = this.getPath(this.state.selected);
		const data = {
			selected: selectedPath,
			displaced: displacedPath
		}
		if (selectedPath === displacedPath) return;
		axios.post('http://localhost:5000/api/imgswap', data)
			.then(res => {
				var response = res.data;
			})
		window.location.reload(); // ok, I tried a lot of ways not to do this
	}                                 // but this is just for admin
	
	getImgSrcArr() {
		var imgsrc_arr = [];
		this.state.filelist.forEach((element) => {
			imgsrc_arr.push(['./img/' + element, element]);
		});
		imgsrc_arr.sort(); // prob not necessary, but not counting on file system sort
		var img_arr = imgsrc_arr.map((thisimg, index) => {
			var thissrc = thisimg[0] + '#' + Date.now();
			return <div key={index}><img id={index} key={index} height="80" width="80" draggable="true" onDragStart={this.drag.bind(this)} onDrop={this.drop.bind(this)} onDragOver={this.allowDrop} alt="thumbnail house" className="img-thumbnail" src={thissrc} />{thisimg[1]}</div>
		});
		return img_arr
	}

	render() {
		var img_arr = this.getImgSrcArr();
		var fileStyle = {
			display: 'flex',
			justifyContent: 'center'
		}

		return(
			<div>
			login disabled for testing - fix it in admin page also get rid of this note and the outer div
			<div style={fileStyle}>
			{img_arr}
			{this.state.message}
			</div>
			</div>
		);
	}
}

class UploadPics extends Component {
	render() {
		return(
			<div>this is where you're going to upload pictures</div>
		);
	}
	
}

