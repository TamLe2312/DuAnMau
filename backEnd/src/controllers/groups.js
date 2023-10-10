const connection = require("../config/database");
const path = require("path");
require('dotenv').config();
const Mustache = require("mustache");
const fs = require("fs");
const moment = require("moment");

const createGroup = (req, res) => {
    const { name, moTa, idCreatedGroup } = req.body;
    const fileName = req.file.filename;
    if (!name || !moTa || !fileName) {
        return res.status(400).json({ error: "Vui lòng nhập đủ thông tin" });
    }
    const filePath = "/uploads/" + fileName;
    const baseURL = process.env.APP_URL;
    const imageURL = `${baseURL}${filePath}`;
    connection.query(
        "SELECT * FROM groupsTable WHERE name = ?",
        [name],
        async function (err, results, fields) {
            if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: "Lỗi máy chủ" });
            }
            else {
                connection.query(
                    "INSERT INTO groupsTable (name, moTaNhom, avatarGroup,idUserCreatedGroup) VALUES (?, ?, ?,?)",
                    [name, moTa, imageURL, idCreatedGroup],
                    function (err, results, fields) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: "Lỗi máy chủ 2" });
                        }
                        const groupId = results.insertId;
                        connection.query(
                            "SELECT * FROM groupsTable",
                            async function (err, results, fields) {
                                if (err) {
                                    return res.status(500).json({ error: "Lỗi máy chủ" });
                                }
                                if (results.length > 0) {
                                    connection.query(
                                        "INSERT INTO membergroup (group_id,user_id) VALUES (?, ?)",
                                        [groupId, idCreatedGroup],
                                        async function (err, results, fields) {
                                            if (err) {
                                                return res.status(500).json({ error: "Lỗi máy chủ" });
                                            }
                                        }
                                    );
                                    return res.status(200).json({ results, success: "Tạo nhóm thành công" });
                                } else {
                                    return res.status(400).json({ error: "Lỗi máy chủ" });
                                }
                            }
                        );
                    }
                );
            }
        }
    );
}
const getDataGroup = (req, res) => {
    connection.query(
        "SELECT * FROM groupsTable ORDER BY RAND() LIMIT 10",
        async function (err, results, fields) {
            if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                return res.status(400).json({ error: "Không tồn tại group nào" });
            }
        }
    );
}

