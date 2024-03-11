export const up = async (queryInterface, Sequelize) => {
	await queryInterface.createTable('users', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		first_name: {
			type: Sequelize.STRING,
		},
		last_name: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
		},
		created_at: {
			allowNull: false,
			type: Sequelize.DATE,
		},
		updated_at: {
			allowNull: false,
			type: Sequelize.DATE,
		},
	});
};
// eslint-disable-next-line no-unused-vars
export const down = async (queryInterface, Sequelize) => {
	await queryInterface.dropTable('users');
};
