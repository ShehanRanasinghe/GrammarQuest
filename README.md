GRAMMAR QUEST
A grammar game for Grades 6 to 9 (ages 11 to 15), played on the smart board.


HOW TO OPEN THE GAME
--------------------
1. Keep every file together in this one folder. Do not move single files out.
2. Double-click the file called  index.html
3. It opens in a web browser (Chrome or Edge is best). No internet is needed.

Tip: press the full-screen button (top right of the game) for the best view.

If the smart board runs Android and the file will not open, tell the person
who built the game. It can also be put online so you only need a link.


HOW TO PLAY
-----------
1. Choose the grade.
2. Choose a game:
     Fill the Blank     pick the word that completes the sentence
     Spot the Mistake   tap the word that is wrong
     Sentence Builder   tap the jumbled words in the right order
     Word Sorter        tap a word, then tap the basket it belongs in
     Mixed Challenge    a little of every game
3. Choose Whole class, or 2 to 4 teams. Teams can have their own names.
4. Press Start game. Teams take turns, one question each.

Scoring: 10 points for a correct answer. A team that answers 3 or more in a
row perfectly gets 5 bonus points on each one after that. After every
question the game shows the rule, so it works as a short lesson too.

Sound can be switched off with the speaker button at the top right.


ADDING OR CHANGING QUESTIONS
----------------------------
All questions are in the file  questions.js . Right-click it, choose
"Open with", and pick Notepad. The top of the file explains each kind of
question. The easiest way to add one is to copy an existing question,
paste it below, and change the words.

Example of a Fill the Blank question:

      { q: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], a: "goes",
        why: "With he, she or it, the verb ends in -s." },

Rules that keep the file working:
  - Keep the quote marks "like this" and the commas at the end of each line.
  - The last question in a list has no comma after its closing bracket.
  - In Fill the Blank, the answer (a) must be written exactly like one of the options.
  - In Spot the Mistake, the wrong word must appear once in the sentence.

After you save your changes, open  check-questions.html . It tells you in
plain words if anything needs fixing. A broken question is skipped by the
game, so nothing crashes.

Keep a copy of questions.js before editing, so you can go back to it.


FILES IN THIS FOLDER
--------------------
index.html            the game (open this one)
check-questions.html  checks your questions after editing
questions.js          all the questions
style.css, app.js,
validate.js           the game itself (no need to open these)
