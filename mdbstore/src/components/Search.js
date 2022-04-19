import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchTerm, fetchTextSearch, fetchAutocompleteSuggestions } from "../redux/searchSlice";

export default function Search(props) {
  let [ suggestions, setSuggestions ] = useState([]);
  const searchTerm = useSelector(state => state.search.searchTerm);
  const dispatch = useDispatch();

  const handleSearchButton = async () => {
    dispatch(fetchTextSearch(searchTerm));
  }

  const handleSearchTermChange = (e) => {
    dispatch(updateSearchTerm(e.target.value));
  }

  const handleKeyUp = async (e) => {
    let result = await dispatch(fetchAutocompleteSuggestions(e.target.value));
    setSuggestions(result.payload);
  }

  return (
    <div className="search-bar row justify-content-center">
      <div className="col-10">
        <form className="p-4" onSubmit={e => {e.preventDefault(); handleSearchButton();}}>
          <div className="input-group">
            <input value={searchTerm} onKeyUp={handleKeyUp} onChange={handleSearchTermChange} className="form-control" list="datalistOptions" placeholder="What are you looking for?" />
            <datalist id="datalistOptions">
              {suggestions.map(s => {
                return (
                  <option value={s.name} />
                )
              })}
            </datalist>
            <button type="button" onClick={handleSearchButton} className="btn btn-secondary">Search</button>
          </div>
        </form>
      </div>
    </div>
  )
}