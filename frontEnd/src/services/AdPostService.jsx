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
// img post
// http://localhost:8080/post/postimg/486
const imgsPost = async (postid) => {
  try {
    const res = await request.get(`post/postimg/${postid}`);
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

//localhost:8080/post/countCommentPost/488&0
const countPost = async (postid) => {
  try {
    const res = await request.get(`post/countCommentPost/${postid}&0`);
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};
// flagPost;
const flagPost = async (userID, postID, contentFlag) => {
  try {
    const res = await request.post(`post/flagPost`, {
      userID: userID,
      postID: postID,
      contentFlag: contentFlag,
    });
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};
// /listFlagPost/:postID
const listFlagPost = async (postid) => {
  try {
    const res = await request.get(`post/listFlagPost/${postid}`);
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};
// localhost:8080/post/
const banPost = async (postid) => {
  try {
    const res = await request.post(`post/banPost`, {
      postID: postid,
    });
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};
export {
  fetchComments,
  delComments,
  banComments,
  imgsPost,
  countPost,
  flagPost,
  listFlagPost,
  banPost,
};
