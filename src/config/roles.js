const allRoles = {
  user: ["getDiscussions"],
  admin: ["getDiscussions", "manageDiscussions"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
