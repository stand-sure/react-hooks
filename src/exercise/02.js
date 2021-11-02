// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from "react";

const useLocalStorage = function (
  key,
  defaultValue = "",
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {

  defaultValue = typeof defaultValue === "function" ? defaultValue() : defaultValue;
  serialize = typeof serialize === "function" ? serialize : JSON.stringify;
  deserialize = typeof deserialize === "function" ? deserialize : JSON.parse;

  const getter = () => {
    let value = window.localStorage.getItem(key); // never undefined
    return (value === null) ? defaultValue : deserialize(value);
  };

  const setter = value => localStorage.setItem(key, serialize(value));
  const remover = oldKey => localStorage.removeItem(oldKey);

  return [getter, setter, remover];
};

const useStateWithLocalStorage = (
  key,
  defaultValue = "",
  {serialize, deserialize} = {},
) => {
  key = typeof key === "function" ? key() : key;
  const previousKeyRef = React.useRef(key);
  const [savedValue, setSavedValue, removeSavedValue] = useLocalStorage(key, defaultValue, {
    serialize,
    deserialize,
  });

  const [state, setState] = React.useState(savedValue);

  React.useEffect(() => {
    if (previousKeyRef.current === key) {
      setSavedValue(state);
    }
    else {
      removeSavedValue(previousKeyRef.current);
      previousKeyRef.current = key;
    }
  }, [state, setSavedValue, key, removeSavedValue]);

  return [state, setState];
};

function Greeting({initialName = ""}) {
  const [name, setName] = useStateWithLocalStorage(() => "name", initialName);
  const handleChange = event => setName(event.target.value);

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : "Please type your name"}
    </div>
  );
}

function App() {
  return <Greeting />;
}

export default App;
