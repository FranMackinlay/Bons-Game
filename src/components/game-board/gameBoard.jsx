import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import Monster from '../monster/monster';
import Player from '../player-stats/player';
import Cards from '../cards/cards';
import './gameBoard.css';
import api from '../../services/api';

const { createGame, getPlayerFromGame, getMonsterFromGame, getPlayersCards, playNextTurn } = api();

const { Header, Body, Title, Footer } = Modal;

export default class GameBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.location.state.name,
			gameId: null,
			cardId: null,
			show: false,
			monsterEffect: '',
		};
	}

	componentDidMount() {
		this.hydrateBoard();
	}

	createGame = async name => {
		const createdGame = await createGame(name);
		const game = JSON.parse(createdGame);
		const { id } = game;
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
		this.setState({ cardId, active: cardId });
	};

	handleClose = () => {
		this.setState({ show: false });
		this.hydrateBoard();
	};

	openModal = () => {
		this.setState({ show: true });
	};

	playerAction = async (player, cardId, monster) => {
		const { cards: playerCards } = this.state;
		const cardPlayed = playerCards.filter(card => card.id === cardId);

		if (!cardPlayed[0]) return;

		const { effect, value } = cardPlayed[0];

		switch (effect) {
			case 'SHIELD':
				return this.setState(prevState => ({ player: { ...prevState.player, shield: prevState.player.shield + value } }));

			case 'HEAL':
				this.setState(prevState => {
					if (player.hp + value > player.maxHp) {
						return { player: { ...prevState.player, hp: prevState.player.maxHp } };
					}

					return { player: { ...prevState.player, hp: prevState.player.hp + value } };
				});

				return;

			case 'DAMAGE':
				if (monster.shield) {
					if (monster.shield - value < 0) {
						return this.setState(prevState => ({ monster: { ...prevState.monster, shield: 0, hp: prevState.monster.hp + (monster.shield - value) } }));
					}

					return this.setState(prevState => ({ monster: { ...prevState.monster, shield: prevState.monster.shield - value } }));
				}

				return this.setState(prevState => ({ monster: { ...prevState.monster, hp: prevState.monster.hp - value } }));

			default:
				return;
		}
	};

	monsterAction = async ({ effect, value }, player, monster) => {
		switch (effect) {
			case 'SHIELD':
				return this.setState(prevState => ({ monster: { ...prevState.monster, shield: prevState.monster.shield + value } }));

			case 'HEAL':
				this.setState(prevState => {
					if (monster.hp + value > monster.maxHp) {
						return { monster: { ...prevState.monster, hp: prevState.monster.maxHp } };
					}

					return { monster: { ...prevState.monster, hp: prevState.monster.hp + value } };
				});

				return;

			case 'DAMAGE':
				if (player.shield) {
					if (player.shield - value < 0) {
						return this.setState(prevState => ({ player: { ...prevState.player, shield: 0, hp: prevState.player.hp + (player.shield - value) } }));
					}

					return this.setState(prevState => ({ player: { ...prevState.player, shield: prevState.player.shield - value } }));
				}

				return this.setState(prevState => ({ player: { ...prevState.player, hp: prevState.player.hp - value } }));

			case 'HORROR':
				return this.setState(prevState => ({ player: { ...prevState.player, hp: prevState.player.hp - value } }));

			default:
				break;
		}
	};

	checkForWinners = () => {
		const { player, monster, game } = this.state;

		if (player.hp <= 0) {
			this.setState({ modalMessage: `${monster.name} wins! You lose!` });
			this.openModal();
		}

		if (monster.hp <= 0) {
			this.setState({ modalMessage: `Congratulations ${player.name}! You win!` });
			this.openModal();
		}

		if (game.turnsLeft === 0) {
			this.setState({ modalMessage: `That's a tie, try again!` });
			this.openModal();
		}
	};

	onSubmit = async event => {
		event.preventDefault();
		const { gameId, cardId, player, monster } = this.state;
		const playNext = await playNextTurn(gameId, cardId);
		const { game, monsterEffect } = JSON.parse(playNext);

		if (cardId) this.playerAction(player, cardId, monster);

		this.monsterAction(monsterEffect, player, monster);

		this.setState({ game, active: null, monsterEffect, monsterHasPlayed: true });

		await this.getPlayerCards(player.id);

		this.checkForWinners();
	};

	render() {
		const { name, player, monster, game, cards, show, modalMessage, active, monsterEffect, monsterHasPlayed } = this.state;

		if (player && monster && game && cards) {
			const { currentTurn, turnsLeft } = game;

			return (
				<div className='header'>
					<h1>Bons Game!</h1>
					<h5>Try to beat Cthulhu by selecting a card and clicking on End Turn!</h5>

					<div className='board-container'>
						<div className='players margins'>
							<Monster monster={monster}></Monster>
							<h6 className={monsterHasPlayed ? 'showMonsterText' : 'hideMonsterText'}>
								{monster.name} has played {monsterEffect.effect} with value: {monsterEffect.value}
							</h6>
							<Player name={name} player={player}></Player>
							<div className='cards'>
								{cards.slice(-3).map(({ id, effect, value }, index) => {
									return (
										<div key={index} onClick={() => this.selectCard(id)} className={`cards-single ${active === id ? 'active' : null}`}>
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
						<Modal show={show} onHide={this.handleClose}>
							<Header closeButton>
								<Title>Bons Game</Title>
							</Header>
							<Body>{modalMessage}</Body>
							<Footer>
								<Button variant='primary' onClick={this.handleClose}>
									Play Again
								</Button>
							</Footer>
						</Modal>
					</div>
				</div>
			);
		}
		return <h1 className='loading'>Loading..</h1>;
	}
}
