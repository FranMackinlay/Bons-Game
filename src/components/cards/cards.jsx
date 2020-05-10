import React, { Component } from 'react';
import './cards.css';

export default class Cards extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id='card' class='card'>
				<img src='https://www.mathcs.emory.edu/~cheung/Courses/170/Syllabus/10/FIGS/0/As.png' class='card-img-top' alt='As'></img>
				<div class='card-body'>
					<p class='card-text'>Some quick example.</p>
				</div>
			</div>
		);
	}
}
