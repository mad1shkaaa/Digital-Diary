
// ===================== Языки: қазақша / English / русский =====================
const I18N = {
  ru: {
    appTitle: 'Дневник моей жизни', welcomeSub: 'Каждый прожитый день становится картиной — из ваших слов, фотографий и музыки.',
    regGoogle: 'Регистрация через Google', regApple: 'Регистрация через Apple', haveAccount: 'Уже есть аккаунт?', login: 'Войти', changeLang: 'Сменить язык',
    regTitle: 'Создание аккаунта', loginTitle: 'Вход в аккаунт', accName: 'Имя аккаунта', accNamePh: 'Как вас называть? Например, Айгерим',
    emailGoogle: 'Почта Google (Gmail)', emailApple: 'Apple ID (почта)', password: 'Пароль', password2: 'Повторите пароль',
    pwHint: 'Минимум 6 символов. Пароль защищает дневник на этом устройстве.', create: 'Создать аккаунт', back: 'Назад',
    protoNote: 'Прототип: аккаунт и записи хранятся только в этом браузере. Настоящий вход через Google/Apple подключается на сервере.',
    errName: 'Введите имя аккаунта (2–24 символа).', errEmail: 'Проверьте адрес почты.', errPw: 'Пароль — минимум 6 символов.', errPw2: 'Пароли не совпадают.',
    errExists: 'Этот аккаунт уже есть на устройстве — войдите.', errNoAcc: 'Аккаунт не найден на этом устройстве.', errWrongPw: 'Неверный пароль.',
    bTitle: 'Создайте своего героя', genderQ: 'Выберите пол персонажа', male: 'Мужской', female: 'Женский', undo: 'Назад', redo: 'Вперёд', reset: 'Сбросить',
    done: 'Готово ✓', cancel: 'Отмена', dragHint: 'Потяните, чтобы повернуть', none: 'Нет',
    cat_gender: 'Пол', cat_hair: 'Причёска', cat_hairColor: 'Цвет волос', cat_eyes: 'Глаза', cat_brows: 'Брови', cat_face: 'Лицо', cat_skin: 'Кожа', cat_clothes: 'Одежда', cat_acc: 'Аксессуары',
    shape: 'Форма', size: 'Размер', color: 'Цвет', thickness: 'Толщина', glasses: 'Очки', earrings: 'Серьги', hats: 'Головные уборы', neck: 'На шее', details: 'Детали лица',
    sizes: ['Маленькие', 'Средние', 'Большие'], thick: ['Тонкие', 'Средние', 'Густые'], three3d: 'Не удалось загрузить 3D-движок. Проверьте интернет и обновите страницу.',
    homeHint: 'Нажмите на героя, чтобы погрузиться в память', archive: 'Архив Воспоминаний', gathering: 'Собираю воспоминания… {i}/{n}', brainHint: 'Нажмите на мозг, чтобы войти', toHero: 'К герою',
    searchPh: 'Найти день: слово, месяц, год…', addDay: '+ Записать день', gHint: 'Колесо или свайп вверх — по месяцам; ← → или свайп вбок — по годам. Нажмите на картину месяца.',
    today: 'Сегодня', newPage: 'новая страница', writeNew: 'Записать<br>новый день', noResults: 'Такого дня пока нет в памяти', addInMonth: 'Добавить день', mostly: 'Чаще всего: {m}',
    toArchive: '← В архив', voice: '🔊 Озвучка', stop: '⏹️ Стоп', music: '♫ Музыка', musicOff: '♫ Без музыки', musicPause: '⏸️ Музыка', art: '🎨 Картина', photo: '📷 Фото',
    makeMain: '☆ Сделать главной', isMain: '★ Главная', mainSaved: 'Главная картина дня обновлена', delete: 'Удалить день', deleteConfirm: 'Точно удалить? Нажмите ещё раз', deleted: 'День удалён',
    noVoiceLang: 'В браузере нет голоса для этого языка — читаю ближайшим', noSpeech: 'Синтез речи недоступен в этом браузере', soundBlocked: 'Браузер не дал включить звук — нажмите ещё раз',
    cTitle: 'Как прошёл день?', cSub: 'Пишите так, как рассказали бы близкому другу: свет, запахи, люди рядом, мелочи.', date: 'Дата', entry: 'Запись',
    entryPh: 'Гуляли по парку, всё в жёлтых листьях, было холодно, но мы пили какао и долго разговаривали…',  
    mainHint: 'Нажмите на фото, чтобы сделать его главной картиной дня ★', moodL: 'Настроение дня', musicL: 'Музыка', mNone: 'Без музыки', mAuto: 'По вайбу', mLib: 'Библиотека',
    noteNone: 'День откроется в тишине — только ваш голос и картины.', noteAuto: 'Подберу трек без авторских прав по настроению, фото и тексту дня.',
    noteLib: 'Все треки без авторских прав — оригинальные мелодии, созданные прямо на сайте. ▶ — прослушать.', save: 'Сохранить день',
    errText: 'Напишите хотя бы пару предложений о дне.', errPhotos: 'Добавьте минимум одно фото этого дня.', errMood: 'Выберите настроение дня.', errTrack: 'Выберите трек из библиотеки.',
    badPhotos: 'Не открылись: {f}. Сохраните фото как JPG или PNG.', failDay: 'Не получилось собрать день: {e}',
    pTitle: 'Собираю воспоминание', pSteps: ['Читаю запись', 'Смотрю на фото: свет и цвет', 'Подбираю музыку', 'Выбираю художественный приём', 'Пишу картины дня', 'Кладу всё в архив'],
    picked: 'Музыка: «{n}»',
    settings: 'Настройки', signedAs: 'Вы вошли как', sLang: 'Язык', sGender: 'Пол персонажа', sAvatar: 'Изменить аватар', sName: 'Имя аккаунта', saveName: 'Сохранить', nameSaved: 'Имя сохранено',
    sVoice: 'Голос озвучки', autoVoice: 'Автоматически — самый естественный', voiceHint: 'Самые живые нейроголоса — в Microsoft Edge (голоса «Natural», есть казахский) и Google Chrome.',
    testVoice: '▶ Прослушать', voiceSample: 'Привет! Сегодня был тёплый день… Я расскажу его так, как будто мы сидим рядом.', sDemo: 'Удалить демо-дни', demoRemoved: 'Демо-дни удалены',
    logout: 'Выйти из аккаунта', switchAcc: 'Войти в другой аккаунт', account: 'Аккаунт', sAbout: 'Сессия хранится 3 дня — повторно входить не нужно.',
    noDictation: "Голосовой ввод не поддерживается этим браузером (попробуйте Chrome или Edge)", micDenied: "Нет доступа к микрофону — разрешите его в браузере", noDictationLang: "Распознавание этого языка недоступно в браузере", dictate: "🎙 Надиктовать текст", dictateStop: "⏺ Идёт запись… нажмите, чтобы остановить", voiceL: "Кто расскажет ваш день", pxNote: "Музыка Pixabay бесплатна и без авторских отчислений. Откройте подборку под настроение, скачайте трек и загрузите его сюда — сайт сам определит темп и настроение, трек появится в библиотеке и в автоподборе.", pxUpload: "⬆ Загрузить трек", pxAdded: "Трек «{n}» добавлен в библиотеку", badAudio: "Не удалось прочитать аудиофайл", badVideo: "Не удалось открыть видео", editDay: "✎ Редактировать день", editTitle: "Редактирование дня", saveChanges: "Сохранить изменения", saved: "Сохранено", live: "✨ Живое фото", still: "🖼 Статичное", immerse: "⤢ Погрузиться", exitImmerse: "✕ Выйти", videoSound: "▶ Смотреть со звуком", forAll: "Выбрать для всех фото", forAllDone: "Эмоция применена ко всем фото дня", moodPhoto: "Эмоция этого фото", studio: "Студия голосов", studioPh: "Вставьте или напишите любой текст…", speakBtn: "▶ Озвучить", ttsUrl: "Сервер нейро-озвучки (необязательно)", ttsHint: "Без сервера используются голоса браузера с характером персонажа. Для настоящих нейроголосов запустите server/tts-proxy.mjs (ElevenLabs или OpenAI) и вставьте его адрес.", albums: "Альбомы", albumsSub: "Собирайте фото из разных дней в альбомы и делитесь ими.", newAlbum: "Новый альбом", shared: "общий", photosN: "фото", sharedWith: "Доступ", privateAlbum: "Личный альбом", editAlbum: "Изменить", albumName: "Название альбома", albumNamePh: "Например, Лето 2026", pickDays: "Фото из галереи", pickPhotos2: "Выбрать фото", pickCover: "Обложка", shareL: "Общий доступ", shareToggle: "Сделать альбом общим (как Shared Album)", shareNote: "Участники с этими почтами увидят альбом в своём аккаунте на этом устройстве. Для синхронизации между телефонами нужен сервер.", saveAlbum: "Сохранить альбом", deleteAlbum: "Удалить альбом", errAlbumName: "Введите название альбома", errAlbumEmpty: "Выберите хотя бы одно фото", albumSaved: "Альбом сохранён", photos: "Фото, видео и Live Photo", pickPhotos: "Нажмите, чтобы выбрать фото или видео (Live Photo — загрузите его видео .MOV)"
  },
  en: {
    appTitle: 'Diary of My Life', welcomeSub: 'Every day you live becomes a painting — made of your words, photos and music.',
    regGoogle: 'Sign up with Google', regApple: 'Sign up with Apple', haveAccount: 'Already have an account?', login: 'Log in', changeLang: 'Change language',
    regTitle: 'Create an account', loginTitle: 'Log in', accName: 'Account name', accNamePh: 'What should we call you? e.g. Alex',
    emailGoogle: 'Google email (Gmail)', emailApple: 'Apple ID (email)', password: 'Password', password2: 'Repeat password',
    pwHint: 'At least 6 characters. It protects your diary on this device.', create: 'Create account', back: 'Back',
    protoNote: 'Prototype: the account and entries are stored only in this browser. Real Google/Apple sign-in is connected on the server.',
    errName: 'Enter an account name (2–24 characters).', errEmail: 'Check the email address.', errPw: 'Password must be at least 6 characters.', errPw2: 'Passwords do not match.',
    errExists: 'This account already exists on this device — log in.', errNoAcc: 'Account not found on this device.', errWrongPw: 'Wrong password.',
    bTitle: 'Create your character', genderQ: 'Choose your character’s gender', male: 'Male', female: 'Female', undo: 'Undo', redo: 'Redo', reset: 'Reset',
    done: 'Done ✓', cancel: 'Cancel', dragHint: 'Drag to rotate', none: 'None',
    cat_gender: 'Gender', cat_hair: 'Hairstyle', cat_hairColor: 'Hair color', cat_eyes: 'Eyes', cat_brows: 'Eyebrows', cat_face: 'Face', cat_skin: 'Skin', cat_clothes: 'Clothes', cat_acc: 'Accessories',
    shape: 'Shape', size: 'Size', color: 'Color', thickness: 'Thickness', glasses: 'Glasses', earrings: 'Earrings', hats: 'Headwear', neck: 'Neckwear', details: 'Face details',
    sizes: ['Small', 'Medium', 'Large'], thick: ['Thin', 'Medium', 'Thick'], three3d: 'Could not load the 3D engine. Check your connection and reload.',
    homeHint: 'Tap your character to dive into your memory', archive: 'Memory Archive', gathering: 'Gathering memories… {i}/{n}', brainHint: 'Tap the brain to enter', toHero: 'Character',
    searchPh: 'Find a day: word, month, year…', addDay: '+ New day', gHint: 'Wheel or swipe up — through months; ← → or swipe sideways — through years. Tap a month painting.',
    today: 'Today', newPage: 'new page', writeNew: 'Write<br>a new day', noResults: 'No such day in memory yet', addInMonth: 'Add a day', mostly: 'Mostly: {m}',
    toArchive: '← Archive', voice: '🔊 Narrate', stop: '⏹️ Stop', music: '♫ Music', musicOff: '♫ No music', musicPause: '⏸️ Music', art: '🎨 Painting', photo: '📷 Photo',
    makeMain: '☆ Set as main', isMain: '★ Main', mainSaved: 'Main picture of the day updated', delete: 'Delete day', deleteConfirm: 'Sure? Tap again', deleted: 'Day deleted',
    noVoiceLang: 'No voice for this language in the browser — using the closest one', noSpeech: 'Speech synthesis is not available in this browser', soundBlocked: 'The browser blocked sound — tap again',
    cTitle: 'How was your day?', cSub: 'Write the way you would tell a close friend: the light, the smells, the people, the little things.', date: 'Date', entry: 'Entry',
    entryPh: 'We walked in the park, everything was covered in yellow leaves, it was cold but we drank cocoa and talked for ages…',  
    mainHint: 'Tap a photo to make it the main picture of the day ★', moodL: 'Mood of the day', musicL: 'Music', mNone: 'No music', mAuto: 'Match vibe', mLib: 'Library',
    noteNone: 'The day will open in silence — just your voice and the paintings.', noteAuto: 'I’ll pick a copyright-free track to match the mood, photos and text of the day.',
    noteLib: 'All tracks are copyright-free — original melodies generated right on the site. ▶ to preview.', save: 'Save the day',
    errText: 'Write at least a couple of sentences about the day.', errPhotos: 'Add at least one photo of the day.', errMood: 'Choose the mood of the day.', errTrack: 'Choose a track from the library.',
    badPhotos: 'Could not open: {f}. Save the photos as JPG or PNG.', failDay: 'Could not create the day: {e}',
    pTitle: 'Gathering the memory', pSteps: ['Reading your entry', 'Looking at the photos: light and color', 'Choosing the music', 'Choosing the art technique', 'Painting the day', 'Putting it into the archive'],
    picked: 'Music: “{n}”',
    settings: 'Settings', signedAs: 'Signed in as', sLang: 'Language', sGender: 'Character gender', sAvatar: 'Edit avatar', sName: 'Account name', saveName: 'Save', nameSaved: 'Name saved',
    sVoice: 'Narration voice', autoVoice: 'Automatic — most natural', voiceHint: 'The most lifelike neural voices are in Microsoft Edge (“Natural” voices, Kazakh included) and Google Chrome.',
    testVoice: '▶ Preview', voiceSample: 'Hi! Today was a warm day… I’ll tell it as if we were sitting side by side.', sDemo: 'Remove demo days', demoRemoved: 'Demo days removed',
    logout: 'Log out', switchAcc: 'Switch account', account: 'Account', sAbout: 'Your session is kept for 3 days — no need to log in again.',
    noDictation: "Voice input is not supported in this browser (try Chrome or Edge)", micDenied: "No microphone access — allow it in the browser", noDictationLang: "Recognition of this language is not available in the browser", dictate: "🎙 Dictate text", dictateStop: "⏺ Recording… tap to stop", voiceL: "Who will tell your day", pxNote: "Pixabay music is free and royalty-free. Open a selection for the mood, download a track and upload it here — the site will detect tempo and mood, and the track will appear in the library and in auto-matching.", pxUpload: "⬆ Upload track", pxAdded: "Track “{n}” added to the library", badAudio: "Could not read the audio file", badVideo: "Could not open the video", editDay: "✎ Edit day", editTitle: "Edit the day", saveChanges: "Save changes", saved: "Saved", live: "✨ Live photo", still: "🖼 Still", immerse: "⤢ Immerse", exitImmerse: "✕ Exit", videoSound: "▶ Watch with sound", forAll: "Apply to all photos", forAllDone: "Emotion applied to all photos of the day", moodPhoto: "Emotion of this photo", studio: "Voice studio", studioPh: "Paste or type any text…", speakBtn: "▶ Speak", ttsUrl: "Neural voice server (optional)", ttsHint: "Without a server the browser voices are used with each character’s style. For real neural voices run server/tts-proxy.mjs (ElevenLabs or OpenAI) and paste its address.", albums: "Albums", albumsSub: "Collect photos from different days into albums and share them.", newAlbum: "New album", shared: "shared", photosN: "photos", sharedWith: "Access", privateAlbum: "Private album", editAlbum: "Edit", albumName: "Album name", albumNamePh: "e.g. Summer 2026", pickDays: "Photos from the gallery", pickPhotos2: "Select photos", pickCover: "Cover", shareL: "Sharing", shareToggle: "Make the album shared (like a Shared Album)", shareNote: "Members with these emails will see the album in their account on this device. Syncing between phones requires a server.", saveAlbum: "Save album", deleteAlbum: "Delete album", errAlbumName: "Enter an album name", errAlbumEmpty: "Select at least one photo", albumSaved: "Album saved", photos: "Photos, videos and Live Photos", pickPhotos: "Tap to choose photos or videos (for a Live Photo upload its .MOV video)"
  },
  kk: {
    appTitle: 'Менің өмірім күнделігі', welcomeSub: 'Әр өткен күн сіздің сөздеріңізден, суреттеріңізден және әуеннен тұратын картинаға айналады.',
    regGoogle: 'Google арқылы тіркелу', regApple: 'Apple арқылы тіркелу', haveAccount: 'Аккаунтыңыз бар ма?', login: 'Кіру', changeLang: 'Тілді ауыстыру',
    regTitle: 'Аккаунт құру', loginTitle: 'Аккаунтқа кіру', accName: 'Аккаунт аты', accNamePh: 'Сізді қалай атайық? Мысалы, Айгерім',
    emailGoogle: 'Google поштасы (Gmail)', emailApple: 'Apple ID (пошта)', password: 'Құпиясөз', password2: 'Құпиясөзді қайталаңыз',
    pwHint: 'Кемінде 6 таңба. Құпиясөз күнделікті осы құрылғыда қорғайды.', create: 'Аккаунт құру', back: 'Артқа',
    protoNote: 'Прототип: аккаунт пен жазбалар тек осы браузерде сақталады. Google/Apple арқылы нақты кіру серверде қосылады.',
    errName: 'Аккаунт атын енгізіңіз (2–24 таңба).', errEmail: 'Пошта мекенжайын тексеріңіз.', errPw: 'Құпиясөз кемінде 6 таңба болуы керек.', errPw2: 'Құпиясөздер сәйкес емес.',
    errExists: 'Бұл аккаунт осы құрылғыда бар — кіріңіз.', errNoAcc: 'Бұл құрылғыда мұндай аккаунт табылмады.', errWrongPw: 'Құпиясөз қате.',
    bTitle: 'Кейіпкеріңізді жасаңыз', genderQ: 'Кейіпкердің жынысын таңдаңыз', male: 'Ер', female: 'Әйел', undo: 'Артқа', redo: 'Алға', reset: 'Тазалау',
    done: 'Дайын ✓', cancel: 'Бас тарту', dragHint: 'Айналдыру үшін сүйреңіз', none: 'Жоқ',
    cat_gender: 'Жыныс', cat_hair: 'Шаш үлгісі', cat_hairColor: 'Шаш түсі', cat_eyes: 'Көз', cat_brows: 'Қас', cat_face: 'Бет пішіні', cat_skin: 'Тері', cat_clothes: 'Киім', cat_acc: 'Аксессуарлар',
    shape: 'Пішіні', size: 'Өлшемі', color: 'Түсі', thickness: 'Қалыңдығы', glasses: 'Көзілдірік', earrings: 'Сырға', hats: 'Бас киім', neck: 'Мойынға', details: 'Бет детальдары',
    sizes: ['Кішкентай', 'Орташа', 'Үлкен'], thick: ['Жіңішке', 'Орташа', 'Қалың'], three3d: '3D қозғалтқышы жүктелмеді. Интернетті тексеріп, бетті жаңартыңыз.',
    homeHint: 'Жадыңызға сүңгу үшін кейіпкерді басыңыз', archive: 'Естеліктер мұрағаты', gathering: 'Естеліктерді жинап жатырмын… {i}/{n}', brainHint: 'Кіру үшін миды басыңыз', toHero: 'Кейіпкерге',
    searchPh: 'Күнді табу: сөз, ай, жыл…', addDay: '+ Күнді жазу', gHint: 'Дөңгелек немесе жоғары свайп — айлар бойынша; ← → немесе бүйірге свайп — жылдар бойынша. Ай картинасын басыңыз.',
    today: 'Бүгін', newPage: 'жаңа бет', writeNew: 'Жаңа күнді<br>жазу', noResults: 'Жадта мұндай күн әлі жоқ', addInMonth: 'Күн қосу', mostly: 'Көбіне: {m}',
    toArchive: '← Мұрағатқа', voice: '🔊 Дауыстап оқу', stop: '⏹️ Тоқтату', music: '♫ Әуен', musicOff: '♫ Әуенсіз', musicPause: '⏸️ Әуен', art: '🎨 Картина', photo: '📷 Фото',
    makeMain: '☆ Басты ету', isMain: '★ Басты', mainSaved: 'Күннің басты суреті жаңартылды', delete: 'Күнді жою', deleteConfirm: 'Сенімдісіз бе? Тағы басыңыз', deleted: 'Күн жойылды',
    noVoiceLang: 'Браузерде бұл тілге дауыс жоқ — ең жақынымен оқимын', noSpeech: 'Бұл браузерде сөйлеу синтезі жоқ', soundBlocked: 'Браузер дыбысты қоспады — тағы басыңыз',
    cTitle: 'Күніңіз қалай өтті?', cSub: 'Жақын досыңызға айтқандай жазыңыз: жарық, иіс, жаныңыздағы адамдар, ұсақ-түйек.', date: 'Күні', entry: 'Жазба',
    entryPh: 'Саябақта серуендедік, айнала сары жапырақ, суық болды, бірақ какао ішіп, ұзақ сөйлестік…',  
    mainHint: 'Күннің басты суреті ету үшін фотоны басыңыз ★', moodL: 'Күннің көңіл-күйі', musicL: 'Әуен', mNone: 'Әуенсіз', mAuto: 'Көңіл-күйге сай', mLib: 'Кітапхана',
    noteNone: 'Күн тыныштықта ашылады — тек сіздің дауысыңыз бен картиналар.', noteAuto: 'Күннің көңіл-күйіне, суреттері мен мәтініне сай авторлық құқықсыз трек таңдаймын.',
    noteLib: 'Барлық трек авторлық құқықсыз — сайттың өзінде жасалған түпнұсқа әуендер. ▶ — тыңдау.', save: 'Күнді сақтау',
    errText: 'Күн туралы кемінде бір-екі сөйлем жазыңыз.', errPhotos: 'Осы күннің кемінде бір суретін қосыңыз.', errMood: 'Күннің көңіл-күйін таңдаңыз.', errTrack: 'Кітапханадан трек таңдаңыз.',
    badPhotos: 'Ашылмады: {f}. Суреттерді JPG немесе PNG етіп сақтаңыз.', failDay: 'Күнді жинау мүмкін болмады: {e}',
    pTitle: 'Естелікті жинап жатырмын', pSteps: ['Жазбаны оқып жатырмын', 'Суреттерге қараймын: жарық пен түс', 'Әуен таңдаймын', 'Көркемдік тәсілді таңдаймын', 'Күннің картиналарын саламын', 'Барлығын мұрағатқа саламын'],
    picked: 'Әуен: «{n}»',
    settings: 'Баптаулар', signedAs: 'Кірген аккаунт', sLang: 'Тіл', sGender: 'Кейіпкердің жынысы', sAvatar: 'Аватарды өзгерту', sName: 'Аккаунт аты', saveName: 'Сақтау', nameSaved: 'Аты сақталды',
    sVoice: 'Оқу дауысы', autoVoice: 'Автоматты — ең табиғи дауыс', voiceHint: 'Ең шынайы нейрондық дауыстар — Microsoft Edge («Natural», қазақша да бар) және Google Chrome браузерлерінде.',
    testVoice: '▶ Тыңдау', voiceSample: 'Сәлем! Бүгін жылы күн болды… Мен оны қатар отырғандай айтып беремін.', sDemo: 'Демо-күндерді жою', demoRemoved: 'Демо-күндер жойылды',
    logout: 'Аккаунттан шығу', switchAcc: 'Басқа аккаунтқа кіру', account: 'Аккаунт', sAbout: 'Сессия 3 күн сақталады — қайта кірудің қажеті жоқ.',
    noDictation: "Бұл браузер дауыспен енгізуді қолдамайды (Chrome не Edge қолданып көріңіз)", micDenied: "Микрофонға рұқсат жоқ — браузерде рұқсат беріңіз", noDictationLang: "Браузерде бұл тілді тану мүмкін емес", dictate: "🎙 Мәтінді айтып жазу", dictateStop: "⏺ Жазылып жатыр… тоқтату үшін басыңыз", voiceL: "Күніңізді кім айтып береді", pxNote: "Pixabay әуендері тегін әрі авторлық төлемсіз. Көңіл-күйге сай таңдауды ашып, тректі жүктеп алып, осында салыңыз — сайт қарқыны мен көңіл-күйін өзі анықтайды, трек кітапханада және автотаңдауда пайда болады.", pxUpload: "⬆ Трек жүктеу", pxAdded: "«{n}» трегі кітапханаға қосылды", badAudio: "Аудиофайлды оқу мүмкін болмады", badVideo: "Бейнені ашу мүмкін болмады", editDay: "✎ Күнді өңдеу", editTitle: "Күнді өңдеу", saveChanges: "Өзгерістерді сақтау", saved: "Сақталды", live: "✨ Тірі фото", still: "🖼 Қозғалыссыз", immerse: "⤢ Сүңгу", exitImmerse: "✕ Шығу", videoSound: "▶ Дыбыспен көру", forAll: "Барлық фотоға таңдау", forAllDone: "Эмоция күннің барлық фотосына қолданылды", moodPhoto: "Осы фотоның эмоциясы", studio: "Дауыс студиясы", studioPh: "Кез келген мәтінді қойыңыз не жазыңыз…", speakBtn: "▶ Дауыстау", ttsUrl: "Нейро-дауыс сервері (міндетті емес)", ttsHint: "Серверсіз браузер дауыстары кейіпкер мінезімен қолданылады. Нақты нейро-дауыстар үшін server/tts-proxy.mjs (ElevenLabs не OpenAI) іске қосып, мекенжайын қойыңыз.", albums: "Альбомдар", albumsSub: "Әр күннің фотоларын альбомдарға жинап, бөлісіңіз.", newAlbum: "Жаңа альбом", shared: "ортақ", photosN: "фото", sharedWith: "Қолжетімділік", privateAlbum: "Жеке альбом", editAlbum: "Өзгерту", albumName: "Альбом атауы", albumNamePh: "Мысалы, Жаз 2026", pickDays: "Галереядағы фотолар", pickPhotos2: "Фото таңдау", pickCover: "Мұқаба", shareL: "Ортақ қолжетімділік", shareToggle: "Альбомды ортақ ету (Shared Album сияқты)", shareNote: "Осы поштасы бар қатысушылар альбомды осы құрылғыдағы аккаунтында көреді. Телефондар арасында синхрондау үшін сервер қажет.", saveAlbum: "Альбомды сақтау", deleteAlbum: "Альбомды жою", errAlbumName: "Альбом атауын енгізіңіз", errAlbumEmpty: "Кемінде бір фото таңдаңыз", albumSaved: "Альбом сақталды", photos: "Фото, бейне және Live Photo", pickPhotos: "Фото не бейне таңдау үшін басыңыз (Live Photo үшін оның .MOV бейнесін жүктеңіз)"
  }
};
const CAL = {
  ru: { months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
    gen: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    wd: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'] },
  en: { months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    wd: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  kk: { months: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'],
    wd: ['жексенбі', 'дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'] }
};
let LANG = 'ru';
function t(k, vars) { let s = (I18N[LANG] && I18N[LANG][k]); if (s === undefined) s = I18N.ru[k]; if (s === undefined) return k; if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, (m, v) => vars[v] !== undefined ? vars[v] : m); return s; }
const L3 = o => (o && (o[LANG] || o.ru)) || '';
function applyI18n(root = document) {
  document.documentElement.lang = LANG === 'kk' ? 'kk' : LANG;
  document.title = t('appTitle');
  $$('[data-i18n]', root).forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  $$('[data-i18n-ph]', root).forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
}
function monthName(m) { return cap(CAL[LANG].months[m]); }
function fmtDay(s) { const d = parseDate(s); return LANG === 'ru' ? `${d.getDate()} ${CAL.ru.gen[d.getMonth()]}` : LANG === 'en' ? `${CAL.en.months[d.getMonth()]} ${d.getDate()}` : `${d.getDate()} ${CAL.kk.months[d.getMonth()]}`; }
function fmtWeek(s) { const d = parseDate(s); return CAL[LANG].wd[d.getDay()]; }
function daysN(n) {
  if (LANG === 'en') return n + (n === 1 ? ' day' : ' days');
  if (LANG === 'kk') return n + ' күн';
  const m10 = n % 10, m100 = n % 100; return n + ' ' + (m10 === 1 && m100 !== 11 ? 'день' : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? 'дня' : 'дней');
}
const FLAGS = {
  kk: '<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#00afca"/><g fill="#fec50c"><circle cx="31" cy="17" r="6"/><g stroke="#fec50c" stroke-width="1.3">' + Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return `<line x1="${31 + Math.cos(a) * 7.6}" y1="${17 + Math.sin(a) * 7.6}" x2="${31 + Math.cos(a) * 10}" y2="${17 + Math.sin(a) * 10}"/>`; }).join('') + '</g><path d="M20 27c4 3 18 3 22 0-3 4-19 4-22 0z"/><rect x="4" y="2" width="3" height="36" opacity=".9"/><path d="M5.5 5l3 3-3 3-3-3zM5.5 14l3 3-3 3-3-3zM5.5 23l3 3-3 3-3-3zM5.5 32l3 3-3 3-3-3z" fill="#00afca"/></g></svg>',
  en: '<svg viewBox="0 0 60 40"><g><rect width="60" height="40" fill="#012169"/><path d="M0 0l60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l60 40M60 0L0 40" stroke="#c8102e" stroke-width="3"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="7"/></g></svg>',
  ru: '<svg viewBox="0 0 60 40"><rect width="60" height="13.4" fill="#fff"/><rect y="13.3" width="60" height="13.4" fill="#1c3fa8"/><rect y="26.6" width="60" height="13.4" fill="#d52b1e"/></svg>'
};
const LANGS = [{ id: 'kk', name: 'Қазақша', sub: 'Қазақ тілі' }, { id: 'en', name: 'English', sub: 'English' }, { id: 'ru', name: 'Русский', sub: 'Русский язык' }];
const ICON_G = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#fff" stroke="#d9d6ee"/><path d="M17.6 12.2c0-.4 0-.8-.1-1.2H12v2.3h3.2a2.8 2.8 0 0 1-1.2 1.8v1.5h1.9c1.1-1 1.7-2.5 1.7-4.4z" fill="#4c63d2"/><path d="M12 18c1.6 0 2.9-.5 3.9-1.4L14 15.1c-.5.4-1.2.6-2 .6a3.5 3.5 0 0 1-3.3-2.4H6.8v1.5A6 6 0 0 0 12 18z" fill="#3b9a5d"/><path d="M8.7 13.3a3.5 3.5 0 0 1 0-2.6V9.2H6.8a6 6 0 0 0 0 5.6z" fill="#e8b53a"/><path d="M12 8.3c.9 0 1.7.3 2.3.9l1.7-1.7A6 6 0 0 0 6.8 9.2l1.9 1.5A3.5 3.5 0 0 1 12 8.3z" fill="#d6503f"/></svg>';
const ICON_A = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.8zM14.1 5.9c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.3z"/></svg>';

