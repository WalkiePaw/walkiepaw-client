import React from 'react';
import { createSlice } from '@reduxjs/toolkit';

const selectedPlacesSlice = createSlice({
  name: 'selectedPlaces',
  initialState: [],
  reducers: {
    setSelectedPlaces: (state, action) => {
      return action.payload;
    },
    addSelectedPlace: (state, action) => {
      if (state.length < 4 && !state.includes(action.payload)) {
        state.push(action.payload);
      }
    },
    removeSelectedPlace: (state, action) => {
      return state.filter(place => place !== action.payload);
    },
    clearSelectedPlaces: () => {
      return [];
    },
  },
});

export const { setSelectedPlaces, addSelectedPlace, removeSelectedPlace, clearSelectedPlaces } = selectedPlacesSlice.actions;
export default selectedPlacesSlice.reducer;

// 이 컴포넌트는 실제로 렌더링되지 않지만, 필요한 경우 사용할 수 있습니다.
const SelectedPlacesSlice = () => {
  return null;
};

export { SelectedPlacesSlice };