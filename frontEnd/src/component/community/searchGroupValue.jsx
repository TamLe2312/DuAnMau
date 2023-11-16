import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as request from "../../utils/request";
import moment from "moment";
function SearchGroupValue(props) {
  const [hasJoined, setHasJoined] = useState(props.hasJoined);
  const [groupsSearch, setGroupsSearch] = useState([]);
  const fetchDataJoined = async () => {
    try {
      const response = await request.get(
        `groups/getDataGroupJoined/${props.idUser}`
      );
      if (response && response.data) {
        setHasJoined(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setHasJoined([]);
      }
    }
  };
  const handleJoinGroup = async (groupId) => {
    try {
      const response = await request.post("groups/joinGroup", {
        groupId: groupId,
        idUser: props.idUser,
      });
      if (response.data.success) {
        toast.success(response.data.success);
        fetchDataJoined();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleOutGroup = async (groupId) => {
    try {
      const response = await request.post(`groups/outGroup`, {
        groupId: groupId,
        idUser: props.idUser,
      });
      if (response.data.success) {
        toast.success(response.data.success);
        fetchDataJoined();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (props.searchValue) {
          const response = await request.post("groups/searchGroup", {
            searchValue: props.searchValue,
          });
          if (response && response.data) {
            const formattedData = response.data.map((item) => {
              const createdAt = item.created_at;
              const formattedDate = moment(createdAt).format("MMMM Do, YYYY");
              return {
                ...item,
                created_at: formattedDate,
              };
            });
            setGroupsSearch(formattedData);
          }
        }
      } catch (error) {
        setGroupsSearch([]);
      }
    };
    fetchData();
  }, [props.searchValue]);
  return (
    <>
      {groupsSearch.length !== 0 ? (
        groupsSearch.map((group, index) => {
          let hasJoinedGroup = false;

          if (hasJoined && hasJoined.length > 0) {
            for (let i = 0; i < hasJoined.length; i++) {
              if (
                hasJoined[i].group_id === group.id &&
                props.idUser === hasJoined[i].user_id
              ) {
                hasJoinedGroup = true;
                break;
              }
            }
          }
          return (
            <div className="container CommunityGroupRow" key={index}>
              <a href={`/home/community/group/${group.id}`}>
                {!group.avatarGroup ? (
                  <img
                    className="ImgGroupAvatar"
                    src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg"
                    alt="Avatar"
                  />
                ) : (
                  <img
                    className="ImgGroupAvatar"
                    src={group.avatarGroup}
                    alt={group.name}
                  />
                )}
              </a>
              <div className="CommunityInformationGroup">
                <span>
                  <a
                    href={`/home/community/group/${group.id}`}
                    className="CommunityInformationTitle"
                  >
                    {group.name}
                  </a>
                </span>
                <span>Tạo vào {group.created_at}</span>
              </div>
              {hasJoinedGroup ? (
                <div className="CommunityInformationButton">
                  <button onClick={() => handleOutGroup(group.id)}>
                    Đã tham gia
                  </button>
                </div>
              ) : (
                <div className="CommunityInformationButton" key={index}>
                  <button onClick={() => handleJoinGroup(group.id)}>
                    Tham Gia
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>Không có nội dung tìm kiếm...</p>
      )}
    </>
  );
}
export default SearchGroupValue;
