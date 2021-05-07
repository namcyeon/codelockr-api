const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Folder = require('../models/Folder')
const { auth } = require('./authController');
const Snippet = require('../models/Snippet');


// SHOW ROUTES

// GET userdata for dashboard
router.get('/:username', auth, (req, res) => {
	const userQuery = User.findOne({ username: req.params.username }).select('-password').populate('folders')
	userQuery.exec((err, foundUser) => {
		if (err) res.status(400).json({ msg: err.message })
		else res.status(200).json(foundUser)
	})
})

// CREATE ROUTES
// Add a folder to a user
router.post('/:username/addfolder', auth, async (req, res) => {
	try {
		const newFolder = await Folder.create(req.body)
		const updatedUser = await User.findByIdAndUpdate(newFolder.owner, {
			$push: {
				folders: [newFolder._id]
			}
		})
		res.status(200).json(updatedUser)

	} catch (err) {
		res.status(400).json({ msg: err.message })
	}
})

// Add a Snippet
router.post('/:username/addsnippet', async (req, res) => {
	try {
		const newSnippet = await Snippet.create(req.body)
		const foundUser = await User.findById(newSnippet.owner)
		console.log(foundUser.folders)
		res.status(200).json(foundUser)
	} catch (error) {
		res.status(400).json({ msg: error.message })
	}
})

// EDIT ROUTES

// DELETE ROUTES

module.exports = router