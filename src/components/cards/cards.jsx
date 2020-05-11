import React, { Component } from 'react';
import './cards.css';

export default class Cards extends Component {
	constructor(props) {
		super(props);
		this.state = {
			effect: this.props.effect,
			value: this.props.value,
		};
	}

	render() {
		const { effect, value } = this.state;
		return (
			<div id='card' className='card'>
				<h4>{effect}</h4>
				<div className='card-body'>
					<h5 className='card-text'>Value: {value}</h5>
				</div>
			</div>
		);
	}
}
