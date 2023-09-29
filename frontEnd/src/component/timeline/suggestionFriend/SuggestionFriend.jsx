import { Link } from "react-router-dom";
import "./suggestionFriend.css";
function SuggestionFriend() {
  return (
    <>
      <div className="suggestionFriend">
        <div className="suggestionFriend-user">
          <img
            className="suggestionFriend-user-img"
            src="https://i.pinimg.com/564x/b3/b4/45/b3b445c55403788a3cb6abcfd047eb36.jpg"
            alt=""
          />
          <div className="suggestionFriend-title">
            <span className="suggestionFriend-title-name">name</span>
            <span>title</span>
          </div>
        </div>
        <span>Add</span>
      </div>
      <div className="suggestionFriend">
        <div className="suggestionFriend-user">
          <img
            className="suggestionFriend-user-img"
            src="https://i.pinimg.com/564x/b3/b4/45/b3b445c55403788a3cb6abcfd047eb36.jpg"
            alt=""
          />
          <div className="suggestionFriend-title">
            <span className="suggestionFriend-title-name">vippro123</span>
            <span>title</span>
          </div>
        </div>
        <span>Add</span>
      </div>
    </>
  );
}

export default SuggestionFriend;
