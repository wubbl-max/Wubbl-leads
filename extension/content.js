(function(){
  if(window.__qap_active)return;
  window.__qap_active=true;

  // Inject styles
  var s=document.createElement('style');
  s.textContent=[
    '.__qap_chip{position:fixed;z-index:2147483647;display:none;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#0077b5;color:white;font-size:22px;font-weight:700;cursor:pointer;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.4);font-family:sans-serif;line-height:1;pointer-events:all}',
    '.__qap_chip:hover{background:#005f8e}',
    // Highlight the detected post on hover
    '.__qap_highlight{outline:2px solid #0077b5 !important;outline-offset:2px !important}'
  ].join('');
  document.head.appendChild(s);

  // ICP scoring rules
  var RULES={
    a:{w:25,kw:['looking for','need a designer','hiring','design hire','ux designer','ui designer','product designer','design agency','branding agency','website design','web design']},
    b:{w:20,kw:['raised','seed','series a','series b','funding','closed our','announcing our']},
    c:{w:15,kw:['founder','ceo','cto','co-founder','chief','president']},
    d:{w:15,kw:['saas','fintech','b2b','startup','software']},
    e:{w:10,kw:['rebrand','redesign','new website','brand refresh','visual identity','webflow','framer','logo','brand identity']},
    f:{w:10,kw:['london','singapore','switzerland','germany','zurich','berlin','frankfurt','dubai']},
    g:{w:5,kw:['struggling','no designer','without a designer','not converting','bounce rate','churn','need help']}
  };
  // Phrases that indicate the poster IS a designer seeking work — skip these
  var NOISE=[
    'i am looking for','i\'m looking for','i am seeking','i\'m seeking',
    'open to work','opentowork','open to new opportunities','open to opportunities',
    'seeking a new role','seeking new opportunities','looking for my next role',
    'looking for new opportunities','available for work','available for hire',
    'available for freelance','hire me','looking for work','job search',
    '#opentowork','portfolio','my work','my design','i designed','i created',
    'boosting this','sharing this','reposting','resharing'
  ];
  function isNoise(txt){
    var l=txt.toLowerCase();
    return NOISE.some(function(w){return l.includes(w);});
  }
  function calcScore(txt){
    if(isNoise(txt))return 0;
    var l=txt.toLowerCase(),t=0;
    for(var k in RULES){var r=RULES[k];if(r.kw.some(function(w){return l.includes(w)}))t=Math.min(100,t+r.w);}
    return t;
  }

  var STRINGS=[[1,'Looking for product designer'],[2,'Looking for UX/UI designer'],[3,'Looking for design agency'],[4,'Looking for branding help'],[5,'Looking for website design/dev'],[6,'Fresh funding'],[7,'Activation/churn pain'],[8,'Product redesign intent'],[9,'Design agency/partner recs'],[10,'Design system need'],[11,'Pre-launch/MVP'],[12,'Tech founders no design'],[13,'Website not converting'],[14,'Brand identity/logo'],[15,'No designer pain'],[16,'Webflow/Framer help'],[17,'Funding London/SG/CH/DE'],[18,'Seed/A in key cities'],[19,'Designer hire geos'],[20,'Brand/website redesign geos'],[21,'Fractional design partner'],[22,'Unhappy with agency'],[23,'PLG + design need']];
  function matchStr(txt){
    var l=txt.toLowerCase();
    if(l.includes('product designer'))return 1;
    if(l.includes('ux designer')||l.includes('ui designer'))return 2;
    if(l.includes('design agency')||l.includes('branding agency'))return 3;
    if(l.includes('branding')||l.includes('brand identity')||l.includes('logo'))return 4;
    if(l.includes('website design')||l.includes('webflow')||l.includes('framer'))return 5;
    if(l.includes('raised')||l.includes('funding')||l.includes('series a')||l.includes('seed'))return 6;
    if(l.includes('churn')||l.includes('drop-off'))return 7;
    if(l.includes('redesign')||l.includes('revamp'))return 8;
    return 1;
  }

  // ─── Post detection ───────────────────────────────────────────────────────
  // LinkedIn 2026: post cards carry componentkey="expanded<urn>FeedType_..."
  // (verified live — class names are now build-hashed and useless as selectors).
  // Legacy selectors kept as fallback for surfaces still on the old DOM.
  var NEW_CARD = '[componentkey^="expanded"]';
  var LEGACY_SEL = '.feed-shared-update-v2,.occludable-update,[data-urn^="urn:li:activity:"],[data-urn^="urn:li:share:"],[data-urn^="urn:li:ugcPost:"],article';

  function findPost(el) {
    if (!el || !el.closest) return null;
    var c = el.closest(NEW_CARD);
    if (c) {
      // the same componentkey appears on nested wrappers — take the outermost
      var p = c.parentElement && c.parentElement.closest(NEW_CARD);
      while (p) {
        c = p;
        p = c.parentElement && c.parentElement.closest(NEW_CARD);
      }
      return c;
    }
    return el.closest(LEGACY_SEL);
  }

  // ─── Chip button ──────────────────────────────────────────────────────────
  var chip = document.createElement('button');
  chip.className = '__qap_chip';
  chip.textContent = '+';
  chip.title = 'Add to Pipeline';
  chip.setAttribute('aria-label', 'Add to Pipeline');
  document.body.appendChild(chip);

  var curPost = null, hideTimer = null, lastHighlighted = null;

  function showChip(post) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (lastHighlighted && lastHighlighted !== post) {
      lastHighlighted.classList.remove('__qap_highlight');
    }
    curPost = post;
    lastHighlighted = post;
    post.classList.add('__qap_highlight');
    var r = post.getBoundingClientRect();
    var chipTop = Math.max(10, r.top + window.scrollY + 10);
    var chipLeft = Math.min(window.innerWidth - 46, r.right - 44);
    chip.style.top = chipTop + 'px';
    chip.style.left = chipLeft + 'px';
    chip.style.position = 'fixed';
    chip.style.top = (r.top + 10) + 'px';
    chip.style.display = 'flex';
  }

  function hideChip(delay) {
    hideTimer = setTimeout(function() {
      chip.style.display = 'none';
      if (lastHighlighted) {
        lastHighlighted.classList.remove('__qap_highlight');
        lastHighlighted = null;
      }
      curPost = null;
    }, delay || 400);
  }

  document.addEventListener('mouseover', function(e) {
    if (e.target === chip || chip.contains(e.target)) return;
    var p = findPost(e.target);
    if (p) showChip(p);
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (e.target === chip || chip.contains(e.target)) return;
    if (e.relatedTarget && (e.relatedTarget === chip || chip.contains(e.relatedTarget))) return;
    hideChip(400);
  }, true);

  chip.addEventListener('mouseenter', function() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  });
  chip.addEventListener('mouseleave', function() {
    hideChip(400);
  });

  // ─── Extract post data ────────────────────────────────────────────────────
  function extractPostData(postEl) {
    // Text content — 2026 componentkey first, then legacy, then full innerText
    var textSelectors = [
      '[componentkey^="feed-commentary"]',
      'a[componentkey^="feed-original-share-description"]',
      '.update-components-text',
      '.feed-shared-update-v2__commentary',
      '.feed-shared-text',
      '[class*="commentary"]'
    ];
    var postText = '';
    for (var i = 0; i < textSelectors.length; i++) {
      var el = postEl.querySelector(textSelectors[i]);
      if (el && el.innerText.trim().length > 20) {
        postText = el.innerText.trim();
        break;
      }
    }
    if (!postText) postText = postEl.innerText.trim().slice(0, 1000);

    // Author name — legacy selectors first
    var nameSelectors = [
      '.update-components-actor__title',
      '.feed-shared-actor__title',
      '[class*="actor__name"]',
      '[class*="actor__title"]'
    ];
    var posterName = '';
    for (var j = 0; j < nameSelectors.length; j++) {
      var ne = postEl.querySelector(nameSelectors[j]);
      if (ne) { posterName = ne.innerText.trim().split('\n')[0]; break; }
    }
    // 2026 DOM: cards have no semantic actor class — the author is the first
    // real text line ("Feed post" label comes first on search results)
    if (!posterName) {
      var lines = postEl.innerText.split('\n').map(function(l){return l.trim();}).filter(Boolean);
      var skip = ['feed post', 'suggested', 'promoted', 'follow'];
      for (var k = 0; k < Math.min(lines.length, 4); k++) {
        if (skip.indexOf(lines[k].toLowerCase()) === -1) { posterName = lines[k]; break; }
      }
    }

    // URL — data-urn (legacy), then permalink anchors, then page URL
    var postUrl = window.location.href;
    var urn = postEl.getAttribute('data-urn') || postEl.getAttribute('data-id');
    if (urn && urn.indexOf('activity:') !== -1) {
      postUrl = 'https://www.linkedin.com/feed/update/' + urn;
    } else {
      var link = postEl.querySelector('a[href*="/feed/update/"], a[href*="/posts/"]');
      if (link) postUrl = link.href;
    }

    return { postText: postText, posterName: posterName, postUrl: postUrl };
  }

  // ─── Modal ────────────────────────────────────────────────────────────────
  chip.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!curPost) return;

    var data = extractPostData(curPost);
    var sc = calcScore(data.postText);
    var sid = matchStr(data.postText);

    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);z-index:2147483646;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';

    var mo = document.createElement('div');
    mo.style.cssText = 'background:white;border-radius:12px;padding:24px;width:90%;max-width:440px;box-shadow:0 10px 30px rgba(0,0,0,.3);color:#1f2328';

    function fld(lbl, val, id, type) {
      var w = document.createElement('div'); w.style.marginBottom = '12px';
      var l = document.createElement('label');
      l.textContent = lbl;
      l.style.cssText = 'display:block;font-size:10px;font-weight:700;color:#57606a;text-transform:uppercase;margin-bottom:4px';
      var inp;
      if (type === 'select') {
        inp = document.createElement('select');
        STRINGS.forEach(function(ss) {
          var o = document.createElement('option');
          o.value = ss[0]; o.textContent = '#' + ss[0] + ' — ' + ss[1];
          if (ss[0] === val) o.selected = true;
          inp.appendChild(o);
        });
      } else {
        inp = document.createElement('input');
        inp.type = type || 'text';
        inp.value = val || '';
      }
      inp.id = id;
      inp.style.cssText = 'width:100%;padding:8px 10px;font-size:13px;border:1px solid #d0d7de;border-radius:6px;font-family:inherit;box-sizing:border-box';
      w.appendChild(l); w.appendChild(inp);
      return w;
    }

    var h = document.createElement('h3');
    h.textContent = 'Add to Pipeline';
    h.style.cssText = 'margin:0 0 4px;font-size:16px;font-weight:700;color:#0077b5';

    var sub = document.createElement('p');
    var urlDisplay = data.postUrl.length > 55 ? data.postUrl.slice(0, 55) + '…' : data.postUrl;
    sub.textContent = urlDisplay;
    sub.style.cssText = 'font-size:11px;color:#8c959f;margin:0 0 16px;word-break:break-all';

    mo.appendChild(h);
    mo.appendChild(sub);
    mo.appendChild(fld('Poster Name / Title', data.posterName, '__qap_poster'));
    mo.appendChild(fld('ICP Score (auto)', sc, '__qap_score', 'number'));
    mo.appendChild(fld('Search String', sid, '__qap_string', 'select'));
    mo.appendChild(fld('Post URL', data.postUrl, '__qap_url'));

    var brow = document.createElement('div');
    brow.style.cssText = 'display:flex;gap:10px;margin-top:4px';

    var sv = document.createElement('button');
    sv.textContent = 'Save to Pipeline';
    sv.style.cssText = 'flex:1;padding:10px;font-size:13px;font-weight:700;background:#0077b5;color:white;border:none;border-radius:6px;cursor:pointer';

    var cn = document.createElement('button');
    cn.textContent = 'Cancel';
    cn.style.cssText = 'padding:10px 14px;font-size:13px;background:#eaeef2;color:#57606a;border:none;border-radius:6px;cursor:pointer';

    sv.onclick = function() {
      var lead = {
        stringId: Number(document.getElementById('__qap_string').value),
        url: document.getElementById('__qap_url').value.trim(),
        posterTitle: document.getElementById('__qap_poster').value.trim() || '(unknown)',
        score: document.getElementById('__qap_score').value || '0',
        status: 'hit',
        date: new Date().toISOString().slice(0, 10)
      };
      sv.disabled = true; sv.textContent = 'Saving…';
      var PIPELINE_KEY = 'linkedin_pipeline_v1';
      chrome.storage.local.get([PIPELINE_KEY], function(result) {
        var leads = result[PIPELINE_KEY] || [];
        leads.unshift(lead);
        chrome.storage.local.set({ [PIPELINE_KEY]: leads }, function() {
          if (chrome.runtime.lastError) {
            alert('Save failed: ' + chrome.runtime.lastError.message);
            sv.disabled = false; sv.textContent = 'Save to Pipeline';
            return;
          }
          var tick = document.createElement('div');
          tick.style.cssText = 'text-align:center;padding:20px 0';
          tick.innerHTML = '<div style="font-size:48px;color:#1a7f37;margin-bottom:12px">✓</div><div style="font-size:16px;font-weight:700;color:#1a7f37">Saved!</div><div style="font-size:12px;color:#57606a;margin-top:6px">Click the Wubbl icon to review.</div>';
          mo.textContent = '';
          mo.appendChild(tick);
          setTimeout(function() { if (document.body.contains(ov)) document.body.removeChild(ov); }, 1600);
        });
      });
    };

    cn.onclick = function() { document.body.removeChild(ov); };
    ov.onclick = function(e) { if (e.target === ov) document.body.removeChild(ov); };

    brow.appendChild(sv); brow.appendChild(cn);
    mo.appendChild(brow);
    ov.appendChild(mo);
    document.body.appendChild(ov);
    setTimeout(function() { var f = document.getElementById('__qap_poster'); if (f) f.focus(); }, 50);
  });

  console.log('[Wubbl] Pipeline extension loaded on', window.location.href);
})();