const searchGroup = (req, res) => {
    const searchValue = req.body.searchGroup;
    if (!searchValue) {
        connection.query(
            "SELECT * FROM groupsTable ORDER BY RAND() LIMIT 10",
            async function (err, results, fields) {
                if (err) {
                    return res.status(500).json({ error: "Lỗi máy chủ" });
                }
                if (results.length > 0) {
                    return res.status(200).json(results);
                } else {
                    return res.status(400).json({ error: "Group không tồn tại" });
                }
            }
        );
    }
    else {
        connection.query(
            "SELECT * FROM groupsTable WHERE name LIKE CONCAT('%', ?, '%')",
            [searchValue],
            async function (err, results, fields) {
                if (err) {
                    return res.status(500).json({ error: "Lỗi máy chủ" });
                }
                if (results.length > 0) {
                    return res.status(200).json(results);
                } else {
                    return res.status(400).json({ error: "Group không tồn tại" });
                }
            }
        );
    }
}
const getDataGroupProfile = (req, res) => {
    const groupIdProfile = req.params.groupId;
    if (!groupIdProfile) {
        return res.status(400).json({ error: "Không có group ID" });
    }
    connection.query(
        "SELECT * FROM groupsTable WHERE id = ?",
        [groupIdProfile],
        async function (err, results, fields) {
            if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                return res.status(400).json({ error: "Group không tồn tại" });
            }
        }
    );
}
const changeAvatarGroup = (req, res) => {
    const { hasAvatarGroup, groupId } = req.body;
    const fileName = req.file.filename;
    const filePath = "/uploads/" + fileName;
    const baseURL = "http://localhost:5173/";
    const imageURL = `${baseURL.slice(0, -1)}${filePath}`;
    const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
    const filePathOldAvatar = path.join(uploadDir, hasAvatarGroup);
    connection.query(
        "UPDATE groupsTable SET avatarGroup = ? WHERE id = ?",
        [imageURL, groupId],
        function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            if (fs.existsSync(filePathOldAvatar)) {
                // Xóa tệp tin cũ
                try {
                    fs.unlinkSync(filePathOldAvatar);
                } catch (error) {
                    return res.status(500).json({ error: "Lỗi khi cập nhật avatar" });
                }
            }
            return res.status(200).json({
                success: "Cập nhật avatar thành công",
                avatarGroup: imageURL,
                fileName: fileName,
                filePath: filePath,
                id: groupId,
            });
        }
    );
}
const removeAvatarGroup = (req, res) => {
    const { imagePath, groupIdProfile } = req.body;
    const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
    const filePath = path.join(uploadDir, imagePath);
    connection.query(
        "UPDATE groupsTable SET avatarGroup = NULL WHERE id = ?",
        [groupIdProfile],
        async function (err, results, fields) {
            if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            // Kiểm tra xem tệp tin có tồn tại hay không
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // Tệp tin không tồn tại, trả về lỗi hoặc thông báo không tìm thấy tệp tin
                    return res.status(404).json({ error: "Tệp tin không tồn tại" });
                }
                // Xóa tệp tin
                fs.unlink(filePath, (error) => {
                    if (error) {
                        // Lỗi khi xóa tệp tin, trả về lỗi hoặc thông báo lỗi xóa tệp tin
                        return res.status(500).json({ error: "Lỗi khi xóa tệp tin" });
                    }

                    // Xóa thành công, trả về thông báo thành công hoặc mã thành công
                    return res.status(200).json({ success: "Xóa ảnh thành công" });
                });
            });
        }
    );
}
const UpdateInformationProfileGroup = (req, res) => {
    const { name, moTaNhom, groupId } = req.body;
    if (!name || !moTaNhom) {
        return res.status(400).json({ error: "Vui lòng nhập đủ thông tin" });
    }
    connection.query(
        "UPDATE groupsTable SET name = ?,moTaNhom = ? WHERE id = ?",
        [name, moTaNhom, groupId],
        function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            return res.status(200).json({
                name: name,
                moTaNhom: moTaNhom,
                success: "Cập nhật thông tin thành công",
            });
        }
    );
}
const removeGroup = (req, res) => {
    const { hasAvatarGroup, groupIdProfile } = req.body;
    const uploadDir = path.join(__dirname, "../../../frontEnd/uploads");
    const filePath = path.join(uploadDir, hasAvatarGroup);
    connection.query(
        "DELETE FROM groupstable WHERE id = ?",
        [groupIdProfile],
        function (err, results, fields) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // Tệp tin không tồn tại, trả về lỗi hoặc thông báo không tìm thấy tệp tin
                    return res.status(404).json({ error: "Tệp tin không tồn tại" });
                }
                // Xóa tệp tin
                fs.unlink(filePath, (error) => {
                    if (error) {
                        // Lỗi khi xóa tệp tin, trả về lỗi hoặc thông báo lỗi xóa tệp tin
                        return res.status(500).json({ error: "Lỗi khi xóa tệp tin" });
                    }
                });
            });
            return res.status(200).json({ success: "Xóa group thành công" });
        }
    );
}
const getDataGroupJoined = (req, res) => {
    connection.query(
        "SELECT * FROM membergroup",
        async function (err, results, fields) {
            if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                return res.status(400).json({ error: "Không có dữ liệu Member Group" });
            }
        }
    );
}
const joinGroup = (req, res) => {
    const { groupId, idUser } = req.body;
    connection.query(
        "INSERT INTO membergroup (group_id,user_id) VALUES (?,?)",
        [groupId, idUser],
        async function (err, results, fields) {
            if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            return res.status(200).json({ success: "Tham gia nhóm thành công" });
        }
    );
}
const outGroup = (req, res) => {
    const { groupId, idUser } = req.body;
    connection.query(
        "SELECT * FROM groupstable WHERE id = ?",
        [groupId],
        async function (err, results, fields) {
            if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            if (results.length > 0) {
                if (results[0].idUserCreatedGroup === idUser) {
                    return res.status(400).json({ error: "Bạn là admin không thể rời nhóm" });
                }
                else {
                    connection.query(
                        "DELETE FROM membergroup WHERE group_id = ? AND user_id = ?",
                        [groupId, idUser],
                        async function (err, results, fields) {
                            if (err) {
                                return res.status(500).json({ error: "Lỗi máy chủ" });
                            }
                            return res.status(200).json({ success: "Rời nhóm thành công" });
                        }
                    );
                }
            } else {
                return res.status(400).json({ error: "Group không tồn tại" });
            }
        }
    );
}
const TotalMembers = (req, res) => {
    const groupId = req.params.groupId;
    connection.query(
        "SELECT COUNT(*) as totalMembers FROM membergroup WHERE group_id = ?",
        [groupId],
        async function (err, results, fields) {
            if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                return res.status(400).json({ error: "Nhóm không tồn tại" });
            }
        }
    );
}

module.exports = {
    createGroup,
    getDataGroup,
    searchGroup,
    getDataGroupProfile,
    changeAvatarGroup,
    removeAvatarGroup,
    UpdateInformationProfileGroup,
    removeGroup,
    getDataGroupJoined,
    joinGroup,
    TotalMembers,
    outGroup,
};
