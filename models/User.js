// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    haslo: { type: String, required: true },
    nazwaUzytkownika: { type: String, required: true },
    miasto: { type: String, required: true },
    kodPocztowy: { type: String, required: true },
    adres: { type: String, required: true },
    telefon: { type: String, required: true },
    dataRejestracji: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);