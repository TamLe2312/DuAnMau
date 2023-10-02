const Validation = (value) => {
  let error = {};
  if (!value.username) {
    error.username = "Không bỏ trống thông tin";
  }

  if (!value.password) {
    error.password = "Không bỏ trống password";
  } else if (value.password.length < 5) {
    error.password = "Mật khẩu trên 5 kí tự";
  }
  if (!value.Cpassword) {
    error.Cpassword = "Không bỏ trống confirm password";
  } else if (value.Cpassword.length < 5) {
    error.Cpassword = "Confirm password phải trên 5 kí tự";
  }
  if (!value.name) {
    error.name = "Không bỏ trống name";
  }
  if (!value.moTa) {
    error.moTa = "Không bỏ trống mô tả";
  }
  if (!value.birthday) {
    error.birthday = "Không bỏ trống ngày sinh nhật";
  }


  return error;
};

export default Validation;