// ===================== Настроения: цвет подсветки дня и месяца =====================
const MOODS = {
  joy: { e: '😊', c: '#ffc857', v: .8, a: .66, n: { ru: 'Радость', en: 'Joy', kk: 'Қуаныш' } },
  calm: { e: '😌', c: '#7fd8be', v: .45, a: .18, n: { ru: 'Спокойствие', en: 'Calm', kk: 'Тыныштық' } },
  love: { e: '🥰', c: '#ff8fb1', v: .72, a: .45, n: { ru: 'Любовь', en: 'Love', kk: 'Махаббат' } },
  inspired: { e: '✨', c: '#b48cff', v: .55, a: .72, n: { ru: 'Вдохновение', en: 'Inspired', kk: 'Шабыт' } },
  nostalgic: { e: '🍂', c: '#f4a261', v: .22, a: .34, n: { ru: 'Ностальгия', en: 'Nostalgia', kk: 'Сағыныш' } },
  sad: { e: '🌧️', c: '#6c8ef5', v: -.6, a: .24, n: { ru: 'Грусть', en: 'Sadness', kk: 'Мұң' } },
  tired: { e: '😴', c: '#9a94b8', v: -.25, a: .12, n: { ru: 'Усталость', en: 'Tired', kk: 'Шаршау' } },
  angry: { e: '😤', c: '#ff5a5f', v: -.62, a: .86, n: { ru: 'Злость', en: 'Anger', kk: 'Ашу' } }
};
const MOOD_KEYS = Object.keys(MOODS);

