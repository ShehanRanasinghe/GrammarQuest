/* Grammar Quest - question checker.
   Used by the game (to skip broken questions) and by check-questions.html
   (to tell the teacher in plain words what is wrong). */

function gqCore(token) {
  return token.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '').toLowerCase();
}

/* Returns '' when the question is fine, otherwise a plain-English problem. */
function gqCheckItem(type, d) {
  if (!d || typeof d !== 'object') return 'This question is empty or broken.';

  if (type === 'fill') {
    if (typeof d.q !== 'string' || d.q.split('___').length !== 2) return 'The sentence (q) needs exactly one blank, written as three underscores ___';
    if (!Array.isArray(d.options) || d.options.length < 2) return 'The options list needs at least 2 choices.';
    if (new Set(d.options).size !== d.options.length) return 'Two of the options are exactly the same.';
    if (d.options.indexOf(d.a) === -1) return 'The correct answer (a) is not one of the options. Check the spelling.';
    if (!d.why) return 'The explanation (why) is missing.';
    return '';
  }

  if (type === 'spot') {
    if (typeof d.s !== 'string' || d.s.trim() === '') return 'The sentence (s) is missing.';
    if (typeof d.wrong !== 'string' || d.wrong === '') return 'The wrong word (wrong) is missing.';
    const hits = d.s.split(' ').filter(function (t) { return gqCore(t) === d.wrong.toLowerCase(); }).length;
    if (hits === 0) return 'The wrong word "' + d.wrong + '" cannot be found in the sentence.';
    if (hits > 1) return 'The wrong word "' + d.wrong + '" appears more than once in the sentence. Pick a sentence where it appears once.';
    if (!d.fix) return 'The corrected sentence (fix) is missing.';
    if (!d.why) return 'The explanation (why) is missing.';
    return '';
  }

  if (type === 'build') {
    if (typeof d.s !== 'string') return 'The sentence (s) is missing.';
    const words = d.s.split(' ');
    if (words.length < 3) return 'The sentence needs at least 3 words.';
    if (d.alt !== undefined) {
      if (!Array.isArray(d.alt)) return 'alt must be a list of sentences in square brackets.';
      /* Capital letters and full stops move when a sentence is reordered,
         so the words are compared without them. */
      const key = words.map(gqCore).sort().join(' ');
      for (let i = 0; i < d.alt.length; i++) {
        if (typeof d.alt[i] !== 'string' || d.alt[i].split(' ').map(gqCore).sort().join(' ') !== key) {
          return 'One of the alt sentences does not use exactly the same words as the main sentence.';
        }
      }
    }
    return '';
  }

  if (type === 'sort') {
    if (!d.title) return 'The title is missing.';
    if (!Array.isArray(d.buckets) || d.buckets.length < 2 || d.buckets.length > 4) return 'Use 2 to 4 baskets (buckets).';
    if (!Array.isArray(d.items) || d.items.length < 4) return 'Add at least 4 words (items).';
    const seen = {};
    const used = {};
    for (let i = 0; i < d.items.length; i++) {
      const it = d.items[i];
      if (!Array.isArray(it) || it.length !== 2) return 'Each item must look like ["word", "basket name"].';
      if (d.buckets.indexOf(it[1]) === -1) return 'The word "' + it[0] + '" uses a basket name that is not in the buckets list.';
      if (seen[it[0]]) return 'The word "' + it[0] + '" appears twice.';
      seen[it[0]] = true;
      used[it[1]] = true;
    }
    for (let j = 0; j < d.buckets.length; j++) {
      if (!used[d.buckets[j]]) return 'The basket "' + d.buckets[j] + '" has no words.';
    }
    if (!d.tip) return 'The tip is missing.';
    return '';
  }

  return 'Unknown question type "' + type + '".';
}

/* Checks the whole bank. Returns { count, problems: [{grade, type, number, message}] } */
function gqCheckBank(bank) {
  const out = { count: 0, problems: [] };
  const types = ['fill', 'spot', 'build', 'sort'];
  Object.keys(bank).forEach(function (grade) {
    types.forEach(function (type) {
      const list = bank[grade][type];
      if (!Array.isArray(list) || list.length === 0) {
        out.problems.push({ grade: grade, type: type, number: 0, message: 'This grade has no "' + type + '" questions.' });
        return;
      }
      list.forEach(function (d, i) {
        out.count++;
        const msg = gqCheckItem(type, d);
        if (msg) out.problems.push({ grade: grade, type: type, number: i + 1, message: msg });
      });
    });
  });
  return out;
}
