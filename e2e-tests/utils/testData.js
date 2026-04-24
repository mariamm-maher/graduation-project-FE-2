const timestamp = Date.now();

module.exports = {
  invalidLogin: {
    email: `invalid_${timestamp}@example.com`,
    password: 'WrongPassword123!'
  },
  invalidEmail: 'not-an-email',
  validPasswordShape: 'ValidPass123!'
};
