import { useState, useEffect } from "react";
import { toast } from "sonner";
import request from "../../utils/request";

function InviteGroup(groupId) {
  const groupID = groupId.groupId;
  const [InviteLinkGroup, setInviteLinkGroup] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(InviteLinkGroup);
    toast.success("Copied");
    setIsCopied(true);
  };
  const getInvitationCode = async () => {
    try {
      const res = await request.get(`groups/invitationCode/${groupID}`);
      const fullInviteLink = `${request.defaults.appURL}invite/${res.data}`;
      setInviteLinkGroup(fullInviteLink);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getInvitationCode();
  }, []);
  return (
    <>
      <div className="InviteGroupContainer">
        <div className="InviteGroupText">
          <span>Gửi đường dẫn tới bạn bè của bạn</span>
        </div>
        <div className="InviteGroupBox">
          <input value={InviteLinkGroup} />
          <button onClick={handleCopyLink} disabled={isCopied}>
            {!isCopied ? "Copy" : "Copied"}
          </button>
        </div>
      </div>
    </>
  );
}
export default InviteGroup;
