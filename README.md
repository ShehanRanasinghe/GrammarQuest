# Grammar Quest

A classroom grammar game for **Grades 6 to 9 (ages 11 to 15)**, built for a school smart board. It runs in any web browser, works offline, and needs no installation.

Built with plain HTML, CSS and JavaScript. No frameworks, no build step, no internet connection needed.

## Features

- **Five game types**
  - **Fill the Blank**: choose the word that completes the sentence.
  - **Spot the Mistake**: tap the word that is wrong.
  - **Sentence Builder**: tap jumbled words into the right order.
  - **Word Sorter**: tap a word, then tap the basket it belongs in.
  - **Mixed Challenge**: a little of every game.
- **Four grades**, each with its own questions: 136 questions in total.
- **Whole class or 2 to 4 teams**, with editable team names, a live scoreboard and turn-taking.
- **Short lesson after every question**: the game shows the grammar rule, so wrong answers become teaching moments.
- **Made for smart boards**: large touch targets, high-contrast school theme (chalkboard header, ruled paper, pencil mascot), full-screen button and sound toggle.
- **Teacher-friendly question editing**: all questions live in one plain text file, with a checker page that explains mistakes in plain words.

## Grammar topics

| Grade | Ages | Topics |
|-------|------|--------|
| 6 | 11 to 12 | Nouns, verbs, plurals, a and an, simple tenses |
| 7 | 12 to 13 | Adverbs, comparing, prepositions, continuous tenses |
| 8 | 13 to 14 | Present perfect, passive voice, modals, conditionals |
| 9 | 14 to 15 | Reported speech, conditionals, passive, linking words |

## How to run

1. Download or clone this repository.
2. Keep all files together in one folder.
3. Double-click **`index.html`**. It opens in Chrome, Edge or Firefox.

That is all. Because it is a static web page, it also works on any smart board that has a browser, whether the board runs Windows, Android or Linux.

**Optional: put it online.** In your GitHub repository, go to *Settings > Pages*, choose the `main` branch and the root folder, and save. GitHub gives you a link the teacher can open on any device.

## How to play

1. Choose the grade.
2. Choose a game.
3. Choose **Whole class** or 2 to 4 teams, and rename the teams if you like.
4. Press **Start game**. Teams take turns, one question each.

**Scoring:** 10 points for a correct answer. A team that answers three or more in a row without a mistake earns 5 bonus points on each answer after that.

## Adding or changing questions

All questions are in **`questions.js`**. Open it in any text editor (Notepad is fine) and copy an existing question as a template.

```js
// Fill the Blank
{ q: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], a: "goes",
  why: "With he, she or it, the verb ends in -s." },

// Spot the Mistake
{ s: "She go to school by bus.", wrong: "go", fix: "She goes to school by bus.",
  why: "With she, he or it, the simple present verb needs -s or -es." },

// Sentence Builder (alt lists other accepted word orders)
{ s: "We went to the beach last summer.", alt: ["Last summer we went to the beach."] },

// Word Sorter
{ title: "Singular or plural?", buckets: ["Singular", "Plural"],
  items: [["mouse", "Singular"], ["mice", "Plural"]],
  tip: "Some nouns change inside the word to make a plural." },
```

Rules that keep the file working:

- Keep the quote marks and the commas at the end of each line.
- The last question in a list has no comma after its closing bracket.
- In Fill the Blank, the answer `a` must match one of the options exactly.
- In Spot the Mistake, the wrong word must appear once in the sentence.

After saving, open **`check-questions.html`**. It lists any problems in plain words. The game skips a broken question, so nothing crashes.

## Project structure

```
index.html            the game (open this file)
check-questions.html  checks questions after editing
questions.js          the question bank (data)
app.js                game engine and screens
validate.js           question validation, shared by the game and the checker
style.css             school theme and layout
README.txt            plain-text instructions for teachers
```

## How it works

- **Data structure:** the question bank is a nested object keyed by grade, holding arrays of question objects for each game type.
- **Selection:** questions are drawn with a Fisher-Yates shuffle and kept in a queue, so no question repeats within a round.
- **Answer checking:** Sentence Builder compares normalised word sequences held in sets, so sentences with more than one correct word order are accepted.
- **Validation:** `validate.js` checks every question before play and skips any that are malformed.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari on desktop, Android and iPadOS. If a smart board has an older built-in browser, install or update Chrome or Edge.

## Contributing

Ideas for new questions, grammar topics and game types are welcome. Open an issue or a pull request. For new questions, run `check-questions.html` first and make sure it reports no problems.
