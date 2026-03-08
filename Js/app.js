let step = 1;
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dateRdv').min = today;
  document.getElementById('ddn').max = today;

  function setStep(n) {
    // hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const sec = document.getElementById('sec' + n);
    if (sec) sec.classList.add('active');

    // stepper
    for (let i = 1; i <= 4; i++) {
      const sp = document.getElementById('sp' + i);
      sp.classList.remove('active', 'done');
      if (i < n) sp.classList.add('done');
      else if (i === n) sp.classList.add('active');
    }

    // nav
    document.getElementById('btnBack').style.visibility = n === 1 ? 'hidden' : 'visible';
    document.getElementById('stepCount').textContent = `Étape ${n} sur 4`;

    const nb = document.getElementById('btnNext');
    if (n === 4) {
      nb.textContent = 'Confirmer le rendez-vous';
      nb.className = 'btn btn-submit';
    } else {
      nb.textContent = 'Continuer →';
      nb.className = 'btn btn-primary';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validate(n) {
    let ok = true;

    const clr = id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('err');
      const em = document.getElementById('e-' + id);
      if (em) em.classList.remove('show');
    };

    const fail = (id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('err');
      const em = document.getElementById('e-' + id);
      if (em) em.classList.add('show');
      ok = false;
    };

    if (n === 1) {
      ['prenom','nom','ddn','tel','email'].forEach(clr);
      if (!document.getElementById('prenom').value.trim()) fail('prenom');
      if (!document.getElementById('nom').value.trim()) fail('nom');
      if (!document.getElementById('ddn').value) fail('ddn');
      if (document.getElementById('tel').value.replace(/\D/g,'').length < 9) fail('tel');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value)) fail('email');
    }

    if (n === 3) {
      clr('date'); clr('heure');
      if (!document.getElementById('dateRdv').value) fail('date');
      if (!document.querySelector('input[name="heure"]:checked')) {
        document.getElementById('e-heure').classList.add('show');
        ok = false;
      } else {
        document.getElementById('e-heure').classList.remove('show');
      }
    }

    if (n === 4) {
      const c = document.getElementById('consent');
      const ce = document.getElementById('e-consent');
      if (!c.checked) { ce.classList.add('show'); ok = false; }
      else ce.classList.remove('show');
    }

    return ok;
  }

  function buildRecap() {
    const g = id => document.getElementById(id)?.value || '—';
    const r = name => document.querySelector(`input[name="${name}"]:checked`)?.value || '—';
    const fmtDate = d => {
      if (!d) return '—';
      const dt = new Date(d + 'T00:00:00');
      return dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const rows = [
      ['Patient', `${g('prenom')} ${g('nom')}`],
      ['Date de naissance', g('ddn') ? new Date(g('ddn')+'T00:00:00').toLocaleDateString('fr-FR') : '—'],
      ['Téléphone', g('tel')],
      ['E-mail', g('email')],
      ['Type', r('typePatient')],
      ['Motif', r('motif')],
      ['Œil concerné', r('oeil')],
      ['Médecin', g('medecin') || 'Pas de préférence'],
      ['Date du RDV', fmtDate(g('dateRdv'))],
      ['Horaire', r('heure')],
    ];

    document.getElementById('recap').innerHTML = rows.map(([k, v]) =>
      `<div class="sum-row"><span class="sum-k">${k}</span><span class="sum-v">${v}</span></div>`
    ).join('');

    // Prefill success screen
    document.getElementById('conf-nom').textContent = `👤 ${g('prenom')} ${g('nom')}`;
    document.getElementById('conf-motif').textContent = `🏥 ${r('motif')}`;
    document.getElementById('conf-dt').textContent = `📅 ${fmtDate(g('dateRdv'))} à ${r('heure')}`;
  }

  function next() {
    if (!validate(step)) return;
    if (step === 3) buildRecap();
    if (step < 4) { step++; setStep(step); }
    else submitForm();
  }

  function prev() {
    if (step > 1) { step--; setStep(step); }
  }

  function submitForm() {
    // Hide nav and form, show success
    document.getElementById('stickyNav').style.display = 'none';
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('successScreen').classList.add('show');

    // Update stepper all done
    for (let i = 1; i <= 4; i++) {
      const sp = document.getElementById('sp' + i);
      sp.classList.remove('active');
      sp.classList.add('done');
    }
  }

  function resetForm() {
    step = 1;
    document.getElementById('successScreen').classList.remove('show');
    document.getElementById('stickyNav').style.display = 'flex';
    document.querySelectorAll('input[type=text], input[type=email], input[type=tel], input[type=date], textarea')
      .forEach(el => el.value = '');
    document.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
    document.querySelectorAll('input[type=checkbox]').forEach(c => c.checked = false);
    document.getElementById('tp-new').checked = true;
    document.getElementById('m1').checked = true;
    document.getElementById('o1').checked = true;
    document.getElementById('r1').checked = true;
    setStep(1);
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('sec1').classList.add('active');
  }

  setStep(1);