import React, { Component } from 'react';
import Cards from '../cards/cards';
import Monster from '../monster/monster';
import Player from '../player-stats/player';
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
		const { id } = JSON.parse(createdGame);
		const gameId = id;
		this.setState({ gameId });
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
	};

	render() {
		const { name, player, monster } = this.state;
		if (player && monster) {
			return (
				<div className='board-container'>
					<Player name={name} player={player}></Player>
					<Monster monster={monster}></Monster>
					<Cards></Cards>
				</div>
			);
		}
		return <h1 className='loading'>Loading..</h1>;
	}
}
