import Logo from "../../../uploads/Logo1.png";
import video from "../../../public/video/bg2.mp4";
import "./invitePage.css";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import request from "../../utils/request";
import { toast } from "sonner";

function InvitePage() {
  const invitationCode = useParams();
  const [cookies] = useCookies(["userId"]);
  const idUser = cookies.userId;
  const [loading, setLoading] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [inviteDataGroup, setInviteDataGroup] = useState([]);
  const handleAcceptInvitation = async () => {
    setLoading(true);
    try {
      const response = await request.post(
        `groups/joinInvitationGroup/${invitationCode.inviteCode}&${idUser}`
      );
      if (response.data.error) {
        toast.error(response.data.error);
      }
      if (response.data.success) {
        setJoinSuccess(true);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get(
          `groups/invite/${invitationCode.inviteCode}&${idUser}`
        );
        console.log(response.data);
        setInviteDataGroup(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="login_big">
        <video src={video} className="login_video" autoPlay loop muted></video>
        <div className="FormUser">
          <div className="FormContainerRoot">
            <div className="TitleLogoContainerForm">
              <Link to="/home">
                <div className="LogoImgContainerForm">
                  <img src={Logo} alt="LogoFPLHub" />
                </div>
              </Link>
            </div>
            {loading ? (
              <div className="LoadingScreen">
                <div
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                ></div>
                &nbsp; <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="invitePageContainer">
                  <Link to={`/home/community/group/${inviteDataGroup.id}`}>
                    <div className="invitePageImgBox">
                      <img
                        className="invitePageImg"
                        src={inviteDataGroup.avatarGroup}
                      />
                    </div>
                  </Link>
                  <Link to={`/home/community/group/${inviteDataGroup.id}`}>
                    <h3>{inviteDataGroup.name}</h3>
                  </Link>
                  <span>
                    <b>{inviteDataGroup.memberCount}</b> thành viên
                  </span>
                </div>
              </>
            )}

            <button
              onClick={handleAcceptInvitation}
              type="submit"
              className={
                joinSuccess
                  ? "btn btn-success buttonFieldFormUser"
                  : "btn btn-primary buttonFieldFormUser"
              }
              disabled={loading || joinSuccess}
            >
              {joinSuccess ? (
                <>
                  {loading && <i className="fa-regular fa-circle-check"></i>}
                  &nbsp; Tham gia thành công
                </>
              ) : (
                <>
                  {loading && (
                    <div
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  &nbsp; Chấp nhận lời mời
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default InvitePage;
