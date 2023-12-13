import * as request from "../utils/request";
// create data theme
const themeMes = async (userone, usertwo) => {
  try {
    const res = await request.get(
      `messenger/thememessage/${userone}/${usertwo}`
    );
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

const createThemeMes = async (userone, usertwo) => {
  try {
    const res = await request.post(`messenger/creatThemeMessage`, {
      userone: userone,
      usertwo: usertwo,
    });
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};
const updateThemeMes = async (idtheme, theme, colorreceiver, colorsender) => {
  try {
    const res = await request.post(`messenger/updateThemeMessage`, {
      idtheme: idtheme,
      theme: theme,
      colorreceiver: colorreceiver,
      colorsender: colorsender,
    });
    if (res) {
      return res.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export { createThemeMes, themeMes, updateThemeMes };
