const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

const validatePassword = (password) => {
	return password && password.length >= 6;
};

const validateLoginInput = (userEmail, userPassword) => {
	if (!userEmail || !userPassword) {
		return { valid: false, message: "Email and password are required" };
	}
	if (!validateEmail(userEmail)) {
		return { valid: false, message: "Invalid email format" };
	}
	return { valid: true };
};

const validateSignUpInput = (userEmail, userPassword, userName, userAge) => {
	if (!userEmail || !userPassword || !userName || !userAge) {
		return { valid: false, message: "All fields are required" };
	}
	if (!validateEmail(userEmail)) {
		return { valid: false, message: "Invalid email format" };
	}
	if (!validatePassword(userPassword)) {
		return { valid: false, message: "Password must be at least 6 characters" };
	}
	if (userAge < 13) {
		return { valid: false, message: "User must be at least 13 years old" };
	}
	return { valid: true };
};

module.exports = {
	validateEmail,
	validatePassword,
	validateLoginInput,
	validateSignUpInput,
};
