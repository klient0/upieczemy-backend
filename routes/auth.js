// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ENDPOINT REJESTRACJI
router.post('/rejestracja', async (req, res) => {
    const { email, haslo, nazwaUzytkownika, miasto, kodPocztowy, adres, telefon } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ komunikat: 'Użytkownik z tym adresem e-mail już istnieje.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(haslo, salt);

        user = new User({
            email,
            haslo: hashedPassword,
            nazwaUzytkownika,
            miasto,
            kodPocztowy,
            adres,
            telefon
        });

        await user.save();
        res.status(201).json({ komunikat: 'Użytkownik zarejestrowany pomyślnie!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
});

// ENDPOINT LOGOWANIA
router.post('/logowanie', async (req, res) => {
    const { email, haslo } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ komunikat: 'Nieprawidłowe dane logowania' });
        }

        const isMatch = await bcrypt.compare(haslo, user.haslo);
        if (!isMatch) {
            return res.status(400).json({ komunikat: 'Nieprawidłowe dane logowania' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    uzytkownik: {
                        id: user.id,
                        email: user.email,
                        nazwaUzytkownika: user.nazwaUzytkownika
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
});

module.exports = router;