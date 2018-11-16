import React, { Component } from 'react';
import axios from 'axios';
import MicroDB from '../Tools/MicroDB';

class Admin extends Component {
	constructor() {
		super();
		this.state = {
	//		admin: "",   // commented out for testing, comment out next line instead in prod
			admin: "verified",
			fileLsHidden: false,
			captionHidden: true,
			upLoadHidden: true, 
			picCategory: '',
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
 
	addpicClick(picCategory) {
		console.log(picCategory);
		if (this.state.fileLsHidden) {
			this.setState( { 
				fileLsHidden: false,
				upLoadHidden: true,
			});
		} else {
			this.setState( { 
				fileLsHidden: true,
				upLoadHidden: false, 
				picCategory: picCategory
			});
		}
	}

	render() {
		if (this.state.admin === "verified") { // logged in as admin
			console.log("thispropsfamilyid = ", this.props.familyId);
			return( // show them the login form
				  <div>
				  {!this.state.fileLsHidden && <FileLS admin={this.state.admin} familyId={this.props.familyId} changeHiddens={ () => this.setState( { 
						  upLoadHidden: true,
					 	 fileLsHidden: true,
					 	 captionHidden: false
				  	})
				  } />
				}
				  {!this.state.upLoadHidden && <UploadPics admin={this.state.admin} picCategory={this.state.picCategory} familyId={this.props.familyId} /> }
					{!this.state.captionHidden && <EditCaptions admin={this.state.admin} /> }
					<br /> <br /> <br />
				  <button className="mediumButton" onClick={(picCategory) => this.addpicClick('newsubpic')}>
				  <p className="smallText">add pic for this job</p>
				  </button>
					<br /> <br /> <br /> <br />
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
			message: '',
			caption: '',
		}
	}
	
	processResponse(res) {
		this.setState( { filelist: res.data.filelist } )
	}
/*
	componentDidMount() {
		axios.post('http://localhost:5000/api/imagesearch') 
		.then(res => {
				this.processResponse(res);
			})
	}
*/
	allowDrop(event) {  // drop is allowed here
		event.preventDefault();
	}

	drag(event) { // you are dragging image
		this.setState({ selected: event.target.src });
	}

	getPath(url) {
		let splitup = url.split('/');
		let src = splitup[splitup.length-1];
		let srcArr = src.split('#');
		src = srcArr[0];
		return src
	}
	
	handleChange = event => {
		this.setState( { caption: event.target.value } );
	}

	changeHiddens(control, imgSrc) {  // changeHiddens doesn't seem like the right name anymore
		if (control === 'deletePic') {
			const data = {
				imgSrc: imgSrc, // number of image (they are one greater than index because I used 0 to mean something special - 'no parent' in another field)
				jsondata: '', 
			}
			let newPicsArr = [];
			let db = new MicroDB();
			let picsArr = db.getData();
			let startRenaming = false;
			console.log("imgsrc = ", imgSrc);
			let srcFamNum = db.getFamNum(imgSrc);
			let srcIsParent = db.isParent(imgSrc);
			let famNum = srcFamNum;
			let thisChildNum, childNum, elementFamNum;
			console.log("picsarr = ", picsArr);
			picsArr.forEach(function(element) {
				elementFamNum = db.getFamNum(element[1]);
				if (elementFamNum !== srcFamNum) { startRenaming = false; }
				if (startRenaming) {
					element[0] = element[0] - 1; // always drop id element by one
					if (srcIsParent) { // this element is a new parent
						element[1] = './img/' + srcFamNum + '.jpg';
						element[2] = 0;
					} else {
						thisChildNum = childNum - 1;
						element[1] = './img/' + famNum + '_' + thisChildNum + '.jpg';
					}
				}
				if (element[1] !== imgSrc || startRenaming) {
					newPicsArr.push(element);
				} else {
					startRenaming = true;
				}
				childNum = db.getChildNum(element);
			});
			data.jsondata = newPicsArr;
			axios.post('http://localhost:5000/api/deletepic', data)  // swap pics in filesystem and rewrite json file
			.then((res) => {
				console.log(res);
			});
		}
		if (control === 'editCaption') {
			const data = {
				imgSrc: imgSrc,  // this just needs to be the [0] of the element
				newCaption: this.state.caption,
			}
			console.log("data dot imgsrc = ", data.imgSrc);
			axios.post('http://localhost:5000/api/editCaption', data) // edit the caption
			.then((res) => {
				console.log(res);
			});
		}
	}// this triggers display the right component for editing captions and hide others

	// something goes wrong when you drop an image on itself

	drop(event) {  // dropped
		// need to send a call to the server that this.state.selected and target.id
		// need to change names 
		var displacedPath = this.getPath(event.target.src);
		var selectedPath = this.getPath(this.state.selected);
		const data = {
			selected: selectedPath, // file name of dragged img
			displaced: displacedPath, // file name it's dropped on
			jsondata: ''
		}
		if (selectedPath === displacedPath) return; //dropped on itself
			// I need to read the json file to switch in there
		var db = new MicroDB();
		var picsArr = db.getData();
		var selectedExtended = "./img/" + data.selected;
		var displacedExtended = "./img/" + data.displaced;
		var firstindex = -1;
		var firstcaption = '';
		var secondindex = -1;
		var secondcaption = '';
		for (let i=0; i<picsArr.length; i++) {
			if (picsArr[i][1] === selectedExtended || picsArr[i][1] === displacedExtended) {
				if (firstindex === -1) {
					firstindex = i;
					firstcaption = picsArr[i][3];
					continue;
				}
				if (secondindex === -1) {
					secondindex = i;
					secondcaption = picsArr[i][3];
					continue;
				}
			}
		}
		picsArr[firstindex][3] = secondcaption;
		picsArr[secondindex][3] = firstcaption;
		data.jsondata = picsArr;
		// now I have to save this to the json file
		axios.post('http://localhost:5000/api/imgswap', data)  // swap pics in filesystem and rewrite json file
		.then((res) => {
			console.log(res);
		});

	}                                 // but this is just for admin

	render() {
		const db = new MicroDB();
		let famArr = db.getFamily(this.props.familyId, true, true);
			let thumbImgs = famArr.map((thisImgSrc, index) => 
					<div key={index}>
					<img id={index} key={index} height='80' width='80' draggable='true' onDragStart={this.drag.bind(this)} onDrop={this.drop.bind(this)} onDragOver={this.allowDrop} alt='thumbnail house' className='img-thumbnail' src={thisImgSrc[1]} />
					<div className='smallText'>
					<button className='smallButton' onClick={() => this.changeHiddens('deletePic', thisImgSrc[1])}>Delete Pic</button></div>
					 <form onSubmit={()=> this.changeHiddens('editCaption', thisImgSrc[0])}>
					<label>
					<input type='text' size='5' onChange={this.handleChange} />
					</label>
					<div className='smallText'>
					<button type='submit' className='smallButton'>Edit Caption</button>
					</div>
					</form>
					</div>				
			);

		return(
			<div className="adminstyle">
			{thumbImgs}
			</div>
		)
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
		fd.append('familyId', this.props.familyId);
		fd.append('picCategory', this.props.picCategory);
		axios.post('http://localhost:5000/api/imgupload', fd)
			.then((res) => {
				console.log('back from server');
				console.log(res);
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
