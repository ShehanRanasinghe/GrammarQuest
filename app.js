/* =====================================================================
   GRAMMAR QUEST - game engine
   Plain JavaScript. No libraries, no internet needed.

   How it works (for the developer):
   - QUESTION_BANK (questions.js) holds the data: arrays of objects.
   - buildQueue() picks questions with a Fisher-Yates shuffle and keeps
     them in a first-in-first-out queue, so no question repeats.
   - Each game type has a render function that draws the question and
     calls finishQuestion() with the points earned.
   - Answers are compared as Sets of normalised word sequences, so a
     sentence with more than one correct word order can be accepted.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- small helpers ---------- */

  function $(sel, root) { return (root || document).querySelector(sel); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Build a DOM element: h('div', { class: 'x', text: 'hi', onclick: fn }, [children]) */
  function h(tag, props, kids) {
    const e = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      const v = props[k];
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    });
    [].concat(kids || []).forEach(function (kid) {
      if (kid === null || kid === undefined || kid === false) return;
      e.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    });
    return e;
  }

  /* Fisher-Yates shuffle. Returns a new array. */
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  /* Lower-case a word and strip punctuation, so "Saturday." matches "saturday" */
  function core(token) { return token.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '').toLowerCase(); }
  function wordsKey(sentence) { return sentence.split(' ').map(core).join(' '); }

  /* ---------- constants ---------- */

  const TYPES = ['fill', 'spot', 'build', 'sort'];
  const POINTS = 10;
  const STREAK_AT = 3;
  const STREAK_BONUS = 5;

  const GAMES = {
    fill:  { name: 'Fill the Blank',   blurb: 'Choose the word that completes the sentence.', play: 'Choose the word that completes the sentence.', color: 'var(--sky)',    icon: 'fill' },
    spot:  { name: 'Spot the Mistake', blurb: 'Find and tap the word that is wrong.',          play: 'Find and tap the word that is wrong.',          color: 'var(--pink)',   icon: 'spot' },
    build: { name: 'Sentence Builder', blurb: 'Put the jumbled words in the right order.',     play: 'Tap the words in the right order.',             color: 'var(--mint)',   icon: 'build' },
    sort:  { name: 'Word Sorter',      blurb: 'Send each word to the right basket.',           play: 'Tap a word, then tap its basket.',              color: 'var(--orange)', icon: 'sort' },
    mixed: { name: 'Mixed Challenge',  blurb: 'A little of every game.',                       play: '',                                              color: 'var(--violet)', icon: 'mixed' }
  };

  const GRADE_COLORS = ['var(--sky)', 'var(--mint)', 'var(--orange)', 'var(--pink)'];

  const TEAM_STYLES = [
    { label: 'Red Team',    color: '#FF5C5C', shape: 'circle' },
    { label: 'Blue Team',   color: '#59A8FF', shape: 'square' },
    { label: 'Green Team',  color: '#37D6A0', shape: 'triangle' },
    { label: 'Yellow Team', color: '#FFD84D', shape: 'star' }
  ];

  /* ---------- pictures (inline SVG, so everything works offline) ---------- */

  const INK = '#17214D';
  const G = '<g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">';

  const ICON = {
    penny:
      '<svg viewBox="0 0 64 64" role="img" aria-label="Penny the pencil">' + G +
      '<path d="M22 14h20v32H22z" fill="#FFD84D"/>' +
      '<path d="M22 14V9a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v5z" fill="#FF7EB6"/>' +
      '<path d="M22 46h20l-10 14z" fill="#F3D6A6"/>' +
      '<path d="M28 54.5h8L32 60z" fill="' + INK + '"/></g>' +
      '<circle cx="27.5" cy="27" r="2.6" fill="' + INK + '"/><circle cx="36.5" cy="27" r="2.6" fill="' + INK + '"/>' +
      '<path d="M27 34q5 5 10 0" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="24.5" cy="32.5" r="2" fill="#FF7EB6"/><circle cx="39.5" cy="32.5" r="2" fill="#FF7EB6"/></svg>',

    fill:
      '<svg viewBox="0 0 64 64" aria-hidden="true">' + G +
      '<rect x="5" y="10" width="42" height="42" rx="6" fill="#fff"/><path d="M13 25h26M13 36h12" fill="none"/>' +
      '<path d="M32 57l3-12 16-16 9 9-16 16z" fill="#FFD84D"/><path d="M35 45l9 9" fill="none"/></g></svg>',

    spot:
      '<svg viewBox="0 0 64 64" aria-hidden="true">' + G +
      '<path d="M38 38l17 17" stroke-width="9"/></g>' +
      '<path d="M38 38l17 17" stroke="#FF9A3D" stroke-width="3.5" stroke-linecap="round"/>' + G +
      '<circle cx="26" cy="26" r="17" fill="#fff"/><path d="M17 22a10 10 0 0 1 8-7" fill="none" stroke-width="2.5"/></g></svg>',

    build:
      '<svg viewBox="0 0 64 64" aria-hidden="true">' + G +
      '<rect x="5" y="36" width="25" height="20" rx="4" fill="#59C6FF"/>' +
      '<rect x="34" y="36" width="25" height="20" rx="4" fill="#FFD84D"/>' +
      '<rect x="19" y="9" width="26" height="22" rx="4" fill="#FF7EB6"/></g></svg>',

    sort:
      '<svg viewBox="0 0 64 64" aria-hidden="true">' + G +
      '<path d="M5 34h25l-3 22H8z" fill="#FF7EB6"/><path d="M34 34h25l-3 22H37z" fill="#37D6A0"/>' +
      '<circle cx="17" cy="21" r="7" fill="#FFD84D"/><rect x="40" y="14" width="13" height="13" rx="3" fill="#59C6FF"/></g></svg>',

    mixed:
      '<svg viewBox="0 0 64 64" aria-hidden="true">' + G +
      '<path d="M32 5l8 18 19 2-14 13 4 19-17-10-17 10 4-19L5 25l19-2z" fill="#FFD84D"/></g></svg>',

    trophy:
      '<svg viewBox="0 0 64 64" aria-hidden="true">' + G +
      '<path d="M20 6h24v20a12 12 0 0 1-24 0z" fill="#FFD84D"/>' +
      '<path d="M20 12H9c0 11 5 17 12 17M44 12h11c0 11-5 17-12 17" fill="none"/>' +
      '<path d="M32 38v9"/><path d="M21 58h22v-11H21z" fill="#FF9A3D"/></g></svg>',

    soundOn:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="#fff"/>' +
      '<path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" stroke="#fff" fill="none" stroke-width="2" stroke-linecap="round"/></svg>',

    soundOff:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="#fff"/>' +
      '<path d="M16 9l5 6M21 9l-5 6" stroke="#fff" fill="none" stroke-width="2" stroke-linecap="round"/></svg>',

    expand:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="#fff" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    flame:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-4 3-6 1 2 2 2 3 1 0-3-1-5 0-7z" fill="#FF9A3D" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };

  function shapeSvg(name) {
    const shapes = {
      circle: '<circle cx="12" cy="12" r="6.5"/>',
      square: '<rect x="5.5" y="5.5" width="13" height="13" rx="2"/>',
      triangle: '<path d="M12 4.5l8 14H4z"/>',
      star: '<path d="M12 3l2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L12 17l-5.6 3.2 1.3-6.3L3 9.6l6.3-.7z"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="' + INK + '" aria-hidden="true">' + shapes[name] + '</svg>';
  }

  /* ---------- sound (made with the browser, no audio files) ---------- */

  let audioCtx = null;

  const SOUNDS = {
    good: [[523, 0, 0.14], [659, 0.1, 0.14], [784, 0.2, 0.3]],
    bad:  [[220, 0, 0.18, 'sawtooth', 0.07], [165, 0.15, 0.3, 'sawtooth', 0.07]],
    tap:  [[620, 0, 0.07, 'triangle', 0.1]],
    win:  [[523, 0, 0.15], [659, 0.13, 0.15], [784, 0.26, 0.15], [1047, 0.39, 0.5]]
  };

  function beep(freq, when, dur, type, vol) {
    const t0 = audioCtx.currentTime + when;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  function play(name) {
    if (!state.sound) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      SOUNDS[name].forEach(function (n) { beep(n[0], n[1], n[2], n[3], n[4]); });
    } catch (e) { /* sound is a bonus, never a problem */ }
  }

  /* ---------- state ---------- */

  const state = {
    sound: true,
    setup: { step: 1, grade: null, mode: null, teamCount: 2, names: [], rounds: 10 },
    game: null
  };

  function loadPrefs() {
    try { if (localStorage.getItem('grammar-quest-sound') === 'off') state.sound = false; } catch (e) { /* ignore */ }
  }
  function savePrefs() {
    try { localStorage.setItem('grammar-quest-sound', state.sound ? 'on' : 'off'); } catch (e) { /* ignore */ }
  }

  /* ---------- building the list of questions ---------- */

  function isUsable(type, data) {
    return typeof gqCheckItem !== 'function' || gqCheckItem(type, data) === '';
  }

  function buildQueue(grade, mode, rounds) {
    const bank = QUESTION_BANK[grade];
    const pools = {};
    TYPES.forEach(function (t) {
      pools[t] = shuffle((bank[t] || []).filter(function (d) { return isUsable(t, d); }));
    });

    const queue = [];
    if (mode === 'mixed') {
      let turn = 0, guard = 0;
      while (queue.length < rounds && guard++ < 500) {
        const type = TYPES[turn++ % TYPES.length];
        if (pools[type].length) queue.push({ type: type, data: pools[type].shift() });
      }
    } else {
      pools[mode].slice(0, rounds).forEach(function (d) { queue.push({ type: mode, data: d }); });
    }
    return queue;
  }

  /* ---------- top bar ---------- */

  function updateSoundButton() {
    const b = $('#btn-sound');
    b.innerHTML = state.sound ? ICON.soundOn : ICON.soundOff;
    b.setAttribute('aria-label', state.sound ? 'Turn sound off' : 'Turn sound on');
  }

  function bindTopbar() {
    $('#brand-mark').innerHTML = ICON.penny;
    $('#btn-full').innerHTML = ICON.expand;
    updateSoundButton();

    $('#btn-sound').addEventListener('click', function () {
      state.sound = !state.sound;
      savePrefs();
      updateSoundButton();
      play('tap');
    });

    $('#btn-full').addEventListener('click', function () {
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      } catch (e) { /* not every board allows it */ }
    });

    $('#btn-home').addEventListener('click', function () {
      if (state.game && !state.game.finished && !window.confirm('Leave this game and go back to the start?')) return;
      state.setup.step = 1;
      renderHome();
    });

    document.addEventListener('keydown', function (e) {
      if (state.game && state.game.keyHandler) state.game.keyHandler(e);
    });
  }

  /* =====================================================================
     START SCREENS
     ===================================================================== */

  function renderHome() {
    state.game = null;
    const s = state.setup;
    const steps = ['Grade', 'Game', 'Teams'];

    const stepper = h('ol', { class: 'stepper' }, steps.map(function (label, i) {
      const cls = i + 1 === s.step ? 'now' : (i + 1 < s.step ? 'done' : '');
      return h('li', { class: cls }, [h('span', { text: String(i + 1) }), label]);
    }));

    const body = s.step === 1 ? gradeStep() : s.step === 2 ? gameStep() : teamStep();
    const screen = $('#screen');
    screen.innerHTML = '';
    screen.appendChild(h('section', { class: 'home' }, [stepper, body]));
    screen.scrollTop = 0;
  }

  function stepHead(title, sub) {
    return h('div', { class: 'step-head' }, [
      h('div', {}, [h('h1', { class: 'step-title', text: title }), sub ? h('p', { class: 'step-sub', text: sub }) : null]),
      h('div', { class: 'mascot', html: ICON.penny })
    ]);
  }

  function gradeStep() {
    const s = state.setup;
    const tiles = h('div', { class: 'tiles grades' }, [6, 7, 8, 9].map(function (g, i) {
      const info = GRADE_INFO[g];
      return h('button', {
        class: 'tile', type: 'button', style: '--tile:' + GRADE_COLORS[i],
        onclick: function () { s.grade = g; s.step = 2; play('tap'); renderHome(); }
      }, [
        h('span', { class: 'big-num', text: String(g) }),
        h('span', { class: 'tile-title', text: info.label }),
        h('span', { class: 'tile-sub', text: info.ages }),
        h('span', { class: 'tile-note', text: info.topics })
      ]);
    }));
    return h('div', { class: 'step' }, [stepHead('Which grade is playing?', 'Questions match what each grade learns.'), tiles]);
  }

  function gameStep() {
    const s = state.setup;
    const order = ['fill', 'spot', 'build', 'sort', 'mixed'];
    const tiles = h('div', { class: 'tiles games' }, order.map(function (key) {
      const g = GAMES[key];
      return h('button', {
        class: 'tile', type: 'button', style: '--tile:' + g.color,
        onclick: function () { s.mode = key; s.step = 3; play('tap'); renderHome(); }
      }, [
        h('span', { class: 'tile-icon', html: ICON[g.icon] }),
        h('span', { class: 'tile-title', text: g.name }),
        h('span', { class: 'tile-note', text: g.blurb })
      ]);
    }));
    const back = h('div', { class: 'actions' }, [
      h('button', { class: 'btn ghost', type: 'button', text: 'Back', onclick: function () { s.step = 1; renderHome(); } })
    ]);
    return h('div', { class: 'step' }, [stepHead('Pick a game', GRADE_INFO[s.grade].label + ' is playing.'), tiles, back]);
  }

  function defaultTeamName(i, count) {
    return count === 1 ? 'Our Class' : TEAM_STYLES[i].label;
  }

  function teamStep() {
    const s = state.setup;
    const count = s.teamCount;

    function seg(options, current, onPick) {
      return h('div', { class: 'seg' }, options.map(function (o) {
        return h('button', {
          type: 'button', text: o.label, 'aria-pressed': String(o.value === current),
          onclick: function () { onPick(o.value); }
        });
      }));
    }

    const teamsSeg = seg(
      [{ label: 'Whole class', value: 1 }, { label: '2 teams', value: 2 }, { label: '3 teams', value: 3 }, { label: '4 teams', value: 4 }],
      count, function (v) { s.teamCount = v; renderHome(); }
    );

    const names = h('div', { class: 'names' }, TEAM_STYLES.slice(0, count).map(function (t, i) {
      const input = h('input', {
        type: 'text', maxlength: '18', value: s.names[i] || '',
        placeholder: defaultTeamName(i, count), 'aria-label': 'Name for team ' + (i + 1)
      });
      input.addEventListener('input', function () { s.names[i] = input.value; });
      return h('label', { class: 'name-field' }, [
        h('span', { class: 'swatch', style: '--tc:' + t.color, html: shapeSvg(t.shape) }),
        input
      ]);
    }));

    const roundsGroup = s.mode === 'sort'
      ? h('div', { class: 'group' }, [
          h('p', { class: 'field-label', text: 'How many rounds?' }),
          h('p', { class: 'field-note', text: 'Word Sorter has 4 rounds for each grade.' })
        ])
      : h('div', { class: 'group' }, [
          h('p', { class: 'field-label', text: 'How many questions?' }),
          seg([{ label: '5 questions', value: 5 }, { label: '10 questions', value: 10 }], s.rounds, function (v) { s.rounds = v; renderHome(); })
        ]);

    const panelParts = [
      h('div', { class: 'row' }, [
        h('div', { class: 'group' }, [h('p', { class: 'field-label', text: 'How many teams?' }), teamsSeg]),
        roundsGroup
      ]),
      h('div', { class: 'group' }, [
        h('p', { class: 'field-label', text: 'Team names (optional)' }),
        names,
        h('p', { class: 'field-note', text: 'Teams take turns, one question each.' })
      ])
    ];

    const actions = h('div', { class: 'actions' }, [
      h('button', { class: 'btn ghost', type: 'button', text: 'Back', onclick: function () { s.step = 2; renderHome(); } }),
      h('button', { class: 'btn primary big', type: 'button', text: 'Start game', onclick: startGame })
    ]);

    return h('div', { class: 'step' }, [
      stepHead('Who is playing?', GRADE_INFO[s.grade].label + ', ' + GAMES[s.mode].name + '.'),
      h('div', { class: 'panel' }, panelParts),
      actions
    ]);
  }

  /* =====================================================================
     PLAYING
     ===================================================================== */

  function startGame() {
    const s = state.setup;
    const teams = TEAM_STYLES.slice(0, s.teamCount).map(function (t, i) {
      return {
        name: (s.names[i] || '').trim() || defaultTeamName(i, s.teamCount),
        color: t.color, shape: t.shape, score: 0, streak: 0, perfect: 0
      };
    });
    const queue = buildQueue(s.grade, s.mode, s.rounds);
    if (!queue.length) {
      window.alert('There are no usable questions for this choice. Open check-questions.html to see what is wrong.');
      return;
    }
    state.game = { queue: queue, index: 0, teams: teams, locked: false, awaitNext: false, finished: false, keyHandler: null };
    play('tap');
    renderPlayShell();
    showQuestion();
  }

  function currentTeam() {
    const g = state.game;
    return g.teams[g.index % g.teams.length];
  }

  function renderPlayShell() {
    const screen = $('#screen');
    screen.innerHTML =
      '<section class="play">' +
      '<div class="topline"><div class="scoreboard" id="scoreboard" aria-live="polite"></div><div id="turn"></div></div>' +
      '<div class="hud" id="hud"></div>' +
      '<div class="stage" id="stage"></div>' +
      '<div class="feedback" id="feedback" hidden></div>' +
      '</section>';
  }

  function updateScoreboard(popIndex) {
    const g = state.game;
    const activeIndex = g.index % g.teams.length;
    $('#scoreboard').innerHTML = g.teams.map(function (t, i) {
      const classes = 'team' + (g.teams.length > 1 && i === activeIndex ? ' active' : '') + (i === popIndex ? ' pop' : '');
      return '<div class="' + classes + '" style="--tc:' + t.color + '">' +
        '<span class="swatch" style="--tc:' + t.color + '">' + shapeSvg(t.shape) + '</span>' +
        '<span class="tname">' + esc(t.name) + '</span>' +
        (t.streak >= 2 ? '<span class="streak" title="Streak">' + ICON.flame + t.streak + '</span>' : '') +
        '<span class="score">' + t.score + '</span></div>';
    }).join('');
  }

  function updateHud() {
    const g = state.game;
    const item = g.queue[g.index];
    const game = GAMES[item.type];
    const team = currentTeam();
    const dots = g.queue.map(function (_, i) {
      return '<span class="' + (i < g.index ? 'done' : i === g.index ? 'now' : '') + '"></span>';
    }).join('');
    $('#hud').innerHTML =
      '<div class="dots" role="img" aria-label="Question ' + (g.index + 1) + ' of ' + g.queue.length + '">' + dots + '</div>' +
      '<span class="qcount">Question ' + (g.index + 1) + ' of ' + g.queue.length + '</span>' +
      '<span class="kind" style="--tile:' + game.color + '"><span class="kind-icon">' + ICON[game.icon] + '</span>' + esc(game.name) + '</span>' +
      '<span class="hint">' + esc(game.play) + '</span>';
    $('#turn').innerHTML = g.teams.length > 1
      ? '<span class="turn" style="--tc:' + team.color + '">' + esc(team.name) + ', it is your turn</span>' : '';
  }

  function showQuestion() {
    const g = state.game;
    g.locked = false;
    g.awaitNext = false;
    g.keyHandler = null;
    $('#feedback').hidden = true;
    updateScoreboard(-1);
    updateHud();
    const stage = $('#stage');
    stage.innerHTML = '';
    stage.className = 'stage';          // clear the "locked" flag left by the previous question
    stage.scrollTop = 0;
    const item = g.queue[g.index];
    RENDERERS[item.type](stage, item.data);
  }

  /* Called by every game when the team has finished a question. */
  function finishQuestion(result) {
    const g = state.game;
    g.locked = true;
    const team = currentTeam();
    const points = result.points;
    let bonus = 0;

    if (points === POINTS) {
      team.streak++;
      team.perfect++;
      if (team.streak >= STREAK_AT) bonus = STREAK_BONUS;
    } else {
      team.streak = 0;
    }
    team.score += points + bonus;

    const kind = points === POINTS ? 'good' : points > 0 ? 'mid' : 'bad';
    play(kind === 'good' ? 'good' : kind === 'mid' ? 'tap' : 'bad');
    updateScoreboard(g.index % g.teams.length);

    const title = kind === 'good' ? pick(['Correct!', 'Well done!', 'Spot on!', 'Great work!'])
                : kind === 'mid' ? 'Good try!' : pick(['Not this time.', 'Not quite.']);
    const pts = '+' + (points + bonus) + ' points' + (bonus ? ' (includes a ' + bonus + ' point streak bonus)' : '');
    const last = g.index === g.queue.length - 1;

    const fb = $('#feedback');
    fb.className = 'feedback ' + kind;
    fb.innerHTML = '';
    const btn = h('button', {
      class: 'btn primary big', type: 'button', text: last ? 'See results' : 'Next question', onclick: goNext
    });
    fb.appendChild(h('div', { class: 'fb-body' }, [
      h('h2', { class: 'fb-title' }, [title, h('span', { class: 'fb-pts', text: pts })]),
      h('p', { class: 'fb-text', text: result.detail })
    ]));
    fb.appendChild(btn);
    fb.hidden = false;
    g.awaitNext = true;
    btn.focus();
    g.keyHandler = function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    };
    fb.scrollIntoView({ block: 'nearest' });
  }

  function goNext() {
    const g = state.game;
    if (!g || !g.awaitNext) return;      // ignore a second press
    g.awaitNext = false;
    g.index++;
    if (g.index >= g.queue.length) { renderResults(); return; }
    showQuestion();
  }

  /* ---------- game 1: Fill the Blank ---------- */

  function renderFill(stage, q) {
    const g = state.game;
    const parts = q.q.split('___');
    const blank = h('span', { class: 'blank', html: '&nbsp;' });
    stage.appendChild(h('div', { class: 'card' }, h('p', { class: 'prompt' }, [parts[0], blank, parts[1] || ''])));

    const colors = ['var(--sky)', 'var(--yellow)', 'var(--pink)', 'var(--mint)'];
    const wrap = h('div', { class: 'options' });
    const buttons = shuffle(q.options).map(function (opt, i) {
      const b = h('button', { class: 'opt', type: 'button', style: '--oc:' + colors[i % 4], 'data-opt': opt }, [
        h('span', { class: 'key', text: String(i + 1) }),
        h('span', { text: opt })
      ]);
      b.addEventListener('click', function () { choose(b, opt); });
      wrap.appendChild(b);
      return b;
    });
    stage.appendChild(wrap);

    function choose(btn, opt) {
      if (g.locked) return;
      const ok = opt === q.a;
      wrap.classList.add('locked');
      blank.textContent = q.a;
      blank.classList.add('filled');
      buttons.forEach(function (b) {
        if (b.getAttribute('data-opt') === q.a) b.classList.add('good');
        else if (b === btn) b.classList.add('bad');
        else b.classList.add('dim');
      });
      finishQuestion({ points: ok ? POINTS : 0, detail: (ok ? '' : 'The answer is "' + q.a + '". ') + q.why });
    }

    g.keyHandler = function (e) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= buttons.length) buttons[n - 1].click();
    };
  }

  /* ---------- game 2: Spot the Mistake ---------- */

  function renderSpot(stage, q) {
    const g = state.game;
    const tokens = q.s.split(' ');
    const wrongIndex = tokens.findIndex(function (t) { return core(t) === q.wrong.toLowerCase(); });
    const sentence = h('div', { class: 'card sentence' });
    const chips = tokens.map(function (t, i) {
      const c = h('button', { class: 'chip big', type: 'button', text: t });
      c.addEventListener('click', function () { choose(i); });
      sentence.appendChild(c);
      return c;
    });
    stage.appendChild(sentence);

    function choose(i) {
      if (g.locked) return;
      const ok = i === wrongIndex;
      sentence.classList.add('locked');
      if (ok) chips[wrongIndex].classList.add('right');
      else { chips[i].classList.add('wrong'); chips[wrongIndex].classList.add('target'); }
      finishQuestion({ points: ok ? POINTS : 0, detail: 'Correct sentence: ' + q.fix + ' ' + q.why });
    }
  }

  /* ---------- game 3: Sentence Builder ---------- */

  function renderBuild(stage, q) {
    const g = state.game;
    const words = q.s.split(' ');
    const accepted = new Set([q.s].concat(q.alt || []).map(wordsKey));   // a Set of normalised sentences

    let order = words.map(function (_, i) { return i; });
    for (let t = 0; t < 12; t++) {
      order = shuffle(order);
      if (order.some(function (v, i) { return v !== i; })) break;       // never start already solved
    }
    const placed = [];
    let attempts = 0;

    const tray = h('div', { class: 'tray', 'data-empty': 'Your sentence appears here.' });
    const bank = h('div', { class: 'bank' });
    const msg = h('span', { class: 'hint-msg' });
    const checkBtn = h('button', { class: 'btn primary big', type: 'button', text: 'Check my sentence', onclick: check });
    const resetBtn = h('button', { class: 'btn ghost', type: 'button', text: 'Start again', onclick: function () {
      if (g.locked) return;
      placed.length = 0; msg.textContent = ''; draw();
    } });
    stage.appendChild(tray);
    stage.appendChild(bank);
    stage.appendChild(h('div', { class: 'build-actions' }, [checkBtn, resetBtn, msg]));

    function chip(id, inTray) {
      const c = h('button', { class: 'chip', type: 'button', text: words[id] });
      c.addEventListener('click', function () {
        if (g.locked) return;
        if (inTray) placed.splice(placed.indexOf(id), 1); else placed.push(id);
        msg.textContent = '';
        play('tap');
        draw();
      });
      return c;
    }

    function draw() {
      tray.innerHTML = '';
      bank.innerHTML = '';
      placed.forEach(function (id) { tray.appendChild(chip(id, true)); });
      order.filter(function (id) { return placed.indexOf(id) === -1; })
           .forEach(function (id) { bank.appendChild(chip(id, false)); });
      checkBtn.disabled = placed.length !== words.length || g.locked;
      resetBtn.disabled = placed.length === 0 || g.locked;
    }

    function lockBuild() {
      stage.classList.add('locked');
      checkBtn.disabled = true;
      resetBtn.disabled = true;
    }

    function check() {
      if (g.locked) return;
      const answer = placed.map(function (id) { return words[id]; }).join(' ');
      if (accepted.has(wordsKey(answer))) {
        tray.classList.add('ok');
        lockBuild();
        finishQuestion({
          points: attempts === 0 ? POINTS : 5,
          detail: (attempts === 0 ? 'Your sentence: ' : 'Right on the second try. The sentence is: ') + q.s
        });
        return;
      }
      attempts++;
      if (attempts < 2) {
        msg.textContent = 'Not quite. Change the word order and try once more.';
        tray.classList.remove('shake');
        void tray.offsetWidth;                 // restart the shake animation
        tray.classList.add('shake');
        play('bad');
      } else {
        tray.classList.add('bad');
        lockBuild();
        finishQuestion({ points: 0, detail: 'The correct sentence is: ' + q.s });
      }
    }

    draw();
  }

  /* ---------- game 4: Word Sorter ---------- */

  function renderSort(stage, q) {
    const g = state.game;
    const colors = ['var(--sky)', 'var(--pink)', 'var(--mint)', 'var(--yellow)'];
    const items = shuffle(q.items.map(function (it, i) { return { id: i, word: it[0], bucket: it[1] }; }));
    const remaining = new Set(items.map(function (it) { return it.id; }));
    const firstTry = new Map();                 // word id -> was it right the first time?
    let selected = null;
    let shakeId = null;

    stage.appendChild(h('h2', { class: 'sort-title', text: q.title }));
    const pool = h('div', { class: 'pool' });
    stage.appendChild(pool);

    const baskets = h('div', { class: 'baskets', style: '--cols:' + q.buckets.length });
    const basketEls = q.buckets.map(function (name, bi) {
      const placedBox = h('span', { class: 'placed' });
      const b = h('button', { class: 'basket', type: 'button', style: '--bc:' + colors[bi % 4] }, [
        h('span', { class: 'basket-name', text: name }), placedBox
      ]);
      b.addEventListener('click', function () { drop(bi); });
      baskets.appendChild(b);
      return { el: b, placed: placedBox };
    });
    stage.appendChild(baskets);

    function drawPool() {
      pool.innerHTML = '';
      items.filter(function (it) { return remaining.has(it.id); }).forEach(function (it) {
        const cls = 'chip' + (selected === it.id ? ' sel' : '') + (shakeId === it.id ? ' wrong' : '');
        const c = h('button', { class: cls, type: 'button', text: it.word });
        c.addEventListener('click', function () {
          if (g.locked) return;
          selected = selected === it.id ? null : it.id;
          shakeId = null;
          play('tap');
          drawPool();
        });
        pool.appendChild(c);
      });
    }

    function drop(bi) {
      if (g.locked || selected === null) return;
      const it = items.filter(function (x) { return x.id === selected; })[0];
      if (it.bucket === q.buckets[bi]) {
        if (!firstTry.has(it.id)) firstTry.set(it.id, true);
        remaining.delete(it.id);
        basketEls[bi].placed.appendChild(h('span', { class: 'mini', text: it.word }));
        selected = null;
        shakeId = null;
        play('tap');
        drawPool();
        if (remaining.size === 0) done();
      } else {
        firstTry.set(it.id, false);
        shakeId = it.id;
        selected = null;
        play('bad');
        drawPool();
        const el = basketEls[bi].el;
        el.classList.add('nope');
        setTimeout(function () { el.classList.remove('nope'); }, 450);
      }
    }

    function done() {
      let right = 0;
      firstTry.forEach(function (v) { if (v) right++; });
      const points = Math.round(POINTS * right / items.length);
      stage.classList.add('locked');
      finishQuestion({
        points: points,
        detail: 'You placed ' + right + ' of ' + items.length + ' words correctly on the first try. ' + q.tip
      });
    }

    drawPool();
  }

  const RENDERERS = { fill: renderFill, spot: renderSpot, build: renderBuild, sort: renderSort };

  /* =====================================================================
     RESULTS
     ===================================================================== */

  function confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#FFD84D', '#FF7EB6', '#37D6A0', '#59C6FF', '#FF9A3D', '#9A82FF'];
    const box = h('div', { class: 'confetti', 'aria-hidden': 'true' });
    for (let i = 0; i < 70; i++) {
      const p = h('i');
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (2.4 + Math.random() * 2) + 's';
      p.style.animationDelay = (Math.random() * 0.8) + 's';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 5600);
  }

  function renderResults() {
    const g = state.game;
    g.finished = true;
    g.keyHandler = null;

    const ranked = g.teams.slice().sort(function (a, b) { return b.score - a.score; });
    const top = ranked[0].score;
    const winners = ranked.filter(function (t) { return t.score === top; });
    const maxPossible = g.queue.length * POINTS;

    let title, lead;
    if (g.teams.length === 1) {
      const ratio = top / maxPossible;
      title = ratio >= 0.8 ? 'Outstanding work!' : ratio >= 0.5 ? 'Great effort!' : 'Good practice!';
      lead = 'Your class scored ' + top + ' points with ' + g.teams[0].perfect + ' of ' + g.queue.length + ' answered perfectly.';
    } else if (winners.length === 1) {
      title = winners[0].name + ' wins!';
      lead = 'Final score: ' + top + ' points. Every team learned something today.';
    } else {
      title = 'It is a tie!';
      lead = winners.map(function (t) { return t.name; }).join(' and ') + ' both scored ' + top + ' points.';
    }

    const rows = ranked.map(function (t) {
      const width = top > 0 ? Math.max(4, Math.round(100 * t.score / top)) : 4;
      return h('div', { class: 'rank-row', style: '--tc:' + t.color }, [
        h('span', { class: 'swatch', style: '--tc:' + t.color, html: shapeSvg(t.shape) }),
        h('span', { class: 'rank-name', text: t.name }),
        h('div', { class: 'rank-bar' }, h('i', { style: 'width:' + width + '%' })),
        h('span', { class: 'rank-score', text: String(t.score) })
      ]);
    });

    const s = state.setup;
    const screen = $('#screen');
    screen.innerHTML = '';
    screen.scrollTop = 0;
    screen.appendChild(h('section', { class: 'results' }, [
      h('div', { class: 'trophy', html: ICON.trophy }),
      h('h1', { text: title }),
      h('p', { class: 'lead', text: lead }),
      h('div', { class: 'ranking' }, rows),
      h('div', { class: 'actions' }, [
        h('button', { class: 'btn primary big', type: 'button', text: 'Play again', onclick: startGame }),
        h('button', { class: 'btn', type: 'button', text: 'Choose another game', onclick: function () { s.step = 2; renderHome(); } }),
        h('button', { class: 'btn ghost', type: 'button', text: 'Start over', onclick: function () { s.step = 1; renderHome(); } })
      ])
    ]));

    play('win');
    if (g.teams.length > 1 || top / maxPossible >= 0.5) confetti();
  }

  /* ---------- start ---------- */

  function init() {
    loadPrefs();
    bindTopbar();
    if (typeof QUESTION_BANK === 'undefined' || typeof GRADE_INFO === 'undefined') {
      $('#screen').innerHTML = '<p class="notice">The questions file (questions.js) could not be read. ' +
        'Please put back the last working copy, or ask for help.</p>';
      return;
    }
    renderHome();
  }

  init();
})();
