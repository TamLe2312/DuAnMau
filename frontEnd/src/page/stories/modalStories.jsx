import { useNavigate } from "react-router-dom";
import request from "../../utils/request";
import { toast } from "sonner";

function ModalStories(idNews) {
  const id = idNews.idNews;
  const Navigate = useNavigate();
  const handleDelete = async () => {
    try {
      const res = await request.post("post/storiesDelete", {
        id: id,
      });
      if (res.data.success) {
        toast.success(res.data.success);
        Navigate("/home", { replace: true });
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="ModalStories">
        <h3>Bạn có muốn xóa tin ?</h3>
        <div className="StoriesButtonHandleContainer">
          <button className="btn btn-danger" onClick={handleDelete}>
            Xóa
          </button>
        </div>
      </div>
    </>
  );
}
export default ModalStories;
