// API Configuration for NomadQuiz Backend
export const API_CONFIG = {
  baseUrl: 'https://cdserver.nomadsoft.us',
  apiPath: '/api/v1',
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/email/login',
    register: '/auth/email/register',
    googleLogin: '/auth/google/login',
    facebookLogin: '/auth/facebook/login',
    appleLogin: '/auth/apple/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    forgotPassword: '/auth/forgot/password',
    resetPassword: '/auth/reset/password',
    confirmEmail: '/auth/email/confirm',
  },
  schedules: {
    list: '/schedules',
    create: '/schedules',
    publish: '/schedules/:id/publish',
  },
  scheduleShifts: {
    list: '/schedules/:scheduleId/shifts',
    create: '/schedules/:scheduleId/shifts',
    copyPrevious: '/schedules/:scheduleId/shifts/copy-previous',
    bulk: '/schedules/:scheduleId/shifts/bulk',
  },
  employees: {
    list: '/employees/all',
  },
  users: {
    list: '/users',
    employees: '/users/employees/all',
  },
  userShifts: {
    myShifts: '/user-shifts/my-shifts',
  },
  shiftTypes: {
    list: '/shift-types',
    create: '/shift-types',
  },
  friends: {
    list: '/friends',
    sendRequest: '/friends/send-request',
    requests: '/friends/requests',
    acceptRequest: '/friends/requests/:id/accept',
    rejectRequest: '/friends/requests/:id/reject',
  },
  leaderboards: {
    user: '/leaderboards/user/:username',
    leaderboard: '/leaderboards/:id',
    submitScore: '/leaderboards/submit-score',
  },
};
