// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Połączono z MongoDB...'))
    .catch(err => console.error('Nie można połączyć z MongoDB...', err));

// Definicja tras (routes)
app.use('/api/auth', require('./routes/auth'));

// --- NOWA TRASA DLA WYSZUKIWARKI MIAST ---
app.get('/api/suggestions', (req, res) => {
    const query = req.query.q || '';

    // Zamiast jednej dużej listy, tworzymy alfabetyczne "pakiety"
    // Pamiętaj, żeby w JS używać // do komentarzy, a nie #
    const miastaA_C = [
        // A
        'Albatyniec', 'Aleksandrów Kujawski', 'Aleksandrów Łódzki', 'Alwernia',
        'Andrychów', 'Annopol', 'Antoniowo', 'Augustów',
        // B
        'Babimost', 'Bachorzew', 'Baborów', 'Bądkowo', 'Bardo', 'Barcin', 'Barlinek',
        'Barczewo', 'Bartoszyce', 'Barwice', 'Bełchatów', 'Bełżyce', 'Będzin',
        'Biała', 'Biała Podlaska', 'Biała Piska', 'Białaczów', 'Białobrzegi',
        'Białogard', 'Biały Bór', 'Białystok', 'Biecz', 'Bielawa', 'Bielsk Podlaski',
        'Bielsko-Biała', 'Bieruń', 'Bierutów', 'Bieżuń', 'Biłgoraj', 'Bircza',
        'Biskupiec', 'Bisztynek', 'Blachownia', 'Błaszki', 'Błażowa', 'Błonie',
        'Bobrek', 'Bobolice', 'Bobowa', 'Bobrowniki', 'Bochnia', 'Bodzanów',
        'Bodzentyn', 'Bogaczewo', 'Bogdanka', 'Bogdaniec', 'Bogoria',
        'Bogatynia', 'Boguchwała', 'Boguszów-Gorce', 'Bojanowo', 'Bolesławiec',
        'Bolimów', 'Bolków', 'Borek Wielkopolski', 'Bornem Sulinowo', 'Borne Sulinowo',
        'Braniewo', 'Brańsk', 'Bratoszewice', 'Brzeziny', 'Brzeg', 'Brzeg Dolny',
        'Brzesko', 'Brzeszcze', 'Brześć Kujawski', 'Brusy', 'Brwinów', 'Buczek',
        'Buk', 'Bukowno', 'Busko-Zdrój', 'Bychawa', 'Byczyna', 'Bydgoszcz',
        'Bystrzyca Kłodzka', 'Bytów', 'Bytom', 'Bytom Odrzański',
        // C
        'Cegłów', 'Chełm', 'Chełmek', 'Chełmno', 'Chełmża', 'Chęciny', 'Chmielnik',
        'Chocianów', 'Chociwel', 'Chodecz', 'Chodzież', 'Chojna', 'Chojnice',
        'Chojnów', 'Choroszcz', 'Chorzów', 'Choszczno', 'Chrzanów', 'Ciechanowiec',
        'Ciechanów', 'Ciechocinek', 'Cieszanów', 'Cieszyn', 'Ciężkowice', 'Cybinka',
        'Czaplinek', 'Czarna Białostocka', 'Czarna Woda', 'Czarne', 'Czarnków',
        'Czarny Dunajec', 'Czechowice-Dziedzice', 'Czeladź', 'Czempiń',
        'Czerniejewo', 'Czersk', 'Czerwieńsk', 'Czerwińsk nad Wisłą',
        'Czerwionka-Leszczyny', 'Częstochowa', 'Człopa', 'Człuchów', 'Czyżew'
    ];

    const miastaD_F = [
        // D
        'Daleszyce', 'Darłowo', 'Dąbie', 'Dąbrowa Białostocka', 'Dąbrowa Górnicza',
        'Dąbrowa Tarnowska', 'Dąbrowice', 'Debrzno', 'Dębica', 'Dęblin', 'Dębno',
        'Dobczyce', 'Dobiegniew', 'Dobra (Łobez County)', 'Dobra (Turek County)',
        'Dobre', 'Dobre Miasto', 'Dobrodzień', 'Dobrzany', 'Dobrzyca', 'Dobrzyń nad Wisłą',
        'Dolsk', 'Drawno', 'Drawsko Pomorskie', 'Drezdenko', 'Drobin', 'Drohiczyn',
        'Drzewica', 'Dubiecko', 'Dukla', 'Duszniki-Zdrój', 'Dynów', 'Działdowo',
        'Działoszyce', 'Działoszyn', 'Dzierzgoń', 'Dzierżoniów', 'Dziwnów',
        // E
        'Elbląg', 'Ełk',
        // F
        'Frampol', 'Frombork'
    ];

    // Dodałem pustą listę dla miast G-Z, aby kod działał. Możesz ją uzupełnić w przyszłości.
    const miastaG_J = [
    'Garwolin', 'Gąbin', 'Gdańsk', 'Gdynia', 'Giżycko', 'Glinojeck',
    'Gliwice', 'Głogów', 'Głogów Małopolski', 'Głowno', 'Głubczyce',
    'Głuchołazy', 'Głuszyca', 'Gniew', 'Gniewkowo', 'Gniezno',
    'Gogolin', 'Golczewo', 'Goleniów', 'Golina', 'Golub-Dobrzyń',
    'Gołańcz', 'Gołdap', 'Goniądz', 'Góra', 'Góra Kalwaria',
    'Górowo Iławeckie', 'Gorzów Śląski', 'Gorzów Wielkopolski',
    'Gostynin', 'Gostyń', 'Gościno', 'Gozdnica', 'Grabów nad Prosną',
    'Grajewo', 'Grodków', 'Grodzisk Mazowiecki', 'Grodzisk Wielkopolski',
    'Grójec', 'Grudziądz', 'Grybów', 'Gryfice', 'Gryfino',

    // H
    'Hel', 'Hrubieszów',

    // J
    'Janikowo', 'Janowiec Wielkopolski', 'Janów Lubelski',
    'Jaraczewo', 'Jarocin', 'Jarosław', 'Jasło', 'Jastarnia',
    'Jastrowie', 'Jedlicze', 'Jedlina-Zdrój', 'Jedwabne',
    'Jelcz-Laskowice', 'Jelenia Góra', 'Jeziorany', 'Jędrzejów',
    'Jordanów', 'Józefów', 'Jutrosin'
    ];

    const miastaK_M = [
    'Kalisz', 'Kalwaria Zebrzydowska', 'Kałuszyn', 'Kamień Krajeński',
    'Kamień Pomorski', 'Kamienna Góra', 'Karpacz', 'Kartuzy',
    'Katowice', 'Kazimierz Dolny', 'Kazimierza Wielka',
    'Kąty Wrocławskie', 'Kcynia', 'Kędzierzyn-Koźle', 'Kępice',
    'Kępno', 'Kętrzyn', 'Kęty', 'Kielce', 'Kietrz',
    'Kisielice', 'Kleczew', 'Kleszczele', 'Kluczbork',
    'Knurów', 'Kolbuszowa', 'Kolno', 'Koniecpol',
    'Konin', 'Konstancin-Jeziorna', 'Konstantynów Łódzki',
    'Końskie', 'Koprzywnica', 'Korfantów', 'Koronowo',
    'Korsze', 'Kosów Lacki', 'Kostrzyn', 'Kostrzyn nad Odrą',
    'Koszalin', 'Koziegłowy', 'Kozienice', 'Koźmin Wielkopolski',
    'Kożuchów', 'Kórnik', 'Kraków', 'Krapkowice',
    'Krasnobród', 'Krasnystaw', 'Kraśnik', 'Krobia',
    'Krosno', 'Krosno Odrzańskie', 'Krynki', 'Krynica-Zdrój',
    'Krzeszowice', 'Krzywiń', 'Krzyż Wielkopolski',
    'Książ Wielkopolski', 'Kudowa-Zdrój', 'Kunów',
    'Kutno', 'Kuźnia Raciborska',

    // L
    'Legionowo', 'Legnica', 'Lesko', 'Leszno', 'Leśna',
    'Leśnica', 'Lewin Brzeski', 'Lębork', 'Lędziny',
    'Libiąż', 'Lidzbark', 'Lidzbark Warmiński',
    'Lipiany', 'Lipno', 'Lipsk', 'Lipsko',
    'Lubaczów', 'Lubartów', 'Lubawa', 'Lubień Kujawski',
    'Lubin', 'Lublin', 'Lubliniec', 'Lubniewice',
    'Lubomierz', 'Luboń', 'Lubraniec', 'Lubsko',
    'Lwówek', 'Lwówek Śląski', 'Łabiszyn', 'Łańcut',
    'Łapy', 'Łask', 'Łasin', 'Łaziska Górne',
    'Łazy', 'Łeba', 'Łęczna', 'Łęknica',
    'Łobez', 'Łochów', 'Łomianki', 'Łomża',
    'Łowicz', 'Łuków', 'Łysomice',

    // M
    'Maków Mazowiecki', 'Maków Podhalański', 'Malbork',
    'Małogoszcz', 'Margonin', 'Marki', 'Maszewo',
    'Miasteczko Śląskie', 'Miastko', 'Miechów',
    'Mielec', 'Mieroszów', 'Mieszkowice',
    'Międzybórz', 'Międzychód', 'Międzylesie',
    'Międzyrzec Podlaski', 'Międzyrzecz',
    'Mikołajki', 'Mikołów', 'Milanówek',
    'Milicz', 'Miłakowo', 'Miłomłyn',
    'Miłosław', 'Mińsk Mazowiecki', 'Mirosławiec',
    'Mława', 'Młynary', 'Modliborzyce',
    'Mogielnica', 'Mogilno', 'Morąg',
    'Mordy', 'Mosina', 'Mrągowo',
    'Mrocza', 'Mszana Dolna', 'Mszczonów',
    'Murowana Goślina', 'Muszyna', 'Myślenice',
    'Myślibórz', 'Mysłowice'
];

    // Łączymy wszystkie pakiety w jedną listę za pomocą "spread syntax" (...)
    const wszystkieMiasta = [...miastaA_C, ...miastaD_F, ...miastaG_J, ...miastaK_M];

    // Sortujemy połączoną listę alfabetycznie
    wszystkieMiasta.sort();

    // Filtrujemy posortowaną listę, tak jak wcześniej
    const filtrowaneMiasta = wszystkieMiasta.filter(miasto =>
        miasto.toLowerCase().includes(query.toLowerCase())
    );

    // Odsyłamy przefiltrowaną listę jako odpowiedź
    res.json(filtrowaneMiasta);
});

// Prosty endpoint testowy
app.get('/', (req, res) => {
    res.send('API serwera Upieczemy.pl działa!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serwer uruchomiony na porcie ${PORT}`));