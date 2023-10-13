function Account() {
  return (
    <div>
      Tài khoản
      <div></div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên</th>
            <th scope="col">nickname</th>
            <th scope="col">role</th>
            <th scope="col">Quản lí</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>pro1</td>
            <td>user</td>
            <td>
              <button type="button" className="btn btn-primary ">
                Sửa
              </button>
              &nbsp;
              <button type="button" className="btn btn-danger">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Account;
