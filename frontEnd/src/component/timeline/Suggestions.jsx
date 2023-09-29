import SuggestionFriend from "./suggestionFriend/SuggestionFriend";
import "./suggestions.css";

function Suggestions() {
  return (
    <div className="suggestions">
      <div className="suggestions-user">
        <img
          className="suggestions-user-img"
          src="https://i.pinimg.com/564x/b3/b4/45/b3b445c55403788a3cb6abcfd047eb36.jpg"
          alt=""
        />
        <div className="suggestions-title">
          <span className="suggestions-title-name">name</span>
          <span>title</span>
        </div>
      </div>

      <div className="suggestions-friend">
        <div className="suggestions-friend-title">
          <p> Gợi ý cho bạn</p>
          <p>All</p>
        </div>

        <SuggestionFriend />
      </div>
    </div>
  );
}

export default Suggestions;
