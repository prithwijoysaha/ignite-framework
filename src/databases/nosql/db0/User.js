import { v4 as uuidv4 } from 'uuid';

export default (model, Schema) => {
	const UserSchema = new Schema(
		{
			uuid: {
				type: String,
				required: true,
				default: uuidv4(),
				unique: true,
			},
			firstName: {
				type: String,
				required: true,
			},
			lastName: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				nullable: true,
			},
			email: {
				type: String,
				required: true,
			},
			organizationName: {
				type: String,
				required: true,
			},
			organizationPhone: {
				type: String,
				required: true,
			},
			organizationEmail: {
				type: String,
				required: true,
			},
		},
		{
			collection: 'users',
			timestamps: {
				createdAt: true,
				updatedAt: true,
				timezone: 'UTC',
			},
		},
	);
	return model('User', UserSchema);
};
