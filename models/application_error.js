var util = require('util');

var AbstractError = function (msg, constr) {
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'Error';
}
util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'Abstract Error';

var UsernameTakenError = function (msg) {
  UsernameTakenError.super_.call(this, msg, this.constructor);
}
util.inherits(UsernameTakenError, AbstractError);
UsernameTakenError.prototype.message = 'Participant Error - Username already taken';

var AlreadyRegisteredError = function (msg) {
  AlreadyRegisteredError.super_.call(this, msg, this.constructor);
}
util.inherits(AlreadyRegisteredError, AbstractError);
AlreadyRegisteredError.prototype.message = 'Participant Error - already registered';

var InvalidPinError = function (msg) {
  InvalidPinError.super_.call(this, msg, this.constructor);
}
util.inherits(InvalidPinError, AbstractError);
InvalidPinError.prototype.message = 'Participant Error - Invalid PIN';

module.exports = {
  UsernameTaken: UsernameTakenError,
  AlreadyRegistered: AlreadyRegisteredError,
  InvalidPin: InvalidPinError
}