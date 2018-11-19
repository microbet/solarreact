import { Component } from 'react';
import ImageData from '../ImageData.json';
var S_IMG_PATH = './img/';

class MicroDB extends Component {
	// this is a microscopic database acting on pics array
	// it's a little like a relational database, but not really
	// the data is and must be very structured  id's go in order only
	// children always immediately follow their parent
	constructor(id, src, parent_id) {
		super();
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

	getImgSrc(imgObj) {
		return S_IMG_PATH + imgObj.family + '_' + imgObj.childNum + '.jpg';
	}
	
	getFamilyFromId(familyId) {
		let famArr = [];
		this.pics.forEach(function(element) {
			if (element.family === familyId) {
				famArr.push(element);
			}
		});
		return famArr;
	}
	
	getFamily(imgObj, includeSelf=true) {
		let famArr = [];
		console.log("imob = ", imgObj);
		this.pics.forEach(function(element) {
//			console.log("ef = ", element.family);
//			console.log("of = ", imgObj.family);
//			console.log("ec = ", element.childNum);
//			console.log("ic = ", imgObj.childNum);
//			console.log("is = ", includeSelf);
			if ((element.family === imgObj.family && includeSelf) || 
			    (element.family === imgObj.family && element.childNum !== imgObj.childNum && !includeSelf)) {
				console.log("in here emelent = ", element);
				famArr.push(element);
			}
		});
		return famArr;
	}

	getParent(familyId) {
		for (let i=0; i<this.pics.length;i++) {
			if (this.pics[i].family === familyId && this.pics[i].childNum === 0) {
				return this.pics[i];
			}
		}
	}
	
	getFamNum(fileName) {  // get the family number from a filename with or without path
		console.log("filename = ", fileName);
		let regex = /.?([0-9]*)[_]{0,1}.?\.[a-zA-Z]{3,4}/g
		let matches = regex.exec(fileName);
		return matches[1];
	}
	
	getChildNum(fileName) {
		let regex = /.?([0-9]*)_([0-9]*).*/g
		let matches = regex.exec(fileName);
		if (matches) {
			return matches[2];
		} else {
			return -1;
		}
	}
	
	isParent(fileName) {  
		if (fileName.includes('_')) { return false; }
		else { return true; }
	}
	
}

export default MicroDB
