/* eslint-disable react-hooks/exhaustive-deps */
// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from "react";
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from "../pokemon";
import {withErrorBoundary} from "react-error-boundary";

const idle = "idle";
const pending = "pending";
const resolved = "resolved";
const rejected = "rejected";

// const withErrorBoundary = Component => props =>
//   (
//     <ErrorBoundary FallbackComponent={props.FallbackComponent || ErrorFallback}>
//       <Component {...props} />
//     </ErrorBoundary>
//   );

function ErrorFallback({error, resetErrorBoundary}) {
  const {message} = error;
  return error ? (
    <div className="alert">
      There was an error: <pre style={{whiteSpace: "normal"}}>{message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  ) : null;
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: pokemonName ? idle : pending,
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
        throw error;
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
      throw error;
    default:
      throw new ErrorFallback(`Unexpected status: ${status}`);
  }

  return retVal;
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  function handleReset() {
    setPokemonName("");
  }

  const PokemonInfoWithErrorBoundary = withErrorBoundary(PokemonInfo, {
    FallbackComponent: ErrorFallback,
    onError: console.error,
    onReset: handleReset,
    resetKeys: [pokemonName],
  });

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfoWithErrorBoundary pokemonName={pokemonName} />
      </div>
    </div>
  );
}

export default App;