// ===================== Музыка без авторских прав: оригинальные мелодии, синтез на устройстве =====================
const TRACKS = [
  { id: 'warm-palms', style: 'piano', bpm: 72, mode: 'major', root: 62, seed: 1, prog: [0, 3, 4, 3], pat: [0, 2, 1, 3, 2, 1, 3, 2], v: .5, e: .3, tags: ['calm', 'love'], n: { ru: 'Тёплые ладони', en: 'Warm Palms', kk: 'Жылы алақан' } },
  { id: 'grandma-record', style: 'waltz', bpm: 90, mode: 'major', root: 65, lofi: true, seed: 2, prog: [0, 5, 1, 4], v: .3, e: .4, tags: ['nostalgic', 'love'], n: { ru: 'Пластинка у бабушки', en: 'Grandma’s Record', kk: 'Әжемнің пластинкасы' } },
  { id: 'steppe-wind', style: 'dombra', bpm: 108, mode: 'minor', root: 62, seed: 3, prog: [0, 6, 5, 4], v: .45, e: .66, tags: ['inspired', 'joy'], n: { ru: 'Ветер степи', en: 'Steppe Wind', kk: 'Дала желі' } },
  { id: 'blow-candles', style: 'pop', bpm: 124, mode: 'major', root: 64, seed: 4, prog: [0, 4, 5, 3], v: .82, e: .82, tags: ['joy'], n: { ru: 'Задуй свечи', en: 'Blow the Candles', kk: 'Шамды үрле' } },
  { id: 'sunrise-run', style: 'guitar', bpm: 112, mode: 'major', root: 67, seed: 5, prog: [0, 1, 3, 4], v: .7, e: .68, tags: ['joy', 'inspired'], n: { ru: 'Пробежка на рассвете', en: 'Sunrise Run', kk: 'Таңғы жүгіріс' } },
  { id: 'music-box', style: 'box', bpm: 96, mode: 'major', root: 72, seed: 6, prog: [0, 5, 3, 4], v: .6, e: .3, tags: ['love', 'nostalgic'], n: { ru: 'Музыкальная шкатулка', en: 'Music Box', kk: 'Музыкалық қорап' } },
  { id: 'fog-water', style: 'ambient', bpm: 60, mode: 'major', root: 60, seed: 7, prog: [0, 3, 0, 4], v: .3, e: .1, tags: ['calm'], n: { ru: 'Туман над водой', en: 'Fog over Water', kk: 'Су үстіндегі тұман' } },
  { id: 'stardust', style: 'strings', bpm: 64, mode: 'minor', root: 57, seed: 8, prog: [0, 5, 3, 6], v: 0, e: .15, tags: ['calm', 'tired', 'sad'], n: { ru: 'Звёздная пыль', en: 'Stardust', kk: 'Жұлдыз шаңы' } },
  { id: 'night-city', style: 'piano', bpm: 82, mode: 'minor', root: 58, lofi: true, seed: 9, prog: [0, 3, 6, 2], pat: [0, 3, 1, 2, 0, 3, 2, 1], v: -.1, e: .35, tags: ['tired', 'nostalgic'], n: { ru: 'Ночной город', en: 'Night City', kk: 'Түнгі қала' } },
  { id: 'rain-glass', style: 'guitar', bpm: 70, mode: 'minor', root: 59, seed: 10, prog: [0, 5, 2, 4], v: -.5, e: .25, tags: ['sad'], n: { ru: 'Капли по стеклу', en: 'Raindrops on Glass', kk: 'Әйнектегі тамшылар' } },
  { id: 'four-am', style: 'electro', bpm: 128, mode: 'minor', root: 57, seed: 11, prog: [0, 0, 5, 6], v: -.2, e: .85, tags: ['tired', 'inspired'], n: { ru: '4:00 утра', en: '4 AM', kk: 'Таңғы 4:00' } },
  { id: 'storm', style: 'electro', bpm: 142, mode: 'minor', root: 52, seed: 12, prog: [0, 6, 5, 6], up: [0, 3, 7, 10], v: -.6, e: .92, tags: ['angry'], n: { ru: 'Гроза', en: 'Thunderstorm', kk: 'Найзағай' } },
  { id: 'cinema', style: 'strings', bpm: 76, mode: 'major', root: 60, seed: 13, prog: [0, 4, 5, 2], v: .55, e: .45, tags: ['inspired', 'love'], n: { ru: 'Кинолента', en: 'Film Reel', kk: 'Кинолента' } },
  { id: 'lullaby', style: 'box', bpm: 70, mode: 'minor', root: 69, seed: 14, prog: [0, 3, 4, 0], v: .1, e: .15, tags: ['tired', 'calm', 'nostalgic'], n: { ru: 'Колыбельная', en: 'Lullaby', kk: 'Бесік жыры' } }
];
const TRACK = Object.fromEntries(TRACKS.map(x => [x.id, x]));
