import React, { Component } from 'react';
import './player.css';

export default class Players extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.name,
			hp: this.props.player.hp,
			maxHp: this.props.player.maxHp,
			shield: this.props.player.shield,
		};
	}

	render() {
		const { name, hp, shield, maxHp } = this.state;
		return (
			<div id='player' className='card mb-3'>
				<div className='row no-gutters'>
					<div className='user col-md-4'>
						<i className='fas fa-user'></i>
					</div>
					<div className='col-md-8'>
						<div className='card-body'>
							<h5 className='card-title'>{name}</h5>
							<div className='hp-shield'>
								<h6 className='card-text'>
									HP: {hp}/{maxHp}
								</h6>
								<h6 className='card-text'>Shield: {shield}</h6>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
