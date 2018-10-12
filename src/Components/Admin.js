import React, { Component } from 'react';
import axios from 'axios';
import ImageData from '../ImageData.json';

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

class MicroDB {  // I tried various ways to not duplicated this and failed
	// this is a microscopic database acting on pics array
	// it's a little like a relational database, but not really
	// the data is and must be very structured  id's go in order only
	// children always immediately follow their parent
	constructor(id, src, parent_id) {
		this.id = 1;
		this.src = src;
		this.parent_id = parent_id;
		this.pic = [];
		this.getData();
	}

	getData() {
		this.pics = ImageData;
		return this.pics;
	}

	select(selection, condition) {
		// condition is of form x=y
		// I think I should probably return src and id everytime
		var condArr = condition.split('=');
		var condName = condArr[0];
		var condVal = condArr[1];
		if (condName === 'id') {  // this case is easy, id being ordered is enforced
			condVal = parseInt(condVal, 10); // it will be an int, but typing is the rage 
			var index = condVal - 1; // id is ALWAYS index+1
			var thispic = this.pics[index]
		}
		if (selection === 'src') {
			return (thispic);
		}
	}

	getFamily(id) {
		var famArr = [];
		var i = id;
		var len = this.pics.length;
		// first go up the pic array looking for relatives
		while (i < len) {
			if ((this.pics[i-1][2] === this.pics[i][2]) || (this.pics[i][2] === this.pics[i-1][0])) { // either sibling or child
				famArr.push(this.pics[i])
				i++
			}
			else { break; }
		}
		// now go down the pic array looking for relatives
		var j = id - 2;
		while (j >= 0) {
			if ((this.pics[j][2] === this.pics[j+1][2]) || (this.pics[j][0] === this.pics[id-1][2])) { // either sibling or child
				famArr.unshift(this.pics[j]) // keep array sorted
				j--
			}
			else { break; }
		}
		return famArr;
	}
}

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
			selected: selectedPath, // file name of dragged img
			displaced: displacedPath // file name it's dropped on
		}
		if (selectedPath === displacedPath) return;
		axios.post('http://localhost:5000/api/imgswap', data)  // swap pics in filesystem
		// I need to read the json file to switch in there
		var db = new MicroDB();
		var picsArr = db.getData();
		console.log(picsArr);
	//	console.log(data.selected);
	//	console.log(data.displaced);
		console.log(event.target.src); // one it's dropped on
		console.log(this.state.selected);  // one that's dragged
		var selectedExtended = "./img/" + data.selected;
		var displacedExtended = "./img/" + data.displaced;
		var captionArr = [];
		var firstindex = -2;
		var firstcaption = '';
		var secondindex = -2;
		var secondcaption = '';
		for (let i=0; i<picsArr.length; i++) {
			if (picsArr[i][1] === selectedExtended || picsArr[i][1] === displacedExtended) {
				if (firstindex > -2) { firstindex = i; }
				if (!firstcaption) { firstcaption = picsArr[i][3]; }
				if (firstindex > -1) { secondindex = i; }
				if (firstcaption) { secondcaption = picsArr[i][3]; }
			}
		}
		picsArr[firstindex][3] = secondcaption;
		picsArr[secondindex][3] = firstcaption;
		// now I have to save this to the json file
	//	window.location.reload(); // ok, I tried a lot of ways not to do this
	}                                 // but this is just for admin
	
	getImgSrcArr() {
		var imgsrc_arr = [];
		this.state.filelist.forEach((element) => {
			imgsrc_arr.push(['./img/' + element, element]);
		});
		imgsrc_arr.sort(); // prob not necessary, but not counting on file system sort
		var img_arr = imgsrc_arr.map((thisimg, index) => {
		//	var thissrc = thisimg[0] + '#' + Date.now();
			var thissrc = thisimg[0];
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
