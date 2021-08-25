import React from 'react';
import { Pills } from './Pills';

export interface PillData {
  id: string;
  value: string;
}

const initialState: PillData[] = [
  {
    id: '1',
    value: 'tesla cybertruck',
  },
  { id: '2', value: 'ceo elon musk' },
  { id: '3', value: 'electric pickup' },
  { id: '4', value: 'truck' },
  { id: '5', value: 'motor' },
  { id: '6', value: 'tesla' },
  { id: '7', value: 'production' },
  { id: '8', value: 'model' },
  { id: '9', value: 'car' },
  { id: '10', value: 'reviews' },
  { id: '11', value: 'deliveries' },
  { id: '12', value: 'cybertruck' },
  { id: '13', value: 'electric' },
  { id: '14', value: 'news' },
  { id: '15', value: 'features' },
  { id: '16', value: 'date' },
  { id: '17', value: 'company' },
  { id: '18', value: 'musk' },
  { id: '19', value: 'spacex' },
];

interface SetHeaderAction {
  type: 'ToggleHeader';
  payload: string;
}

const reducer = (state: string[], action: SetHeaderAction): string[] => {
  if (action.type === 'ToggleHeader') {
    if (state.includes(action.payload)) {
      return state.filter((x) => x !== action.payload);
    } else {
      return [...state, action.payload];
    }
  }
  return state;
};

export function App() {
  const [pills, setPills] = React.useState(initialState);

  const [headers, dispatch] = React.useReducer(reducer, []);
  const toggleHeader = (id: string) => {
    dispatch({
      type: 'ToggleHeader',
      payload: id,
    });
  };

  const shufflePills = () => {
    const newPills = [...pills];
    // shuffle the array
    newPills.sort(() => 0.5 - Math.random());
    setPills(newPills);
  };

  return (
    <>
      <button onClick={shufflePills}>Shuffle pills</button>
      <Pills pills={pills} headers={headers} toggleHeader={toggleHeader} />
    </>
  );
}
