import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchTerm : ""
}

 const searchSlice = createSlice({
    name: "searchTerm",
    initialState,
    reducers: {
        getSearchTerm : (state, action) => {
            console.log(action.payload)
            state.searchTerm = action.payload
        }
    }  
})

export const {
    getSearchTerm
} = searchSlice.actions

export default searchSlice.reducer;