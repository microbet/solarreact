import React, { Component } from 'react';
import axios from 'axios';
import ImageData from '../ImageData.json';

class Admin extends Component {
	constructor() {
		super();
		this.state = {
	//		admin: "",   // commented out for testing, comment out next line instead in prod
			admin: "verified",
			fileLsHidden: false,
			captionHidden: true,
			upLoadHidden: true, 
			picCategory: ''
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
			return( // show them the login form
				  <div>
				  {!this.state.fileLsHidden && <FileLS admin={this.state.admin} changeHiddens={ () => this.setState( { 
						  upLoadHidden: true,
					 	 fileLsHidden: true,
					 	 captionHidden: false
				  	})
				  } />
				}
				  {!this.state.upLoadHidden && <UploadPics admin={this.state.admin} picCategory={this.state.picCategory} /> }
					{!this.state.captionHidden && <EditCaptions admin={this.state.admin} /> }
				  <button className="mediumButton" onClick={(picCategory) => this.addpicClick('newsubpic')}>
				  <p className="mediumText">add pic for this job</p>
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

	changeHiddens(control, imgfile) {  // changeHiddens doesn't seem like the right name anymore
		console.log(imgfile);
		if (control === 'deletePic') {
			const data = {
				imgfile: imgfile, // number of image (they are one greater than index because I used 0 to mean something special - 'no parent' in another field)
			}
			axios.post('http://localhost:5000/api/deletepic', data)  // swap pics in filesystem and rewrite json file
		.then((res) => {
			console.log(res);
		});
		}
			
				console.log(control);
					console.log(imgfile);
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

		// window.location.reload(); // ok, I tried a lot of ways not to do this
	}                                 // but this is just for admin
	
	getImgSrcArr() {
		let imgsrc_arr = [];
		this.state.filelist.forEach((element) => {
			imgsrc_arr.push(['./img/' + element, element]);
		});
		imgsrc_arr.sort(); // prob not necessary, but not counting on file system sort
		var img_arr = imgsrc_arr.map((thisimg, index) => {
		//	var thissrc = thisimg[0] + '#' + Date.now();
			let thissrc = thisimg[0];
			let thisfile = thisimg[1];
			return <div key={index}><img id={index} key={index} height="80" width="80" draggable="true" onDragStart={this.drag.bind(this)} onDrop={this.drop.bind(this)} onDragOver={this.allowDrop} alt="thumbnail house" className="img-thumbnail" src={thissrc} /><div className="smallText"><button className="smallButton" onClick={() => this.changeHiddens('editCaption', index)}>Edit Caption</button><button className="smallButton" onClick={() => this.changeHiddens('deletePic', {thisfile})}>Delete Pic</button></div></div>
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
		fd.append('picCategory', this.props.picCategory);
			axios.post('http://localhost:5000/api/imgupload', fd)
			.then((res) => {
				console.log('back from server');
				console.log(res);
			});
		// ok, uploading isn't letting you pick if it's another project or another
		// picture for the same project
		// I forget where it renames the file
		// I need to update the json when I upload a picture
		/*
		// need to update the ImageData file too
		// for now I'm doing this in a separate call because uploading the image
		// was a pain and I don't want to interfere with it
		var db = new MicroDB();
		var picsArr = db.getData();
		picsArr.push([picsArr.length], "./img/
		axios.post('http://localhost:5000/api/updateJson', data)  // swap pics in filesystem and rewrite json file
		.then((res) => {
			console.log(res);
		});
		*/
	}

	handleChange = event => {
		this.setState( { selectedFile: event.target.files[0] } );
	}
	render() {
		console.log(this.props.picCategory);
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
