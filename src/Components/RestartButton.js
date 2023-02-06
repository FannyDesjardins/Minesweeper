import React from 'react';

export default class RestartButton extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.reset();
    }

    render() {
        return <button type='button' onClick={this.handleClick} class="resetbutton">Start over</button>
    }
}