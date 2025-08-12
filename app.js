/* simple client-side prototype for GiftLoop */
(function(){
  // --- config: gift types ---
  const GIFT_TYPES = [
    { id:'thanks', label:'感謝', note:'ありがとうの気持ち' },
    { id:'empath', label:'共感', note:'わかるよ、寄り添い' },
    { id:'cheer', label:'応援', note:'がんばれ！' }
  ];

  // util date
  function nowStr(){ return new Date().toISOString(); }

  // storage keys
  const FEED_KEY = 'giftloop_feed_v1';
  const FB_KEY = 'giftloop_feedback_v1';

  // elements
  const sessionNameEl = document.getElementById('sessionName');
  const themeTextEl = document.getElementById('themeText');
  const giftButtonsEl = document.getElementById('giftButtons');
  const feedListEl = document.getElementById('feedList');
  const exportBtn = document.getElementById('exportBtn');
  const feedbackForm = document.getElementById('feedbackForm');
  const exportFeedback = document.getElementById('exportFeedback');

  // parse URL params
  const params = new URLSearchParams(location.search);
  const session = params.get('session') || 'トライアルセッション';
  const theme = params.get('theme') || '今日の話題を共有しよう';

  sessionNameEl.textContent = session;
  themeTextEl.textContent = theme;

  // init gift buttons
  GIFT_TYPES.forEach(g=>{
    const btn = document.createElement('button');
    btn.className = 'gift-btn';
    btn.innerHTML = `<strong>${g.label}</strong><small>${g.note}</small>`;
    btn.onclick = ()=>sendGift(g.id);
    giftButtonsEl.appendChild(btn);
  });

  // local feed (acts like global feed in prototype)
  function loadFeed(){ return JSON.parse(localStorage.getItem(FEED_KEY) || '[]'); }
  function saveFeed(feed){ localStorage.setItem(FEED_KEY, JSON.stringify(feed)); }

  function renderFeed(){
    const feed = loadFeed();
    feedListEl.innerHTML = '';
    if(feed.length === 0){
      feedListEl.innerHTML = '<li class="meta">まだギフトはありません。あなたが最初に贈ってみましょう。</li>';
      return;
    }
    feed.slice().reverse().forEach(item=>{
      const li = document.createElement('li');
      li.className = 'feed-item';
      li.innerHTML = `<div class="left"><div class="badge">${item.label}</div>
        <div><div><strong>${item.from || '匿名'}</strong> → <span>${item.to || 'みんな'}</span></div>
        <div class="meta">${new Date(item.time).toLocaleString()}${item.note ? ' • ' + item.note : ''}</div></div></div>
        <div class="meta">${item.session}</div>`;
      feedListEl.appendChild(li);
    });
  }

  // simple prompt to collect optional names/notes
  function promptMeta(){
    const from = prompt('あなたの名前（公開名、空欄で匿名）', '') || '';
    const to = prompt('誰に贈りますか？（空欄でコミュニティ）', '') || '';
    const note = prompt('一言（任意）', '') || '';
    return {from,to,note};
  }

  function sendGift(typeId){
    const g = GIFT_TYPES.find(x=>x.id===typeId);
    if(!g) return;
    const meta = promptMeta();
    const feed = loadFeed();
    const item = {
      id: (Math.random()+1).toString(36).slice(2,9),
      type: g.id,
      label: g.label,
      note: meta.note,
      from: meta.from,
      to: meta.to,
      session: session,
      time: nowStr()
    };
    feed.push(item);
    saveFeed(feed);
    renderFeed();
    alert('ギフトを送信しました ✨');
  }

  // export CSV util
  function toCSV(rows, headers){
    const esc = v => `"${String(v||'').replace(/"/g,'""')}"`;
    const out = [headers.map(esc).join(',')].concat(rows.map(r=>headers.map(h=>esc(r[h])).join(','))).join('\n');
    return out;
  }

  exportBtn.addEventListener('click', ()=>{
    const feed = loadFeed();
    if(feed.length===0){ alert('ギフトがありません'); return; }
    const csv = toCSV(feed, ['id','type','label','from','to','note','session','time']);
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `giftloop_feed_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  });

  // feedback
  function loadFB(){ return JSON.parse(localStorage.getItem(FB_KEY) || '[]'); }
  function saveFB(fb){ localStorage.setItem(FB_KEY, JSON.stringify(fb)); }

  feedbackForm.addEventListener('submit', e=>{
    e.preventDefault();
    const s = document.getElementById('satis').value;
    const c = document.getElementById('comment').value;
    const fb = loadFB();
    fb.push({id:(Math.random()+1).toString(36).slice(2,9), session, satis:s, comment:c, time:nowStr()});
    saveFB(fb);
    alert('フィードバックありがとうございます！');
    feedbackForm.reset();
  });

  exportFeedback.addEventListener('click', ()=>{
    const f = loadFB();
    if(f.length===0){ alert('フィードバックはありません'); return; }
    const csv = toCSV(f, ['id','session','satis','comment','time']);
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `giftloop_feedback_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  });

  // initial render
  renderFeed();

})();
