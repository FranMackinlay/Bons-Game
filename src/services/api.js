const api = (API_URL = 'http://game.bons.me/api') => {
  const getGameEndpoint = `${API_URL}/games`;
  const getPlayersEndpoint = `${API_URL}/players`;
  const getMonstersEndpoint = `${API_URL}/monsters`;
  return {
    login: async (name) => {
      try {
        const response = fetch(`${getGameEndpoint}`, {
          method: 'POST',
          body: JSON.stringify({ name }),
          headers: {
            'Content-type': 'application/json'
          },
        });

        const login = await response;

        return login;

      } catch (error) {
        console.error(error);
      }
    },
    getGame: async (gameId) => {
      try {
        const response = fetch(`${getGameEndpoint}/${gameId}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json'
          },
        });

        const game = await response.json();

        return game;

      } catch (error) {
        console.error(error);
      }
    },
    getPlayerFromGame: async (gameId) => {
      const response = fetch(`${getGameEndpoint}/${gameId}/player`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        },
      }).then(response => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            async function pump() {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              return pump();
            }
          }
        })
      })
        .then(stream => new Response(stream))
        .then(response => {
          return response.text();
        })
        .catch(err => console.error(err));

      return await response;
    },
    getMonsterFromGame: async (gameId) => {
      const response = fetch(`${getGameEndpoint}/${gameId}/monster`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        },
      }).then(response => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            async function pump() {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              return pump();
            }
          }
        })
      })
        .then(stream => new Response(stream))
        .then(response => {
          return response.text()
        })
        .catch(err => console.error(err));

      return await response;
    },
    getPlayerUsingId: async (playerId) => {
      const response = fetch(`${getPlayersEndpoint}/${playerId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        },
      });

      const playerUsingId = await response.json();

      return playerUsingId;
    },
    getMonsterUsingId: async (monsterId) => {
      const response = fetch(`${getMonstersEndpoint}/${monsterId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        },
      });

      const monsterUsingId = await response.json();

      return monsterUsingId;
    },
    getPlayersCards: async (playerId) => {
      const response = fetch(`${getPlayersEndpoint}/${playerId}/cards`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        },
      }).then(response => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            async function pump() {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              return pump();
            }
          }
        })
      })
        .then(stream => new Response(stream))
        .then(response => {
          return response.text()
        })
        .catch(err => console.error(err));

      return await response;

      // const playersCards = await response.json();

      // return playersCards;
    },
    createGame: async (name) => {
      const response = fetch(`${getGameEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ name }),
      }).then(response => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            async function pump() {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              return pump();
            }
          }
        })
      })
        .then(stream => new Response(stream))
        .then(response => {
          return response.text()
        })
        .catch(err => console.error(err));

      return await response;

    },
    playNextTurn: async (gameId, cardId) => {
      const response = fetch(`${getGameEndpoint}/${gameId}/next-turn`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          card: `${cardId}`
        }),
      });

      const playNextTurn = await response.json();

      return playNextTurn;
    }
  }
}

export default api;
