import React, { Component } from 'react';
import Cards from '../cards/cards';
import api from '../../services/api';
import './player.css';

const { getPlayersCards } = api();

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

	componentDidMount() {
		this.hydratePlayer();
	}

	hydratePlayer = async () => {
		const { id } = this.props.player;
		this.getPlayerCards(id);
	};

	getPlayerCards = async playerId => {
		const getCards = await getPlayersCards(playerId);
		const cards = JSON.parse(getCards);
		this.setState({ cards });
	};

	render() {
		const { name, hp, shield, maxHp, cards } = this.state;
		if (cards) {
			return (
				<div className='player-cards'>
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
					<div className='cards'>
						{cards.map(({ id, effect, value }) => {
							return <Cards key={id} effect={effect} value={value}></Cards>;
						})}
					</div>
				</div>
			);
		}
		return <h3>Loading..</h3>;
	}
}
