const api = (API_URL = 'http://game.bons.me/api') => {
  const getGameEndpoint = `${API_URL}/games`;
  const getPlayersEndpoint = `${API_URL}/players`;
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
    }
  }
}

export default api;
