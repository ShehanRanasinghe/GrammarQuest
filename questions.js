/* =====================================================================
   GRAMMAR QUEST - QUESTION BANK
   =====================================================================
   This file holds every question in the game. It is plain text, so it
   can be edited in Notepad. Open README.txt for step-by-step help.

   Each grade (6, 7, 8, 9) has four kinds of questions:

   fill   Fill the Blank
          q        the sentence, with ___ where the word is missing
          options  the choices (the game shuffles them)
          a        the correct choice (must be written exactly as in options)
          why      a short explanation shown after the answer

   spot   Spot the Mistake
          s        the sentence that contains ONE wrong word
          wrong    the wrong word, written exactly as in the sentence
          fix      the corrected sentence
          why      a short explanation

   build  Sentence Builder
          s        the correct sentence (the game shuffles the words)
          alt      (optional) other correct word orders

   sort   Word Sorter
          title    the heading shown to the students
          buckets  the baskets (2 to 4 names)
          items    pairs of ["word", "basket name"]
          tip      a short rule shown at the end

   After editing, open check-questions.html to make sure nothing broke.
   ===================================================================== */

const GRADE_INFO = {
  6: { label: "Grade 6", ages: "Ages 11 to 12", topics: "Nouns, verbs, plurals, a and an, simple tenses" },
  7: { label: "Grade 7", ages: "Ages 12 to 13", topics: "Adverbs, comparing, prepositions, continuous tenses" },
  8: { label: "Grade 8", ages: "Ages 13 to 14", topics: "Present perfect, passive voice, modals, conditionals" },
  9: { label: "Grade 9", ages: "Ages 14 to 15", topics: "Reported speech, conditionals, passive, linking words" }
};

