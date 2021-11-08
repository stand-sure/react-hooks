/* eslint-disable react-hooks/exhaustive-deps */
// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from "react";
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from "../pokemon";

function Error({error}) {
  console.log(error);
  return error ? (
    <div className="alert">
      There was an error:{" "}
      <pre style={{whiteSpace: "normal"}}>{error.message}</pre>
    </div>
  ) : null;
}

const idle = "idle";
const pending = "pending";
const resolved = "resolved";
const rejected = "rejected";

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: idle,
  });

  const {pokemon, error, status} = state;

  React.useEffect(() => {
    if (!pokemonName) {
      setState({status: idle});
      return;
    }

    setState({status: pending});
    fetchPokemon(pokemonName)
      .then(data => {
        setState({pokemon: data, status: resolved});
      })
      .catch(error => {
        setState({error, status: rejected});
      });
  }, [pokemonName]);

  let retVal;
  switch (status) {
    case idle:
      retVal = "Submit a pokemon";
      break;
    case pending:
      retVal = <PokemonInfoFallback name={pokemonName} />;
      break;
    case resolved:
      retVal = <PokemonDataView pokemon={pokemon} />;
      break;
    case rejected:
      retVal = <Error error={error} />;
      break;
    default:
      throw new Error(`Unexpected status: ${status}`);
  }

  return retVal;
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  );
}

export default App;
