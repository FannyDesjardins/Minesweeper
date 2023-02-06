import React from 'react';
import ReactDOM from 'react-dom';
import MineCount from './MineCount';


export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.handleLeftClick = this.handleLeftClick.bind(this); 
        this.handleRightClick = this.handleRightClick.bind(this);
        this.state = {flag: false};
    }

    handleLeftClick() {
        if(this.state.flag === false && this.props.isGameOver===false) {  //if it's a flag, clicking should not be enabled
            //this.setState({isdisabled: true});

            if(this.props.isMine===true && this.props.clickCount===0) { //if the first click is a mine, the board will reset
                  this.props.reset(this.props.index);
            } else if(this.props.isMine===true) {
                this.props.showTile(this.props.index);
                this.props.setGameOver();
            } else if (this.props.content === '') {
                this.props.showEmptyTiles(this.props.index);
            } else {
                //this.props.setClickCount();
                this.props.showTile(this.props.index);
            }
            
        }  
        
    }

    handleRightClick(e) {  
        e.preventDefault(); 
        if(this.props.isShown===false) {
            if (this.state.flag===false) {  
            this.setState({flag:true}) 
            this.props.setFlagCount(true);
            } else {
            this.setState({flag:false}); 
            this.props.setFlagCount(false);
            }
        }
        
        return false;
    }

    render() {
        let tile;
        /*if(this.state.mineFound===false && this.state.tileHidden===true) {   
            tile = this.props.content;
        } else if(this.state.gameOver=== true || this.state.tileHidden === false) { 
            tile = this.props.content;  
        }*/
        if(this.props.isGameOver===false) {
            if (this.props.isShown===false) {
                if(this.state.flag === true) {
                    tile ='⚑';
                } else {tile='';}
            } else tile=this.props.content;
        } else { 
            if(this.state.flag === true && this.props.isMine===false) {
                tile='✖';
            } else if (this.state.flag === true && this.props.isMine===true) {
                tile='⚑';
            } else if(this.props.isMine === true) {
                tile=this.props.content;
            } else if(this.props.isShown === true) {
                tile=this.props.content;
            }
            
        }

        return ( 
        <button type='button' disabled={this.props.isShown} className="content" onClick={this.handleLeftClick} onContextMenu = {(e) => this.handleRightClick(e)}>
            {tile}
        </button>
        )
    }
}