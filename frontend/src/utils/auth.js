export const getRole = () => localStorage.getItem("role");

export const isAdmin = () => getRole() === "admin";
export const isTeacher = () => getRole() === "teacher";
export const isStudent = () => getRole() === "student";

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const getToken = () => localStorage.getItem("token");

export const getUserId = () => localStorage.getItem("userId");

export const isAuthenticated = () => !!getToken();

export const hasRole = (role) => getRole() === role;

export const getDashboardPath = () => {
  const role = getRole();
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "teacher":
      return "/teacher";
    case "student":
      return "/student";
    default:
      return "/login";
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};

export const setAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("role", user.role);
  localStorage.setItem("userId", user.id);
};
