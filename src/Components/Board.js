import React from 'react';
import ReactDOM from 'react-dom';
import Tile from './Tile';
import './Board.css';
import RestartButton from './RestartButton'
import { clear } from '@testing-library/user-event/dist/clear';
import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/matchers';

let fullBoard = [];
let hiddenBoard = [];
let resetCounter = 0;
let clickCounter = 0;
let tileShown = 0;
let sizeColumns=8;
let sizeRows =8;

export default class Board extends React.Component {  
    

    constructor(props) {
        super(props);

        this.makeGrid=this.makeGrid.bind(this);
        this.setGameOver = this.setGameOver.bind(this);
        this.showTile = this.showTile.bind(this); 
        this.setFlagCount = this.setFlagCount.bind(this);
        this.setWinner = this.setWinner.bind(this);
        this.reset = this.reset.bind(this);
        this.setClickCount = this.setClickCount.bind(this);
        this.showEmptyTiles = this.showEmptyTiles.bind(this);
        this.state = {message:'', fullBoard: fullBoard, numMines: 10, hiddenBoard: hiddenBoard, hasBuilt: false, gameOver:false, flagCount:0, clickCount: clickCounter};//set default state
    }

    showEmptyTiles(index) { //function to reveal the tiles that are blank 
        if(fullBoard[index].content==='') { //this condition is here in case the first mine clicked is a mine, see reset function below
            if(index>(sizeColumns-1)) { //excludes top row
                if(index%sizeColumns!==0) { //excludes the left column
                    if(fullBoard[(index - sizeColumns)-1].isShown===false && fullBoard[(index - sizeColumns) - 1].content==='') {
                        fullBoard[index - sizeColumns-1].isShown=true; //top left (show tile and recurse)
                        this.showEmptyTiles(index - sizeColumns - 1);     
                    } else if(fullBoard[(index - sizeColumns)-1].isShown===false) {
                        fullBoard[index - sizeColumns-1].isShown=true; //top left (show tile but dont recurse)
                        clickCounter++;
                    }
                }

                if((index+1)%sizeColumns!==0) { //excludes the right column
                    if(fullBoard[index - sizeColumns+1].isShown===false && fullBoard[index-sizeColumns+1].content==='') {
                        fullBoard[(index - sizeColumns)+1].isShown=true; //top right (show tile and recurse)
                        this.showEmptyTiles(index-sizeColumns+1);
                    } else if(fullBoard[index - sizeColumns+1].isShown===false) { 
                        fullBoard[(index - sizeColumns)+1].isShown=true; //top right (show tile but dont recurse) 
                        clickCounter++;
                    }
    
                }
                    
                if(fullBoard[index - sizeColumns].isShown===false && fullBoard[index - sizeColumns].content==='') {
                    fullBoard[index - sizeColumns].isShown=true; //top (show tile and recurse)
                    this.showEmptyTiles(index - sizeColumns);
                } else if(fullBoard[index - sizeColumns].isShown===false) {
                    fullBoard[index - sizeColumns].isShown=true; //top (show tile but dont recurse)
                    clickCounter++;
                }
                    
            }
        

            if(index+sizeColumns<(sizeColumns*sizeRows)) { //excludes bottom row
                
                if(index % sizeColumns !==0) { //excludes the left column
                    if(fullBoard[index + sizeColumns - 1].isShown===false && fullBoard[index + sizeColumns - 1].content==='') {
                        fullBoard[index + sizeColumns - 1].isShown=true; //bottom left (show tile and recurse)
                        this.showEmptyTiles(index + sizeColumns-1);
                    } else if(fullBoard[index + sizeColumns - 1].isShown===false) {
                        fullBoard[index + sizeColumns - 1].isShown=true; //bottom left (show tile but dont recurse)
                        clickCounter++; 
                    }
                }

                if((index+1) % sizeColumns !==0) { //excludes the right column
                    if(fullBoard[index +sizeColumns + 1].isShown===false && fullBoard[index + sizeColumns + 1].content==='') {
                        fullBoard[index +sizeColumns + 1].isShown=true; //bottom right (show tile and recurse)
                        this.showEmptyTiles(index+sizeColumns+1);
                    } else if(fullBoard[index +sizeColumns + 1].isShown===false) {
                        fullBoard[index +sizeColumns + 1].isShown=true; //bottom right (show tile but dont recurse)
                        clickCounter++;
                    }
                    
                }

                if(fullBoard[index + sizeColumns].isShown===false && fullBoard[index + sizeColumns].content==='') {
                    fullBoard[index + sizeColumns].isShown=true; //bottom (show tile and recurse)
                    this.showEmptyTiles(index + sizeColumns);
                } else if(fullBoard[index + sizeColumns].isShown===false) {
                    fullBoard[index + sizeColumns].isShown=true; //bottom (show tile but dont recurse)
                    clickCounter++;
                }
                
            }

            if(index%sizeColumns!==0) { //excludes the left column
                if(fullBoard[index - 1].isShown===false && fullBoard[index - 1].content==='') {
                    fullBoard[index - 1].isShown=true; //left (show tile and recurse)
                    this.showEmptyTiles(index-1);
                } else if(fullBoard[index - 1].isShown===false) {
                    fullBoard[index - 1].isShown=true; //left (show tile but dont recurse)
                    clickCounter++;
                }
                
            }

            if((index +1) % sizeColumns!==0) { //excludes the right column
                if(fullBoard[index + 1].isShown===false && fullBoard[index+1].content==='') {
                    fullBoard[index + 1].isShown=true; //right (show tile and recurse)
                    this.showEmptyTiles(index+1);
                } else if(fullBoard[index + 1].isShown===false) {
                    fullBoard[index + 1].isShown=true; //right (show tile but dont recurse) 
                    clickCounter++;
                }
                
            }
        }
        this.showTile(index);
    }

