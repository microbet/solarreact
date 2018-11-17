import { Component } from 'react';
import ImageData from '../ImageData.json';

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

	getFamily(imgObj, includeSelf=true) {
		let famArr = [];
		this.pics.forEach(function(element) {
			if ((element.family === imgObj.family && includeSelf) || 
			    (element.family === imgObj.family && element.childNum !== imgObj.childNum && !includeSelf)) {
				famArr.push(element);
			}
		});
		return famArr;
	}

	getParent(familyId) {
		console.log("familyId = ", familyId);
		console.log("tpl = ", this.pics.length);
		for (let i=0; i<this.pics.length;i++) {
			console.log("i = ", i);
			console.log("tpi = ", this.pics[i]);
			if (this.pics[i].family === familyId && this.pic[i].childNum === 0) {
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

