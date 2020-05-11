import React, { Component } from 'react';
import './turns.css';

export default class Turns extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTurn: this.props.game.currentTurn,
			turnsLeft: this.props.game.turnsLeft,
			cardId: this.props.card.id,
		};
	}

	onSubmit = async event => {
		event.preventDefault();
		console.log('submittt');
	};

	render() {
		const { currentTurn, turnsLeft } = this.state;
		return (
			<form className='turns-info' onSubmit={this.onSubmit}>
				<div className='info'>
					<div className='current-turn info-state'>
						<h4>Current Turn:</h4>
						<h5>{currentTurn}</h5>
					</div>
					<div className='turns-left info-state'>
						<h4>Turns Left:</h4>
						<h5>{turnsLeft}</h5>
					</div>
				</div>
				<button className='submit' type='submit'>
					End Turn
				</button>
			</form>
		);
	}
}
