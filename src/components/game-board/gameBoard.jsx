import React, { Component } from 'react';

import Monster from '../monster/monster';
import Player from '../player-stats/player';
import Turns from '../turns/turns';
import './gameBoard.css';
import api from '../../services/api';

const { createGame, getPlayerFromGame, getMonsterFromGame } = api();

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
	};

	getMonster = async gameId => {
		const getMonster = await getMonsterFromGame(gameId);
		const monster = JSON.parse(getMonster);
		this.setState({ monster });
	};

	hydrateBoard = () => {
		const { name } = this.state;
		this.createGame(name);
		const { player } = this.state;
		if (player) {
			this.getPLayerCards(player.id);
		}
	};

	render() {
		const { name, player, monster, game } = this.state;
		if (player && monster && game) {
			return (
				<div className='board-container'>
					<div className='players margins'>
						<Monster monster={monster}></Monster>
						<Player name={name} player={player}></Player>
					</div>
					<div className='game-info margins'>
						<Turns game={game}></Turns>
					</div>
				</div>
			);
		}
		return <h1 className='loading'>Loading..</h1>;
	}
}