    setClickCount(index) { //to make sure the first click isnt a mine, we count clicks  
        clickCounter++;
        this.setState({clickCount: clickCounter});
  
    }

    setWinner() {
        this.setState({gameOver: true, message:'You win!'});
    }

    setFlagCount(bool) {
        this.setState({flagCount: bool ? this.state.flagCount  + 1 : this.state.flagCount  - 1});
    }

    setGameOver() {
        this.setState({gameOver: true, message:'Game over :('});
    }

    showTile(index) {
        fullBoard[index].isShown=true;
        this.setState({fullBoard: {fullBoard}});
        for (let i=0; i<sizeColumns*sizeRows; i++) {
            if(fullBoard[i].isShown===true) {
                tileShown++;
            }
        }
        if (tileShown===sizeColumns*sizeRows-this.state.numMines && fullBoard[index].isMine === false) {
            this.setWinner()
        } else {
            tileShown = 0;
        }
        
        this.setClickCount(index);
    }

    makeGrid(rows,columns) {
        function createTileContent(index, content, isMine, isShown) {
            return {
              index: index,
              content: content,
              isMine: isMine,
              isShown: isShown
            };
        }

        for (let i=0; i<rows*columns;i++) {
            fullBoard[i] = createTileContent(i,'',false, false);
        }
 
        let minesPosition = new Array(this.state.numMines);
            
        for(let l=0; l<this.state.numMines; l++) { //sets the mines position
            minesPosition[l] = Math.floor(Math.random()*rows*columns);
        
            for (let m = 0; m < l;m++) { //checks if position is already taken by another mine
                if (minesPosition[m]===minesPosition[l]) {
                    minesPosition[l] = Math.floor(Math.random()*rows*columns);   
                    m = 0;
                }
            }
        }
        minesPosition.sort(function(a, b){return a-b}); //sorts minesPosition in array of ascending numbers

        for(let j=0 ; j<rows*columns;j++) { 
           for(let i=0;i<this.state.numMines; i++)  {
                if(minesPosition[i]===j) {
                    fullBoard[j].content='💣';//`${i}`; adds a mines 
                    fullBoard[j].isMine= true;  
                }
           }
        }

        for(let k=0; k<rows*columns; k++) {
            if(fullBoard[k].isMine===false) {
                let mineCounter = 0;
                if(k%8!==0) { //excludes when on the left side of board
                    if(k-columns-1 >= 0 && fullBoard[k-columns-1].isMine===true) { //top left + excludes negative index
                        mineCounter++;
                    }
                    if(k+columns-1 < rows*columns && fullBoard[k+columns-1].isMine===true) { //bottom left + excludes index over 63
                        mineCounter++;
                    }
                    if(k-1 >= 0 && fullBoard[k-1].isMine===true) { //left + excludes negative index
                        mineCounter++;
                    }
                }
                
                if((k+1)%8!==0) { //excludes when on the right side of board 
                    if(k-columns+1 >=0 && fullBoard[k-columns+1].isMine===true) { //top right + excludes negative index
                        mineCounter++;
                    }
                    if(k+columns+1 < rows*columns && fullBoard[k+columns+1].isMine===true) { //bottom right + excludes index over 63
                        mineCounter++;
                    }
                    if(k+1<rows*columns && fullBoard[k+1].isMine===true) { //right + excludes index over 63
                        mineCounter++;
                    }
                }

                if(k-columns >=0 && fullBoard[k-columns].isMine===true) { //top + excludes negative index 
                    mineCounter++;
                } 
                if(k+columns < rows*columns && fullBoard[k+columns].isMine===true) { //bottom + excludes index over 63   
                    mineCounter++;
                }
                
                if(mineCounter===0) {
                    fullBoard[k].content=''; 
                } else {
                    fullBoard[k].content = mineCounter;
                }

            }
             
        }
        this.setState({fullBoard: {fullBoard}, hasBuilt: true});   
    }
 
    componentDidMount() {
        this.makeGrid(sizeRows,sizeColumns);
    } 

    reset(index) {
        resetCounter++; 
        this.makeGrid(sizeRows, sizeColumns);
        if(clickCounter===0 && fullBoard[index].isMine === true) { //if there's a mine again at that position, reset
            this.reset(index);
        } else if (clickCounter===0 && fullBoard[index].isMine === false) {
            this.showEmptyTiles(index); //if not empty tile, only showTile will be executed
        } else {
            clickCounter=0;
            this.setState({clickCount: 0, flagCount:0, message:'', gameOver: false});
        }
    }

    render() {
        let tiles=[]
        if(this.state.hasBuilt===true) {
            tiles = this.state.fullBoard.fullBoard.map(obj => <Tile key ={obj.index} {...obj} isGameOver={this.state.gameOver} clickCount={this.state.clickCount} setGameOver={this.setGameOver} setFlagCount={this.setFlagCount} setWinner={this.setWinner} setClickCount={this.setClickCount} showTile={this.showTile} showEmptyTiles= {this.showEmptyTiles} reset={this.reset}/>);
        }
        return (
            <div key={resetCounter}>
                <div className='container'>
                    {tiles}
                </div>
                <div class="mineCounter">
                    Number of mines left to identify: {10-this.state.flagCount}
                </div>
                <RestartButton reset={this.reset}/>
                <h1>{this.state.message}</h1>
            </div> 
        )
    }
}