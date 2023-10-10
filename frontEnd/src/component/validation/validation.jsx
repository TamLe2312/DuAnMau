import React from "react";

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
  if (!value.email) {
    error.email = "không được để trống email";
  }
  if (value.email) {
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(value.email)) {
      error.email = "Email không hợp lệ";
    }
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
  if (!value.moTaNhom) {
    error.moTaNhom = "Không bỏ trống mô tả";
  }

  return error;
};

export default Validation;
