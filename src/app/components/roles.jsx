// roles.js
const permissions = {
    guest: ["events"],
    user: ["events", "tickets"],
    admin: ["events", "tickets", "leaderboard"],
  };
  
  export const hasAccess = (role, permission) => {
    return permissions[role]?.includes(permission);
  };
  