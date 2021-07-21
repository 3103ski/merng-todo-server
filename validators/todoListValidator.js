module.exports.validateTodoList = ({ title, color }) => {
	const errors = {};

	if (title.trim() === ``) {
		errors.title = 'You must enter a name for your list';
	}

	return {
		errors,
		isValid: Object.keys(errors).length === 0,
	};
};
