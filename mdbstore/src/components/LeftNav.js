import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchByCategory } from "../redux/searchSlice";

export default function LeftNav() {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.search.categories);

  const handleCategoryClick = async (category) => {
    dispatch(fetchByCategory(category));
  }

  return (
    <Fragment>
      <ul className="list-group">
        {categories.map((c, index) => {
          return (
            <li key={`li${index}`} onClick={() => handleCategoryClick(c._id)} className="categ-filter list-group-item d-flex justify-content-between align-items-center">
              {c._id}
              <span className="badge bg-dark-green rounded-pill">{c.count}</span>
            </li>
          )
        })}
      </ul>
    </Fragment>
  )
}