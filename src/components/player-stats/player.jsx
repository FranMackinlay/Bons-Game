import React, { Component } from 'react';
import './player.css';

export default class Players extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id='player' class='card mb-3'>
				<div class='row no-gutters'>
					<div class='user col-md-4'>
						<i class='fas fa-user'></i>
					</div>
					<div class='col-md-8'>
						<div class='card-body'>
							<h5 class='card-title'>Card title</h5>
							<p class='card-text'>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
