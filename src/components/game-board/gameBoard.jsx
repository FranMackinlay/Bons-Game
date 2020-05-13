import React, { Component } from 'react';

import Monster from '../monster/monster';
import Player from '../player-stats/player';
import Cards from '../cards/cards';
import './gameBoard.css';
import api from '../../services/api';

const { createGame, getPlayerFromGame, getMonsterFromGame, getPlayersCards, playNextTurn } = api();

export default class GameBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.location.state.name,
			gameId: null,
			cardId: null,
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

	playerAction = async (player, cardId, monster) => {
		const playerCards = JSON.parse(await getPlayersCards(player.id));
		const cardPlayed = playerCards.filter(card => card.id === cardId);
		if (!cardPlayed[0]) return;
		const { effect, value } = cardPlayed[0];

		switch (effect) {
			case 'SHIELD':
				this.setState(prevState => ({ player: { ...prevState.player, shield: prevState.player.shield + value } }));
				break;
			case 'HEAL':
				this.setState(prevState => {
					if (player.hp + value > player.maxHp) {
						return { player: { ...prevState.player, hp: prevState.player.maxHp } };
					}
					return { player: { ...prevState.player, hp: prevState.player.hp + value } };
				});
				break;
			case 'DAMAGE':
				if (monster.shield) {
					if (monster.shield - value < 0) {
						return this.setState(prevState => ({ monster: { ...prevState.monster, shield: 0, hp: prevState.monster.hp + (monster.shield - value) } }));
					}
					return this.setState(prevState => ({ monster: { ...prevState.monster, shield: prevState.monster.shield - value } }));
				}
				this.setState(prevState => ({ monster: { ...prevState.monster, hp: prevState.monster.hp - value } }));
				break;
			default:
				break;
		}
	};

	monsterAction = async ({ effect, value }, player, monster) => {
		switch (effect) {
			case 'SHIELD':
				this.setState(prevState => ({ monster: { ...prevState.monster, shield: prevState.monster.shield + value } }));
				break;
			case 'HEAL':
				this.setState(prevState => {
					if (monster.hp + value > monster.maxHp) {
						this.setState(prevState => {
							return { monster: { ...prevState.monster, hp: prevState.monster.maxHp } };
						});
					}
					return { monster: { ...prevState.monster, hp: prevState.monster.hp + value } };
				});
				break;
			case 'DAMAGE':
				if (player.shield) {
					if (player.shield - value < 0) {
						return this.setState(prevState => ({ player: { ...prevState.player, shield: 0, hp: prevState.player.hp + (player.shield - value) } }));
					}
					return this.setState(prevState => ({ player: { ...prevState.player, shield: prevState.player.shield - value } }));
				}
				this.setState(prevState => ({ player: { ...prevState.player, hp: prevState.player.hp - value } }));
				break;
			case 'HORROR':
				if (player.shield) {
					if (player.shield - value < 0) {
						return this.setState(prevState => ({ player: { ...prevState.player, shield: 0, hp: prevState.player.hp + (player.shield - value) } }));
					}
					return this.setState(prevState => ({ player: { ...prevState.player, shield: prevState.player.shield - value } }));
				}
				this.setState(prevState => ({ player: { ...prevState.player, hp: prevState.player.hp - value } }));
				break;

			default:
				break;
		}
	};

	onSubmit = async event => {
		event.preventDefault();
		const { gameId, cardId, player, monster } = this.state;
		if (cardId) this.playerAction(player, cardId, monster);
		const playNext = await playNextTurn(gameId, cardId);
		const { game, monsterEffect } = JSON.parse(playNext);
		console.log(monsterEffect);

		this.monsterAction(monsterEffect, player, monster);
		this.setState({ game });
		await this.getPlayerCards(player.id);
	};

	render() {
		const { name, player, monster, game, cards } = this.state;
		if (player && monster && game && cards) {
			const { currentTurn, turnsLeft } = game;
			return (
				<div className='board-container'>
					<div className='players margins'>
						<Monster monster={monster}></Monster>
						<Player name={name} player={player}></Player>
						<div className='cards'>
							{cards.slice(-3).map(({ id, effect, value }, index) => {
								return (
									<div key={index} onClick={() => this.selectCard(id)} className='cards-single'>
										<Cards key={id} effect={effect} value={value}></Cards>
									</div>
								);
							})}
						</div>
					</div>
					<div className='game-info margins'>
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
					</div>
				</div>
			);
		}
		return <h1 className='loading'>Loading..</h1>;
	}
}
