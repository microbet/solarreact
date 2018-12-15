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

	newProjectClick() {
		this.props.changeFamily(this.props.db.getNextFamilyId());
	}

	render() {
		if (this.state.admin === "verified") { // logged in as admin
			return( // show them the login form
				  <div>
				  {!this.state.fileLsHidden && <FileLS db={this.props.db} admin={this.state.admin} familyId={this.props.familyId} changeHiddens={ () => this.setState( { 
						  upLoadHidden: true,
					 	 fileLsHidden: true,
					 	 captionHidden: false
				  	})
				  } />
				}
				  {!this.state.upLoadHidden && <UploadPics db={this.props.db} admin={this.state.admin} picCategory={this.state.picCategory} familyId={this.props.familyId} /> }
					{!this.state.captionHidden && <EditCaptions admin={this.state.admin} /> }
					<br /> <br /> <br />
				  <button className="mediumButton" onClick={(picCategory) => this.addpicClick('newsubpic')}>
				  <p className="smallText">add pic for this job</p>
				  </button>
				  <button className="mediumButton" onClick={() => this.newProjectClick()}>
				  <p className="smallText">create new project</p>
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
			imageNewSize: '',
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

	handleResizeChange = event => {
		this.setState( { imageNewSize: event.target.value } );
	} // should be one function with handleChange

	changeHiddens(control, imgObj) {  // changeHiddens doesn't seem like the right name anymore
		if (control === 'deletePic') {
			const data = {
				imgObj: imgObj, 
				jsondata: '', 
			}
			let newPicsArr = [];
			let picsArr = this.props.db.getData();
			for (let i=0; i<picsArr.length; i++) {
				if (picsArr[i].family !== imgObj.family || picsArr[i].childNum < imgObj.childNum) {
					newPicsArr.push(picsArr[i]);
					continue;
				}
				if (picsArr[i].childNum > imgObj.childNum) {
					picsArr[i].childNum = picsArr[i].childNum - 1;
					newPicsArr.push(picsArr[i]);
				}
			}
			data.jsondata = newPicsArr;
			axios.post('http://localhost:5000/api/deletePic', data)  // swap pics in filesystem and rewrite json file
			.then((res) => {
				console.log(res);
			});
		}
	}

	captionEditor(event, imgObj) {
		/*
		const fd = new FormData();
		fd.append('familyId', this.props.familyId);  // what the hell why does order of these two lines matter
		fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
		*/
			const data = {
				imgObj: imgObj, 
				newCaption: this.state.caption,
				withCredentials: true,
			}
	//		const fd = new FormData();
	//		fd.append('imgObj', imgObj);  // what the hell why does order of these two lines matter
	//		fd.append('newCaption', this.state.caption);
			axios.post('http://localhost:5000/api/editCaption', data) // edit the caption
	//		axios.post('http://localhost:5000/api/editCaption', fd) // edit the caption
			.then((res) => {
				console.log(res);
			});
			event.preventDefault();
	}// this triggers display the right component for editing captions and hide others

	imageResize(event, imgObj) {
		const data = {
			imgObj: imgObj,
			imageNewSize: this.state.imageNewSize,
		}
		axios.post('http://localhost:5000/api/imageResize', data)
		.then((res) => {
			console.log(res);
		});
		event.preventDefault();
	}


	drop(event) {  // dropped
		var displacedPath = this.getPath(event.target.src);
		var selectedPath = this.getPath(this.state.selected);
		const data = {
			selected: selectedPath, // file name of dragged img
			displaced: displacedPath, // file name it's dropped on
			jsondata: ''
		}
		if (selectedPath === displacedPath) return; //dropped on itself
		let selectedChildNum = parseInt(this.props.db.getChildNum(selectedPath), 10);
		let displacedChildNum = parseInt(this.props.db.getChildNum(displacedPath), 10);
		var picsArr = this.props.db.getData();
		let selectedIndex;
		let displacedIndex;
		for (let i=0;i<picsArr.length;i++) {
			if (picsArr[i].family === this.props.familyId) {
				if (picsArr[i].childNum === selectedChildNum) {
					selectedIndex = i;
				}
				if (picsArr[i].childNum === displacedChildNum) {
					displacedIndex = i;
				}
			}
		}
		let temp = picsArr[selectedIndex].caption;
		picsArr[selectedIndex].caption = picsArr[displacedIndex].caption;
		picsArr[displacedIndex].caption = temp;
		data.jsondata = picsArr;
		// now I have to save this to the json file
		axios.post('http://localhost:5000/api/imgswap', data)  // swap pics in filesystem and rewrite json file
		.then((res) => {
			console.log(res);
		});

	}                                 // but this is just for admin

	render() {
		let picsArr = this.props.db.getData();
		let famArr = this.props.db.getFamilyFromId(this.props.familyId);
			let thumbImgs = famArr.map((thisImgObj, index) => 
					<div key={index}>
					<img id={index} key={index} height='80' width='80' draggable='true' onDragStart={this.drag.bind(this)} onDrop={this.drop.bind(this)} onDragOver={this.allowDrop} alt='thumbnail house' className='img-thumbnail' src={this.props.db.getImgSrc(thisImgObj)} />
				{ (picsArr.length>1) ? (
					<div className='smallText'>
					<button className='smallButton' onClick={() => this.changeHiddens('deletePic', thisImgObj)}>Delete Pic</button></div>
				) : (
					<div className='smallText'>
					Can't delete.  Must have one picture.  Add another first if you want to delete this.</div>
				) }
					 <form onSubmit={(event) => this.captionEditor(event, thisImgObj)}>
					<label>
					<input type='text' size='5' onChange={this.handleChange} />
					</label>
					<div className='smallText'>
					<button type='submit' className='smallButton'>Edit Caption</button>
					</div>
					</form>

					 <form onSubmit={(event) => this.imageResize(event, thisImgObj)}>
					<label>
					<input type='text' size='5' onChange={this.handleResizeChange} />
					</label>
					<div className='smallText'>
					<button type='submit' className='smallButton'>Resize (hxw eg "300x500")</button>
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

class UploadPics extends Component { 

	constructor() {
		super();
		this.state = {
			selectedFile: null
		}
	}

	handleUpload = () => {
		const fd = new FormData();
		fd.append('familyId', this.props.familyId);  // what the hell why does order of these two lines matter
		fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
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
