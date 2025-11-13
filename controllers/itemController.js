const user = require("../models/user");

const getItems = async (req, res) => {
	const { username } = req.body;
	try {
		const result = await user.findOne({ username });
		console.log("send" + result);
		return res.send({ status: 200, data: result.items });
	} catch (err) {
		console.log("error: " + err);
		res.send({ ststus: 500, err });
	}
};

const addItem = async (req, res) => {
	const { username, task } = req.body;
	const entity = await user.findOne({ username });
	console.log(entity);

	if (!entity) {
		return res.send({ status: 404, msg: "User Not Found" });
	} else {
		try {
			const result = await user.updateOne(
				{ username: username },
				{ $push: { items: { task, done: false } } }
			);
			if (result.modifiedCount > 0) {
				return res.send({ staus: 200, msg: "item added successfully" });
			} else {
				return res.send({ staus: 304, msg: "item not added" });
			}
		} catch (err) {
			console.log("error: " + err);
			return res.send({ ststus: 500, err });
		}
	}
};

const removeItem = async (req, res) => {
	const { username, task } = req.body;
	try {
		const result = await user.updateOne(
			{ username: username },
			{ $pull: { items: { task: task } } }
		);
		if (result.modifiedCount > 0) {
			res.send({ staus: 200, msg: "item removed successfully" });
		} else {
			res.send({ staus: 304, msg: "item not removed" });
		}
	} catch (err) {
		console.log("error: " + err);
		res.send({ ststus: 500, err });
	}
};

const markItem = async (req, res) => {
	const { username, task } = req.body;
	try {
		const result = await user.updateOne(
			{ username: username, "items.task": task },
			{ $set: { "items.$.done": true } }
		);
		console.log(result);

		if (result.modifiedCount > 0) {
			res.send({ staus: 200, msg: "item done successfully" });
		} else {
			res.send({ staus: 304, msg: "item not done" });
		}
	} catch (err) {
		console.log("error: " + err);
		res.send({ ststus: 500, err });
	}
};

module.exports = { addItem, removeItem, getItems, markItem };
