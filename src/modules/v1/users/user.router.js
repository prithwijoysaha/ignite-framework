import express from 'express';
import { findUserById, findUser, createUser, updateUser, patchUser, deleteUser } from './user.controller.js';

const router = express.Router();

router.get('/', async (req, res) => {
	res.return(
		await findUser({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			locals: req.locals,
		}),
	);
});

router.get('/:userId', async (req, res) => {
	res.return(
		await findUserById({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			locals: req.locals,
		}),
	);
});

router.post('/', async (req, res) => {
	res.return(
		await createUser({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			locals: req.locals,
		}),
	);
});

router.put('/:userId', async (req, res) => {
	res.return(
		await updateUser({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			locals: req.locals,
		}),
	);
});

router.patch('/:userId', async (req, res) => {
	res.return(
		await patchUser({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			locals: req.locals,
		}),
	);
});

router.delete('/:userId', async (req, res) => {
	res.return(
		await deleteUser({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			locals: req.locals,
		}),
	);
});

export default router;
