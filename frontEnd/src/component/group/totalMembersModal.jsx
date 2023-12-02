import { Link, useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useCookies } from "react-cookie";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import request from "../../utils/request";
import { toast } from "sonner";

function TotalMemberModal() {
  const [dataTotalMember, setDataTotalMember] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const refSearch = useRef();
  const groupID = useParams();
  const [cookies] = useCookies(["session"]);
  const userId = cookies.userId;

  const fetchDataTotalMember = async () => {
    const groupId = groupID.groupID;
    try {
      const response = await request.get(
        `groups/getDataTotalMember/${groupId}`
      );
      const updateDataTotalMember = [];
      for (let i = 0; i < response.data.length; i++) {
        const item = response.data[i];
        if (item.id === item.idUserCreatedGroup) {
          updateDataTotalMember.push({ ...item, isWhoCreatedGroup: true });
        } else {
          updateDataTotalMember.push({
            ...item,
            isWhoCreatedGroup: false,
            handleDeteleMember: true,
          });
        }
      }
      setDataTotalMember(updateDataTotalMember);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchDataTotalMember();
  }, [groupID]);
  const handleDeteleMember = async (id) => {
    try {
      const response = await request.post(`groups/kickMember`, {
        groupId: groupID.groupID,
        idUser: id,
      });
      if (response.data.success) {
        toast.success(response.data.success);
        fetchDataTotalMember();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Form>
        <Form.Group
          className="mb-3"
          controlId="exampleForm.ControlInput1"
          style={{ position: "relative" }}
        >
          <Form.Control
            ref={refSearch}
            type="text"
            placeholder="Nhập tên người cần tìm..."
            name="searchValue"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <SearchIcon
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </Form.Group>
      </Form>
      <div className="TotalMemberContainer">
        <div style={{ height: "auto", overflow: "hidden auto" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingBottom: 0,
              paddingTop: 0,
              position: "relative",
            }}
          >
            {dataTotalMember && dataTotalMember.length > 0 ? (
              dataTotalMember.map((dataMember, index) => {
                return (
                  <div className="TotalMemberRowContent" key={index}>
                    <div className="ProfileFollowImgContent">
                      {dataMember.avatar ? (
                        <Link
                          to={`/home/profile/user/${dataMember.id}`}
                          className="ProfileFollowLink"
                        >
                          <img src={dataMember.avatar} />
                        </Link>
                      ) : (
                        <Link
                          to={`/home/profile/user/${dataMember.id}`}
                          className="ProfileFollowLink"
                        >
                          <img src="https://i.pinimg.com/564x/64/b9/dd/64b9dddabbcf4b5fb2b885927b7ede61.jpg" />
                        </Link>
                      )}
                    </div>
                    <span>
                      <Link
                        to={`/home/profile/user/${dataMember.id}`}
                        className="ProfileFollowLink"
                      >
                        {dataMember.name
                          ? dataMember.name
                          : dataMember.username}
                      </Link>
                    </span>
                    {dataMember.isWhoCreatedGroup ? (
                      <span className="TotalMemberRole">Trưởng nhóm</span>
                    ) : (
                      <>
                        {userId === dataMember.idUserCreatedGroup && (
                          <button
                            onClick={() => handleDeteleMember(dataMember.id)}
                          >
                            Xóa
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <span>Không có thành viên nào</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default TotalMemberModal;