const QUESTION_BANK = {

  /* ================================ GRADE 6 ================================ */
  6: {
    fill: [
      { q: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], a: "goes",
        why: "With he, she or it, the verb in the simple present ends in -s or -es." },
      { q: "He ate ___ apple for lunch.", options: ["a", "an", "two", "many"], a: "an",
        why: "We use 'an' before a vowel sound: an apple, an egg, an umbrella." },
      { q: "There ___ five books on the desk.", options: ["are", "is", "am", "be"], a: "are",
        why: "'Books' is plural, so we say 'there are'." },
      { q: "The children ___ playing in the garden.", options: ["are", "is", "was", "am"], a: "are",
        why: "'Children' means more than one, so we use 'are' with the -ing verb." },
      { q: "Yesterday we ___ a funny movie.", options: ["watched", "watch", "watching", "watches"], a: "watched",
        why: "'Yesterday' tells us the action is finished, so we use the past form: watched." },
      { q: "One child, two ___.", options: ["children", "childs", "childrens", "childes"], a: "children",
        why: "Child is an irregular noun. Its plural is children." },
      { q: "This is my sister. ___ name is Anna.", options: ["Her", "She", "Hers", "Him"], a: "Her",
        why: "'Her' shows who the name belongs to. 'She' is used as the subject of a sentence." },
      { q: "My bag is ___ than your bag.", options: ["heavier", "heavy", "heaviest", "more heavy"], a: "heavier",
        why: "To compare two things, add -er. When a word ends in y, change the y to i: heavy, heavier." },
      { q: "Look at ___ birds over there!", options: ["those", "that", "this", "it"], a: "those",
        why: "'Those' points to more than one thing that is far away. 'That' is for one thing." },
      { q: "She sings very ___.", options: ["beautifully", "beautiful", "beauty", "beautify"], a: "beautifully",
        why: "An adverb tells us how someone does something. Many adverbs end in -ly." },
      { q: "We eat lunch ___ one o'clock.", options: ["at", "in", "on", "of"], a: "at",
        why: "Use 'at' with exact times: at one o'clock, at noon." },
      { q: "My birthday is ___ March.", options: ["in", "on", "at", "of"], a: "in",
        why: "Use 'in' with months and years: in March, in 2026." },
      { q: "The word 'happy' describes a person, so it is a(n) ___.", options: ["adjective", "noun", "verb", "adverb"], a: "adjective",
        why: "Adjectives describe nouns. 'Happy' describes the person." },
      { q: "He ___ not like carrots.", options: ["does", "do", "is", "are"], a: "does",
        why: "With he, she or it, we use 'does' to make a negative: he does not like." }
    ],
    spot: [
      { s: "She go to school by bus.", wrong: "go", fix: "She goes to school by bus.",
        why: "With she, he or it, the simple present verb needs -s or -es." },
      { s: "There is three apples on the table.", wrong: "is", fix: "There are three apples on the table.",
        why: "'Apples' is plural, so we say 'there are'." },
      { s: "He have a red bicycle.", wrong: "have", fix: "He has a red bicycle.",
        why: "With he, she or it, 'have' changes to 'has'." },
      { s: "I seen a rainbow yesterday.", wrong: "seen", fix: "I saw a rainbow yesterday.",
        why: "The past simple of 'see' is 'saw'. 'Seen' needs 'have' or 'has' before it." },
      { s: "My mother cook dinner every evening.", wrong: "cook", fix: "My mother cooks dinner every evening.",
        why: "'My mother' means she, so the verb needs an -s." },
      { s: "We goed to the market on Sunday.", wrong: "goed", fix: "We went to the market on Sunday.",
        why: "'Go' is an irregular verb. Its past form is 'went'." },
      { s: "She is a honest girl.", wrong: "a", fix: "She is an honest girl.",
        why: "'Honest' starts with a vowel sound because the h is silent, so we use 'an'." },
      { s: "The childrens are playing outside.", wrong: "childrens", fix: "The children are playing outside.",
        why: "'Children' is already plural. We do not add an -s." }
    ],
    build: [
      { s: "The cat sleeps on the sofa." },
      { s: "My brother plays football every Saturday.", alt: ["Every Saturday my brother plays football."] },
      { s: "She is reading a very interesting book." },
      { s: "We went to the beach last summer.", alt: ["Last summer we went to the beach."] },
      { s: "There are many students in the library." },
      { s: "Our teacher gave us some homework." },
      { s: "Do you like chocolate ice cream?" },
      { s: "The little girl is wearing a blue dress." }
    ],
    sort: [
      { title: "Noun, verb or adjective?", buckets: ["Noun", "Verb", "Adjective"],
        items: [["teacher", "Noun"], ["window", "Noun"], ["village", "Noun"],
                ["write", "Verb"], ["carry", "Verb"], ["listen", "Verb"],
                ["happy", "Adjective"], ["brown", "Adjective"], ["tall", "Adjective"]],
        tip: "A noun names a person, place or thing. A verb shows action. An adjective describes a noun." },
      { title: "Singular or plural?", buckets: ["Singular", "Plural"],
        items: [["mouse", "Singular"], ["child", "Singular"], ["tooth", "Singular"], ["foot", "Singular"],
                ["mice", "Plural"], ["children", "Plural"], ["teeth", "Plural"], ["feet", "Plural"]],
        tip: "Some nouns change inside the word to make a plural: tooth, teeth." },
      { title: "Present or past?", buckets: ["Present", "Past"],
        items: [["eat", "Present"], ["go", "Present"], ["see", "Present"], ["take", "Present"],
                ["ate", "Past"], ["went", "Past"], ["saw", "Past"], ["took", "Past"]],
        tip: "Irregular verbs change their spelling in the past: go, went." },
      { title: "Person, place or thing?", buckets: ["Person", "Place", "Thing"],
        items: [["doctor", "Person"], ["farmer", "Person"], ["pilot", "Person"],
                ["library", "Place"], ["airport", "Place"], ["market", "Place"],
                ["umbrella", "Thing"], ["pencil", "Thing"], ["bicycle", "Thing"]],
        tip: "Nouns name people, places and things." }
    ]
  },

  /* ================================ GRADE 7 ================================ */
  7: {
    fill: [
      { q: "She is ___ her homework right now.", options: ["doing", "does", "did", "do"], a: "doing",
        why: "'Right now' shows an action in progress. Use am, is or are with the -ing form." },
      { q: "Mount Everest is the ___ mountain in the world.", options: ["highest", "higher", "high", "more high"], a: "highest",
        why: "To compare one thing with all the others, use the + -est: the highest." },
      { q: "There isn't ___ milk in the fridge.", options: ["much", "many", "a few", "several"], a: "much",
        why: "Milk is uncountable. We use 'much' with uncountable nouns in questions and negatives." },
      { q: "How ___ students are in your class?", options: ["many", "much", "long", "often"], a: "many",
        why: "Students can be counted, so we ask 'How many'." },
      { q: "I was reading when the phone ___.", options: ["rang", "ring", "rings", "ringing"], a: "rang",
        why: "A short action that interrupts a longer one uses the simple past: the phone rang." },
      { q: "She finished the test ___.", options: ["quickly", "quick", "quickness", "quicken"], a: "quickly",
        why: "We need an adverb to say how she finished. Add -ly to the adjective quick." },
      { q: "I like tea, ___ I don't like coffee.", options: ["but", "because", "so", "or"], a: "but",
        why: "'But' joins two ideas that contrast." },
      { q: "He was tired, ___ he went to bed early.", options: ["so", "but", "although", "or"], a: "so",
        why: "'So' introduces a result. Being tired is the reason he went to bed early." },
      { q: "The cat jumped ___ the wall.", options: ["over", "at", "in", "between"], a: "over",
        why: "'Over' shows movement from one side to the other, above something." },
      { q: "We will meet ___ Monday morning.", options: ["on", "in", "at", "of"], a: "on",
        why: "Use 'on' with days: on Monday, on Friday evening." },
      { q: "These bags are ours, and those are ___.", options: ["theirs", "their", "them", "they"], a: "theirs",
        why: "'Theirs' stands alone and means 'their bags'. 'Their' must be followed by a noun." },
      { q: "I ___ visit my grandparents next week.", options: ["will", "am", "have", "did"], a: "will",
        why: "'Next week' talks about the future, so we use will + base verb." },
      { q: "Please give the book to ___.", options: ["me", "I", "my", "mine"], a: "me",
        why: "After a preposition (to, for, with) we use an object pronoun: me, him, her, us, them." },
      { q: "She is good ___ drawing.", options: ["at", "in", "on", "for"], a: "at",
        why: "We say 'good at' when we talk about a skill." }
    ],
    spot: [
      { s: "He is more taller than his father.", wrong: "more", fix: "He is taller than his father.",
        why: "'Taller' already shows a comparison, so we do not add 'more'." },
      { s: "I am agree with you.", wrong: "am", fix: "I agree with you.",
        why: "'Agree' is a verb. We do not put 'am' before it." },
      { s: "They was playing cricket when it started to rain.", wrong: "was", fix: "They were playing cricket when it started to rain.",
        why: "'They' is plural, so we use 'were' in the past continuous." },
      { s: "I don't have no money.", wrong: "no", fix: "I don't have any money.",
        why: "Do not use two negatives together. After 'don't have', use 'any'." },
      { s: "How much students are in your class?", wrong: "much", fix: "How many students are in your class?",
        why: "Students can be counted, so we ask 'How many'." },
      { s: "He drives very slow.", wrong: "slow", fix: "He drives very slowly.",
        why: "We need an adverb (slowly) to describe the verb 'drives'." },
      { s: "She is the most tallest girl in the class.", wrong: "most", fix: "She is the tallest girl in the class.",
        why: "'Tallest' already shows the superlative, so we do not add 'most'." },
      { s: "My sister is interested on music.", wrong: "on", fix: "My sister is interested in music.",
        why: "We say 'interested in', not 'interested on'." }
    ],
    build: [
      { s: "The students are listening to the teacher carefully.", alt: ["The students are listening carefully to the teacher."] },
      { s: "She is the tallest girl in our class." },
      { s: "We were playing cricket when it started to rain.", alt: ["When it started to rain, we were playing cricket."] },
      { s: "I will call you after I finish my homework.", alt: ["After I finish my homework, I will call you."] },
      { s: "There isn't much water in the bottle." },
      { s: "He quickly packed his bag and left.", alt: ["He packed his bag quickly and left."] },
      { s: "Please give this letter to your parents." },
      { s: "My best friend lives near the old library." }
    ],
    sort: [
      { title: "Adjective or adverb?", buckets: ["Adjective", "Adverb"],
        items: [["quick", "Adjective"], ["careful", "Adjective"], ["happy", "Adjective"], ["quiet", "Adjective"],
                ["quickly", "Adverb"], ["carefully", "Adverb"], ["happily", "Adverb"], ["quietly", "Adverb"]],
        tip: "Adjectives describe nouns. Adverbs describe verbs, and many end in -ly." },
      { title: "Preposition or conjunction?", buckets: ["Preposition", "Conjunction"],
        items: [["under", "Preposition"], ["between", "Preposition"], ["beside", "Preposition"], ["behind", "Preposition"],
                ["because", "Conjunction"], ["although", "Conjunction"], ["but", "Conjunction"], ["unless", "Conjunction"]],
        tip: "Prepositions show position or direction. Conjunctions join ideas." },
      { title: "Countable or uncountable?", buckets: ["Countable", "Uncountable"],
        items: [["apple", "Countable"], ["chair", "Countable"], ["student", "Countable"], ["book", "Countable"],
                ["water", "Uncountable"], ["rice", "Uncountable"], ["advice", "Uncountable"], ["music", "Uncountable"]],
        tip: "We can count countable nouns (two apples). Uncountable nouns have no plural (some water)." },
      { title: "Which tense?", buckets: ["Present continuous", "Past simple"],
        items: [["is running", "Present continuous"], ["are eating", "Present continuous"], ["am singing", "Present continuous"], ["is raining", "Present continuous"],
                ["wrote", "Past simple"], ["swam", "Past simple"], ["drove", "Past simple"], ["sang", "Past simple"]],
        tip: "Present continuous uses am, is or are with -ing. Past simple often changes the verb itself." }
    ]
  },

  /* ================================ GRADE 8 ================================ */
  8: {
    fill: [
      { q: "I ___ already finished my homework.", options: ["have", "has", "did", "was"], a: "have",
        why: "With I, you, we and they, the present perfect uses 'have' + past participle." },
      { q: "She has lived here ___ 2019.", options: ["since", "for", "during", "while"], a: "since",
        why: "'Since' goes with a starting point in time. 'For' goes with a length of time." },
      { q: "We have been friends ___ five years.", options: ["for", "since", "from", "at"], a: "for",
        why: "'For' goes with a length of time: for five years. 'Since' goes with a starting point." },
      { q: "You ___ wear a seatbelt in a car. It is the law.", options: ["must", "might", "could", "may"], a: "must",
        why: "'Must' shows a strong rule or necessity." },
      { q: "___ I borrow your pen, please?", options: ["May", "Must", "Ought", "Have"], a: "May",
        why: "'May' is a polite way to ask for permission." },
      { q: "The window ___ by a ball yesterday.", options: ["was broken", "broke", "has broken", "is breaking"], a: "was broken",
        why: "In the passive voice we use was or were + past participle: was broken." },
      { q: "English ___ in many countries.", options: ["is spoken", "speaks", "is speaking", "spoke"], a: "is spoken",
        why: "For the passive in the present, we use is or are + past participle." },
      { q: "If it ___ tomorrow, we will cancel the picnic.", options: ["rains", "will rain", "rained", "rain"], a: "rains",
        why: "In a first conditional, use the present simple after 'if' and 'will' in the other part." },
      { q: "The boy ___ lives next door is my classmate.", options: ["who", "which", "whose", "where"], a: "who",
        why: "Use 'who' for people in a relative clause." },
      { q: "This is the book ___ I told you about.", options: ["which", "who", "whose", "where"], a: "which",
        why: "Use 'which' for things in a relative clause." },
      { q: "Each of the students ___ a notebook.", options: ["has", "have", "having", "are"], a: "has",
        why: "'Each' is singular, so the verb is singular too: has." },
      { q: "She enjoys ___ stories to her little brother.", options: ["reading", "to read", "read", "reads"], a: "reading",
        why: "After 'enjoy' we use the -ing form." },
      { q: "He decided ___ a new bicycle.", options: ["to buy", "buying", "buy", "bought"], a: "to buy",
        why: "After 'decide' we use to + base verb." },
      { q: "I ___ my homework when the lights went out.", options: ["was doing", "am doing", "do", "have done"], a: "was doing",
        why: "The past continuous shows a longer action in progress when a shorter action interrupted it." }
    ],
    spot: [
      { s: "I have visited Paris last year.", wrong: "have", fix: "I visited Paris last year.",
        why: "'Last year' is a finished time, so we use the simple past, not the present perfect." },
      { s: "She have been waiting for two hours.", wrong: "have", fix: "She has been waiting for two hours.",
        why: "With he, she or it, we use 'has' in the present perfect." },
      { s: "The letter was wrote by my uncle.", wrong: "wrote", fix: "The letter was written by my uncle.",
        why: "The passive needs the past participle: written." },
      { s: "Unless you don't hurry, we will miss the bus.", wrong: "don't", fix: "Unless you hurry, we will miss the bus.",
        why: "'Unless' already means 'if not', so we do not add another negative." },
      { s: "Each of the players have a water bottle.", wrong: "have", fix: "Each of the players has a water bottle.",
        why: "'Each' is singular, so we use 'has'." },
      { s: "She enjoys to swim in the sea.", wrong: "to", fix: "She enjoys swimming in the sea.",
        why: "After 'enjoy' we use the -ing form." },
      { s: "The boy which won the race is my cousin.", wrong: "which", fix: "The boy who won the race is my cousin.",
        why: "Use 'who' for people and 'which' for things." },
      { s: "You should to see a doctor.", wrong: "to", fix: "You should see a doctor.",
        why: "After a modal verb such as should, we use the base verb without 'to'." }
    ],
    build: [
      { s: "I have lived in this town since 2018." },
      { s: "The homework must be finished by Friday." },
      { s: "If it rains tomorrow, we will stay at home.", alt: ["We will stay at home if it rains tomorrow."] },
      { s: "She has never eaten sushi before." },
      { s: "The man who lives next door is a doctor." },
      { s: "My phone was stolen on the bus yesterday.", alt: ["Yesterday my phone was stolen on the bus."] },
      { s: "You should not use your phone in class.", alt: ["In class you should not use your phone."] },
      { s: "They have been practising for two hours." }
    ],
    sort: [
      { title: "Active or passive?", buckets: ["Active", "Passive"],
        items: [["The chef cooked the meal.", "Active"], ["Rain stopped the match.", "Active"], ["Maya painted the wall.", "Active"],
                ["The meal was cooked by the chef.", "Passive"], ["The match was stopped by rain.", "Passive"], ["The wall was painted by Maya.", "Passive"]],
        tip: "In the active voice the doer comes first. In the passive voice the thing that receives the action comes first." },
      { title: "Present perfect or past simple?", buckets: ["Present perfect", "Past simple"],
        items: [["so far", "Present perfect"], ["since Monday", "Present perfect"], ["yet", "Present perfect"], ["ever", "Present perfect"],
                ["yesterday", "Past simple"], ["last year", "Past simple"], ["two days ago", "Past simple"], ["in 2015", "Past simple"]],
        tip: "Finished times like yesterday use the simple past. Words like since, yet and so far go with the present perfect." },
      { title: "Obligation or advice?", buckets: ["Obligation", "Advice"],
        items: [["must", "Obligation"], ["have to", "Obligation"], ["need to", "Obligation"], ["has to", "Obligation"],
                ["should", "Advice"], ["ought to", "Advice"], ["had better", "Advice"], ["shouldn't", "Advice"]],
        tip: "Must and have to show a rule. Should and ought to give advice." },
      { title: "Which pattern follows the verb?", buckets: ["+ verb-ing", "+ to + verb"],
        items: [["enjoy", "+ verb-ing"], ["finish", "+ verb-ing"], ["avoid", "+ verb-ing"], ["mind", "+ verb-ing"],
                ["decide", "+ to + verb"], ["hope", "+ to + verb"], ["want", "+ to + verb"], ["promise", "+ to + verb"]],
        tip: "Enjoy, finish and avoid are followed by -ing. Decide, hope and want are followed by to + verb." }
    ]
  },

  /* ================================ GRADE 9 ================================ */
  9: {
    fill: [
      { q: "Tom said, 'I am hungry.' Tom said that he ___ hungry.", options: ["was", "is", "has been", "will be"], a: "was",
        why: "In reported speech, the present tense usually moves one step back into the past: am becomes was." },
      { q: "Maya said, 'I will help you.' Maya said that she ___ help me.", options: ["would", "will", "can", "shall"], a: "would",
        why: "In reported speech, will usually changes to would." },
      { q: "If I ___ a bird, I would fly across the sea.", options: ["were", "am", "will be", "have been"], a: "were",
        why: "For imaginary situations, we use 'were' after 'if': If I were..." },
      { q: "If she studied harder, she ___ better marks.", options: ["would get", "will get", "gets", "got"], a: "would get",
        why: "Second conditional: if + past simple, then would + base verb." },
      { q: "If I had known, I ___ you.", options: ["would have told", "will tell", "would tell", "told"], a: "would have told",
        why: "Third conditional: if + past perfect, then would have + past participle. It talks about an imaginary past." },
      { q: "The bridge ___ next year.", options: ["will be completed", "will complete", "completes", "is completing"], a: "will be completed",
        why: "The bridge receives the action, so we use the passive: will be + past participle." },
      { q: "The new library ___ at the moment.", options: ["is being built", "is building", "builds", "has built"], a: "is being built",
        why: "Present continuous passive: is or are being + past participle." },
      { q: "I wish I ___ more time to practise.", options: ["had", "have", "has", "will have"], a: "had",
        why: "After 'wish' for an unreal present situation, we use the past simple." },
      { q: "He used to ___ in a small village.", options: ["live", "living", "lived", "lives"], a: "live",
        why: "'Used to' is followed by the base verb." },
      { q: "She is looking forward to ___ you.", options: ["seeing", "see", "saw", "seen"], a: "seeing",
        why: "Here 'to' is a preposition, so the verb after it ends in -ing." },
      { q: "He studied hard; ___, he failed the exam.", options: ["however", "because", "so", "and"], a: "however",
        why: "'However' shows contrast. We usually put a comma after it." },
      { q: "The team lost the match ___ they played well.", options: ["although", "because", "so", "therefore"], a: "although",
        why: "'Although' introduces a surprising contrast: they played well, but still lost." },
      { q: "Neither the teacher nor the students ___ aware of the change.", options: ["were", "was", "is", "has"], a: "were",
        why: "With neither...nor, the verb agrees with the noun nearest to it. 'Students' is plural, so we use 'were'." },
      { q: "By the time we arrived, the film ___.", options: ["had started", "has started", "starts", "was starting"], a: "had started",
        why: "The past perfect shows an action that finished before another action in the past." }
    ],
    spot: [
      { s: "He asked me where do I live.", wrong: "do", fix: "He asked me where I lived.",
        why: "In a reported question, we use normal word order without do or does, and the tense moves back." },
      { s: "If I had known the answer, I would told you.", wrong: "told", fix: "If I had known the answer, I would have told you.",
        why: "The third conditional needs would have + past participle." },
      { s: "The results will announce tomorrow.", wrong: "announce", fix: "The results will be announced tomorrow.",
        why: "The results receive the action, so we use the passive: will be announced." },
      { s: "Despite of the rain, we went for a walk.", wrong: "of", fix: "Despite the rain, we went for a walk.",
        why: "'Despite' is not followed by 'of'. You can say 'despite the rain' or 'in spite of the rain'." },
      { s: "She is looking forward to meet you.", wrong: "meet", fix: "She is looking forward to meeting you.",
        why: "Here 'to' is a preposition, so the next verb ends in -ing." },
      { s: "I wish I know the answer.", wrong: "know", fix: "I wish I knew the answer.",
        why: "After 'wish' for an unreal present situation, we use the past simple." },
      { s: "Everyone have finished their work.", wrong: "have", fix: "Everyone has finished their work.",
        why: "'Everyone' is singular, so we use 'has'." },
      { s: "This website has a lot of informations.", wrong: "informations", fix: "This website has a lot of information.",
        why: "'Information' is uncountable, so it has no plural form." }
    ],
    build: [
      { s: "If I were you, I would apologise to her.", alt: ["I would apologise to her if I were you."] },
      { s: "The stadium is being repaired at the moment.", alt: ["At the moment the stadium is being repaired."] },
      { s: "She said that she had finished her project." },
      { s: "By the time we reached the station, the train had left.", alt: ["The train had left by the time we reached the station."] },
      { s: "He asked me where I had bought my shoes." },
      { s: "Although it was raining, we continued the match.", alt: ["We continued the match although it was raining."] },
      { s: "I wish I had more time to read novels." },
      { s: "She is looking forward to meeting her cousins." }
    ],
    sort: [
      { title: "Direct or reported speech?", buckets: ["Direct speech", "Reported speech"],
        items: [["now", "Direct speech"], ["today", "Direct speech"], ["tomorrow", "Direct speech"], ["here", "Direct speech"],
                ["then", "Reported speech"], ["that day", "Reported speech"], ["the next day", "Reported speech"], ["there", "Reported speech"]],
        tip: "When we report speech, time and place words often change: now becomes then, here becomes there." },
      { title: "Which conditional?", buckets: ["First", "Second", "Third"],
        items: [["If I see him, I will tell him.", "First"], ["If she hurries, she will catch the bus.", "First"],
                ["If I were taller, I would play basketball.", "Second"], ["If he had a car, he would drive to work.", "Second"],
                ["If we had left earlier, we would have caught the train.", "Third"], ["If I had known, I would have helped you.", "Third"]],
        tip: "First conditional: a real future. Second: an imaginary present. Third: an imaginary past." },
      { title: "Contrast, reason or result?", buckets: ["Contrast", "Reason", "Result"],
        items: [["however", "Contrast"], ["although", "Contrast"], ["on the other hand", "Contrast"],
                ["because", "Reason"], ["because of", "Reason"], ["owing to", "Reason"],
                ["therefore", "Result"], ["consequently", "Result"], ["as a result", "Result"]],
        tip: "However shows contrast, because shows a reason, and therefore shows a result." },
      { title: "Formal or informal?", buckets: ["Formal", "Informal"],
        items: [["purchase", "Formal"], ["assist", "Formal"], ["commence", "Formal"], ["inquire", "Formal"],
                ["buy", "Informal"], ["help", "Informal"], ["start", "Informal"], ["ask", "Informal"]],
        tip: "Formal words suit letters and reports. Informal words suit everyday talk." }
    ]
  }
};
