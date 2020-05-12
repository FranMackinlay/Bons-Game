import React, { Component } from 'react';

import Monster from '../monster/monster';
import Player from '../player-stats/player';
import Turns from '../turns/turns';
import Cards from '../cards/cards';
import './gameBoard.css';
import api from '../../services/api';

const { createGame, getPlayerFromGame, getMonsterFromGame, getPlayersCards } = api();

export default class GameBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.location.state.name,
			gameId: null,
		};
	}

	componentDidMount() {
		this.hydrateBoard();
	}

	createGame = async name => {
		const createdGame = await createGame(name);
		const game = JSON.parse(createdGame);
		const { id } = JSON.parse(createdGame);
		const gameId = id;
		this.setState({ gameId, game });
		this.getPlayers(gameId);
		this.getMonster(gameId);
	};

	getPlayers = async gameId => {
		const getPlayer = await getPlayerFromGame(gameId);
		const player = JSON.parse(getPlayer);
		this.setState({ player });
		this.getPlayerCards(player.id);
	};

	getMonster = async gameId => {
		const getMonster = await getMonsterFromGame(gameId);
		const monster = JSON.parse(getMonster);
		this.setState({ monster });
	};

	hydrateBoard = () => {
		const { name } = this.state;
		this.createGame(name);
	};

	getPlayerCards = async playerId => {
		const getCards = await getPlayersCards(playerId);
		const cards = JSON.parse(getCards);
		this.setState({ cards });
	};

	selectCard = cardId => {
		this.setState({ cardId });
	};

	render() {
		const { name, player, monster, game, cards, cardId } = this.state;
		if (player && monster && game && cards) {
			return (
				<div className='board-container'>
					<div className='players margins'>
						<Monster monster={monster}></Monster>
						<Player name={name} player={player}></Player>
						<div className='cards'>
							{cards.map(({ id, effect, value }, index) => {
								return (
									<div key={index} onClick={() => this.selectCard(id)} className='cards-single'>
										<Cards key={id} effect={effect} value={value}></Cards>
									</div>
								);
							})}
						</div>
					</div>
					<div className='game-info margins'>
						<Turns cardId={cardId} game={game}></Turns>
					</div>
				</div>
			);
		}
		return <h1 className='loading'>Loading..</h1>;
	}
}
