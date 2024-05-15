const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const Contact = require('../models/contactModel.js')

//Get Contacts Route
const getContacts = async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id })
    res.status(201).json(contacts)
}

//Create Contact Route
const createContacts = async (req, res) => {
    const { name, email, phone } = req.body
    if (!name || !email || !phone) {
        res.status(404)
        throw new Error('Not found')
    }
    const newContact = await Contact.create({
        name: name,
        email: email,
        phone: phone,
        user_id: req.user.id,
    })
    console.log(newContact)
    res.status(201).json(newContact)
}

//Update Contact Route
const updateContacts = async (req, res) => {
    let { id } = req.params
    let updatedContactId = await Contact.findById(req.params.id)
    if (updatedContactId.user_id.toString() !== req.user.id) {
        res.status(403)
        throw new Error("You have no permission to change other user's contact")
    }
    let { name: name, email: email, phone: phone } = req.body
    let contact = await Contact.findByIdAndUpdate(
        id,
        {
            name: name,
            email: email,
            phone: phone,
        },
        {
            runValidators: true,
            new: true,
        },
    )
    if (!contact) {
        res.status(404).json({
            error: 'Contact not Found',
        })
        // throw new Error("Contact Not Found");
    }

    res.status(201).json(contact)
}

//Show Contact Route
const getContact = async (req, res) => {
    let { id } = req.params
    let contact = await Contact.findById(id)
    if (!contact) {
        res.status(404).json({
            error: 'Contact not Found',
        })
        // throw new Error("Contact Not Found");
    }
    res.status(201).json(contact)
}

//Delete Contact Route
const deleteContacts = async (req, res) => {
    let { id } = req.params
    let updatedContactId = await Contact.findById(req.params.id)
    if (updatedContactId.user_id.toString() !== req.user.id) {
        res.status(403)
        throw new Error("You have no permission to change other user's contact")
    }
    let contact = await Contact.findByIdAndDelete(id)
    if (!contact) {
        res.status(404).json({
            error: 'Contact not Found',
        })
        // throw new Error("Contact Not Found");
    }
    res.status(201).json(contact)
}

module.exports = {
    getContacts,
    createContacts,
    updateContacts,
    getContact,
    deleteContacts,
}
