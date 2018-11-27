import React, { Component } from 'react';
import { Column, Row } from 'simple-flexbox';
import './App.css';
import Head from './Components/Head';
import JumboTron from './Components/JumboTron';
import Admin from './Components/Admin';
import MicroDB from './Tools/MicroDB';

class App extends Component {
	constructor() {
		super();
		// let every component have access to all the data?
		// convenient and I'm sure fine in this app because there could 
		// never be a huge amount, dunno what happens when there is
		// 
		// I think I should ditch the bootstrap stuff because I can't 
		// figure out where to make the next and prev arrows 
		// work right
		//
		// switching images doesn't work on the second
		// set of images and when doing admin on family 2 it shouldn't
		// send you back to family one each time
		//
		var db = new MicroDB();
		this.state = {
			pics : db.getData(),
			familyId : 1,
			db: db,
		}
	}
  render() {
    return (
      <div className="App">
	    <Head />
	    <JumboTron />
	    <Carousel pics={this.state.pics} familyId={this.state.familyId} db={this.state.db} changeFamily={ (familyId) => this.setState({familyId}) } />
	    <br />
	    <Admin familyId={this.state.familyId} db={this.state.db} changeFamily={ (familyId) => this.setState({familyId}) } />
      </div>
	 );
  }
}

export default App;

class Carousel extends Component {
	constructor(props) {
		super(props);
	//	var mainpic =  this.mainpic ? this.mainpic : this.props.pics[this.props.familyId - 1] 
		this.state = {
			mainpic :  this.props.db.getParent(this.props.familyId), 
			anotherFam : false,
			priorFam : false,
			}
	}

	componentDidMount() {
		this.checkPicNavigation(this.props.familyId);
	}

	checkPicNavigation(targetNavigation) {
		// check to see if there's anotherFam or not
		this.setState({anotherFam : false } );
		this.setState({priorFam : false } );
		for (let i=0;i<this.props.pics.length;i++) {
			if (this.props.pics[i].family > targetNavigation) {
				this.setState({anotherFam : true });
			}
		}
		if (targetNavigation > 1) { this.setState({priorFam : true }); }
	}

	handleClick(direction) {
		let targetFamily;
		if (direction === "next") {
			targetFamily = this.props.familyId + 1;
		}
		if (direction === "prev") {
			targetFamily = this.props.familyId - 1;
		}
		this.setState({mainpic:this.props.db.getParent(targetFamily)});
		this.props.changeFamily(targetFamily) // this is sending info back to parent/grandparent 
		this.checkPicNavigation(targetFamily);
	//	document.getElementById('firstslidecaption').innerHTML = this.props.db.getCaption(targetFamily);
	}

  render() {
    return (
		 <div>
		<Row vertical='center' horizontal='center'>
		 <Column alignContent='start'>
		 { this.state.priorFam ? (
		  <svg onClick={() => this.handleClick("prev")} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="15" y1="6" x2="8" y2="12"></line><line x1="8" y1="12" x2="15" y2="18"></line><line x1="15" y1="0" x2="0" y2="12"></line><line x1="0" y1="12" x2="15" y2="24"></line></svg>
		 ) : (
					<span></span>
					)
				  }
		 </Column>
		 <Column horizontal='center' style={{ backgroundColor: '#cccccc' }}>
                <img
                  src={this.props.db.getImgSrc(this.state.mainpic)}
                  alt="First slide"
                  id="firstslide"
		 		  width="100%"	
                />
				  { this.state.mainpic.caption ? (
					<div> &nbsp; &nbsp; {this.state.mainpic.caption} &nbsp; &nbsp;</div>
					) : (
					<span></span>
					)
				  }
		 </Column>
		 <Column alignItems='start'>
		 { this.state.anotherFam ? (
		  <svg onClick={() => this.handleClick("next")} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="8" y1="6" x2="15" y2="12"></line><line x1="15" y1="12" x2="8" y2="18"></line><line x1="8" y1="0" x2="23" y2="12"></line><line x1="23" y1="12" x2="8" y2="24"></line></svg>
		 ) : (
			 <span></span>
		 )
		 }
		 </Column>
		 </Row>
                  <div>
                    <Pictures db={this.props.db} mainpic={this.state.mainpic} changeMain={ (mainpic) => this.setState({mainpic})} />
                  </div>
				  </div>
    );
  }
}


class Pictures extends Component {

  render() {
    var subImageStyle = {
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "flex-end"
    };
	if (this.props.mainpic) {
	  var famArr = this.props.db.getFamily(this.props.mainpic, false);
	  var ImageSources = famArr.map(memberObj => {
	      return (
		      <ChildPic db={this.props.db} caption={memberObj.caption} childObj={memberObj} key={'childpic' + memberObj.childNum} mainpic={this.props.mainpic} changeMain={this.props.changeMain} />
	      );
        });
   }
    return (<div style={subImageStyle}>{ImageSources}</div>);
  }
}

class ChildPic extends Component {
	constructor(props) {
		super(props);
		this.state = {
			opacity: "0.7"
		};
		this.id = this.props.id;
		this.mainpic = this.props.mainpic;
		this.mainsrc = this.props.db.getImgSrc(this.mainpic);
	}

  mouseOut(src) {
    this.setState({
      opacity: "0.7"
    });
  }

  mouseOver(src) {
    this.setState({
      opacity: "1"
    });
  }

	handleClick() {
		this.props.changeMain(this.props.childObj) // this is sending info back to parent/grandparent 

	//var text;
		var temp = this.mainsrc;
		this.mainsrc = this.src;
		this.src = temp;

//	document.getElementById('firstslidecaption').innerHTML = this.props.childObj.caption;
		//	this should be sending mainsrc.caption or something
		//	maybe it works fine now
}

  render() {
    var thumbStyle = {
      opacity: this.state.opacity
    };
    return (
      <img
        onMouseOut={() => this.mouseOut()}
        onMouseOver={() => this.mouseOver()}
		  onClick={() => this.handleClick()}
        style={thumbStyle}
        className="img-thumbnail"
        height="80"
        width="80"
        src={this.props.db.getImgSrc(this.props.childObj)}
		alt="solar"
	    key={'thumb' + this.props.childObj.childNum}
      />
    );
  }
}
