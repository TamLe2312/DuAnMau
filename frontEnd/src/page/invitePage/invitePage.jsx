import Logo from "../../../uploads/Logo1.png";
import video from "../../../public/video/bg2.mp4";
import "./invitePage.css";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import request from "../../utils/request";
import { toast } from "sonner";

function InvitePage() {
  const Navigate = useNavigate();
  const invitationCode = useParams();
  const [cookies] = useCookies();
  const idUser = cookies.userId;
  const [loading, setLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [inviteDataGroup, setInviteDataGroup] = useState([]);
  const handleAcceptInvitation = async () => {
    setLoading(true);
    if (!idUser) {
      setIsLogged(false);
      toast.error("Bạn chưa đăng nhập");
      Navigate("/", { replace: true });
    }
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
        if (response.data.length > 0) {
          setInviteDataGroup(response.data);
        } else {
          setInviteDataGroup([]);
        }
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
                {inviteDataGroup.length > 0 ? (
                  <div className="invitePageContainer">
                    <Link to={`/home/community/group/${inviteDataGroup[0].id}`}>
                      <div className="invitePageImgBox">
                        <img
                          className="invitePageImg"
                          src={inviteDataGroup[0].avatarGroup}
                        />
                      </div>
                    </Link>
                    <Link to={`/home/community/group/${inviteDataGroup[0].id}`}>
                      <h3>{inviteDataGroup[0].name}</h3>
                    </Link>
                    <span>
                      <b>{inviteDataGroup[0].memberCount}</b> thành viên
                    </span>
                  </div>
                ) : (
                  <div className="SomethingWentWrong">
                    <i className="fa-solid fa-poo"></i>
                    &nbsp;
                    <span>Có lỗi xảy ra.Vui lòng kiểm tra lại đường dẫn</span>
                  </div>
                )}
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
              disabled={loading || joinSuccess || inviteDataGroup.length < 1}
            >
              {inviteDataGroup.length > 0 ? (
                joinSuccess ? (
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
                )
              ) : (
                <>
                  <span>Xảy ra lỗi</span>
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
