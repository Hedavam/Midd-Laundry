/*
  UserFormShape.js

  This provides a PropTypes shape descriptor of userForm objects. This is pulled to make it easier
  for components that take UserForm as props.
*/

import PropTypes from "prop-types";

const UserFormShape = PropTypes.shape({
  phoneNumber: PropTypes.number,
  email: PropTypes.string,
  machineId: PropTypes.string,
  duration: PropTypes.number,
  room: PropTypes.string.isRequired, // assumption, wait on Room ppl
});

export default UserFormShape;
