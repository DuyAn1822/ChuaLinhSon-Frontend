export const Role = Object.freeze({
  ROLE_ADMIN: "Admin",
  ROLE_THUKY: "Thư ký",
  ROLE_THUQUY: "Thủ quỹ",
  ROLE_DOANTRUONG: "Đoàn trưởng",
  ROLE_DOANTRUONG_OANHVUNAM: "Đoàn trưởng Oanh Vũ Nam",
  ROLE_DOANTRUONG_OANHVUNU: "Đoàn trưởng Oanh Vũ Nữ",
  ROLE_DOANTRUONG_THIEUNAM: "Đoàn trưởng Thiếu Nam",
  ROLE_DOANTRUONG_THIEUNU: "Đoàn trưởng Thiếu Nữ",
  ROLE_DOANTRUONG_NGANHTHANH: "Đoàn trưởng Ngành Thanh"
});

export function replaceRole(role, initRole) {
  var keys = Object.keys(role);
  return initRole.map(item => {
    const matchIndex = keys.indexOf(item);
    return matchIndex !== -1 ? role[keys[matchIndex]] : item;
  });
}

export const authorize = (require, state) => {
  return true;
  if (!state || !require) return false;
  for (let role of state) {
    if (role === Role.ROLE_ADMIN) return true;
  }
  return state.some(element => require.includes(element));
}