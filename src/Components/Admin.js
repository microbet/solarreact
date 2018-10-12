import React, { Component } from 'react';
import axios from 'axios';

class Admin extends Component {
	constructor() {
		super();
		this.state = {
	//		admin: ""   // commented out for testing, comment out next line instead in prod
			admin: "verified",
			fileLsHidden: false,
			captionHidden: true,
			upLoadHidden: true 
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
		if (this.state.fileLsHidden) {
			this.setState( { 
				fileLsHidden: false,
				upLoadHidden: true
			});
		} else {
			this.setState( { 
				fileLsHidden: true,
				upLoadHidden: false 
			});
		}
	}

	render() {
		// let's say you're not logged in as admin
		if (this.state.admin === "verified") {
			// show them the login form
			// it should really be a link/button to the login form
			return(
				  <div>
				  {!this.state.fileLsHidden && <FileLS admin={this.state.admin} changeHiddens={ () => this.setState( { 
						  upLoadHidden: true,
					 	 fileLsHIdden: true,
					 	 captionHidden: false
				  	})
				  } />
				}
				  {!this.state.upLoadHidden && <UploadPics admin={this.state.admin} /> }
					{!this.state.captionHidden && <EditCaptions admin={this.state.admin} /> }
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

	changeHiddens() {
					console.log('did I get here');
	}// this triggers display the right component for editing captions and hide others

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
			return <div key={index}><img id={index} key={index} height="80" width="80" draggable="true" onDragStart={this.drag.bind(this)} onDrop={this.drop.bind(this)} onDragOver={this.allowDrop} alt="thumbnail house" className="img-thumbnail" src={thissrc} /><div className="smallText"><button className="smallButton" onClick={() => this.changeHiddens('editCaption')}>Edit Caption</button></div></div>
		});
		return img_arr
	}

	render() {
		var img_arr = this.getImgSrcArr();

		return(
			<div>
			<div className="adminstyle">
			{img_arr}
			{this.state.message}
			</div>
			</div>
		);
	}
}

class UploadPics extends Component { // left off here.  Form not working yet.

	constructor() {
		super();
		this.state = {
			selectedFile: null
		}
	}

	handleUpload = () => {
		const fd = new FormData();
		fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
			axios.post('http://localhost:5000/api/imgupload', fd)
			.then((res) => {
				// console.log(res);
			});
	}

	handleChange = event => {
		this.setState( { selectedFile: event.target.files[0] } );
	}
	render() {
		return(
			<div className="adminstyle">
			   <input type="file" onChange={this.handleChange}/>
			<button onClick={this.handleUpload}>Upload</button>
			</div>
		);
	}
}

class EditCaptions extends Component {
				render() {
								return(
								<div>hi</div>
								);
				}
}
