import * as request from "../utils/request";
// list comment
const fetchComments = async (postid, page) => {
  try {
    const res = await request.get(`post/lisComents/${postid}/${page}`);
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};
// xóa comment
const delComments = async (postid) => {
  try {
    const res = await request.post(`post/deleteCommentPost`, {
      commentID: postid,
    });
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};
// ban or k ban
const banComments = async (postid) => {
  try {
    const res = await request.post(`post/banComment`, {
      commentID: postid,
    });
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export { fetchComments, delComments, banComments };
