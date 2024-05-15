const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const {
    getContacts,
    createContacts,
    updateContacts,
    getContact,
    deleteContacts,
} = require('../controllers/contactController')
const validateToken = require('../middlewares/validateToken')

router.use(validateToken)

//Get Contacts Route
router.get('/', asyncHandler(getContacts))
//Create Contact Route
router.post('/', asyncHandler(createContacts))
//Show Contact Route
router.get('/:id', asyncHandler(getContact))
//Update Contact Route
router.put('/:id', asyncHandler(updateContacts))
//Delete Contact Route
router.delete('/:id', asyncHandler(deleteContacts))

module.exports = router
