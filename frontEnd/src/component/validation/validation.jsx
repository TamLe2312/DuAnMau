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

  return error;
};

export default Validation;
