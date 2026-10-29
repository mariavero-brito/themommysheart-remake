(function(){
  var page = document.body.getAttribute('data-page') || '';
  var lang = 'en';
  try{ lang = localStorage.getItem('tmh-lang') || 'en'; }catch(e){}

  var LEAF = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 36C8 30 4 18 10 8c6 2 10 8 10 16 0-8 4-14 10-16 6 10 2 22-10 28z" fill="#A5D5BC"/><path d="M20 36V18" stroke="#C9E27E" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
  var CART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>';

  var nav = [
    ['index.html','nav.home','Home','home'],
    ['about.html','nav.about','About us','about'],
    ['plans.html','nav.plans','Plans &amp; Pricing','plans'],
    ['events.html','nav.events','Events','events'],
    ['shop.html','nav.shop','Shop','shop'],
    ['blog.html','nav.blog','Blog','blog'],
    ['contact.html','nav.contact','Contact','contact']
  ];

  function t(key, fallback){
    if(lang==='es' && window.I18N && I18N.es[key]) return I18N.es[key];
    return fallback;
  }

  function header(){
    var links = nav.map(function(n){
      var cur = (page===n[3] || (page==='article' && n[3]==='blog') || (page==='book' && n[3]==='home' && false)) ? ' class="active" aria-current="page"' : '';
      return '<a href="'+n[0]+'"'+cur+' data-i18n="'+n[1]+'">'+t(n[1],n[2])+'</a>';
    }).join('');
    return '<header class="site-header"><div class="header-in">'+
      '<a class="logo" href="index.html" aria-label="Mommy\'s Heart home">'+LEAF+'<span>Mommy\'s Heart</span></a>'+
      '<button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>'+
      '<nav class="nav" id="nav" aria-label="Main">'+links+
        '<span class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="'+(lang==='en')+'">EN</button><span aria-hidden="true">|</span><button type="button" data-lang="es" aria-pressed="'+(lang==='es')+'">ES</button></span>'+
      '</nav>'+
      '<div class="head-tools"><a class="btn small" href="book.html" data-i18n="btn.book">'+t('btn.book','Book a class')+'</a>'+
        '<a class="cart" href="shop.html" aria-label="Cart">'+CART+'</a>'+
        '<a href="#" data-preview data-i18n="btn.login">'+t('btn.login','Log in')+'</a></div>'+
    '</div></header>';
  }

  function footer(){
    return '<footer class="site-footer"><div class="wrap"><div class="foot-grid">'+
      '<div><a class="logo" href="index.html" style="display:inline-flex;margin-bottom:14px">'+LEAF+'<span>Mommy\'s Heart</span></a>'+
      '<address>13564 Village Park Drive, Suite 205<br>Orlando, FL 32837</address>'+
      '<p>(786) 853-2596</p>'+
      '<div class="social"><a href="#" data-preview aria-label="Instagram">IG</a><a href="#" data-preview aria-label="YouTube">YT</a></div></div>'+
      '<div><h4 data-i18n="foot.title">'+t('foot.title','Get one screen-free activity every week')+'</h4>'+
      '<form class="nl" data-preview-form><label class="sr" for="fn">First name</label><input id="fn" placeholder="'+t('foot.first','First name')+'"><label class="sr" for="fe">Email</label><input id="fe" type="email" placeholder="'+t('foot.email','Email')+'"><button class="btn" type="submit" data-i18n="foot.send">'+t('foot.send','Send me activities')+'</button></form></div>'+
      '</div><p class="copy">&copy; 2026 &middot; Design preview, not the official site</p></div></footer>';
  }

  function chat(){
    return '<div class="chat"><div class="chat-panel hidden" id="chatp" role="dialog" aria-label="Chat"><button type="button" aria-label="Close" id="chatx">&times;</button><span data-i18n="chat.msg">'+t('chat.msg','Hi! Questions about classes? We reply in English and Spanish. [hours to be confirmed]')+'</span></div><button class="chat-btn" type="button" id="chatb" data-i18n="chat.btn">'+t('chat.btn',"Let's Chat!")+'</button></div>';
  }

  function mount(){
    var banner = '<div class="preview-banner" data-i18n="banner">'+t('banner','Design preview for review. Not the official site. Booking, checkout and sign-up are not active.')+'</div>';
    document.body.insertAdjacentHTML('afterbegin', banner + header());
    document.body.insertAdjacentHTML('beforeend', footer() + chat() + '<div class="toast" id="toast" role="status" aria-live="polite"></div>');
    wire();
    translate();
  }

  var toastT;
  function toast(msg){
    var el = document.getElementById('toast');
    el.textContent = msg || (lang==='es' ? 'Solo vista previa. Esto ocurre en el sitio real.' : 'Preview only. This happens on the live site.');
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function(){ el.classList.remove('show'); }, 2400);
  }

  function translate(){
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k = el.getAttribute('data-i18n');
      if(!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
      el.innerHTML = (lang==='es' && window.I18N && I18N.es[k]) ? I18N.es[k] : el.getAttribute('data-en');
    });
    document.querySelectorAll('.lang button').forEach(function(b){ b.setAttribute('aria-pressed', String(b.getAttribute('data-lang')===lang)); });
  }

  function wire(){
    document.addEventListener('click', function(e){
      var lb = e.target.closest('[data-lang]');
      if(lb){ lang = lb.getAttribute('data-lang'); try{localStorage.setItem('tmh-lang',lang);}catch(x){} translate(); return; }
      var p = e.target.closest('[data-preview]');
      if(p){ e.preventDefault(); toast(); return; }
      if(e.target.closest('.menu-btn')){
        var h = document.querySelector('.site-header'); var open = h.classList.toggle('open');
        e.target.closest('.menu-btn').setAttribute('aria-expanded', String(open)); return;
      }
      if(e.target.id==='chatb'){ document.getElementById('chatp').classList.toggle('hidden'); }
      if(e.target.id==='chatx'){ document.getElementById('chatp').classList.add('hidden'); }
    });
    document.addEventListener('submit', function(e){
      if(e.target.matches('[data-preview-form]')){ e.preventDefault(); toast(); }
    });
  }

  /* calendar on book.html */
  function calendar(){
    var host = document.getElementById('cal'); if(!host) return;
    var d = new Date(2026,9,1); // October 2026
    var selected = null;
    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    function draw(){
      var y = d.getFullYear(), m = d.getMonth();
      var first = new Date(y,m,1).getDay(), days = new Date(y,m+1,0).getDate();
      var html = '<div class="cal-head"><button type="button" id="prev" aria-label="Previous month">&lsaquo;</button><strong>'+MONTHS[m]+' '+y+'</strong><button type="button" id="next" aria-label="Next month">&rsaquo;</button></div><div class="cal-grid">';
      ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(n){ html += '<div class="dow">'+n+'</div>'; });
      for(var i=0;i<first;i++) html += '<div></div>';
      for(var day=1; day<=days; day++){
        var dow = new Date(y,m,day).getDay();
        var on = [1,2,4,6].indexOf(dow) > -1; // Mon, Tue, Thu, Sat
        var key = y+'-'+m+'-'+day;
        html += on ? '<button type="button" class="d on'+(selected===key?' sel':'')+'" data-day="'+key+'" data-label="'+MONTHS[m]+' '+day+', '+y+'">'+day+'</button>' : '<div class="d">'+day+'</div>';
      }
      html += '</div><div class="times" id="times"></div>';
      host.innerHTML = html;
      document.getElementById('prev').onclick = function(){ d.setMonth(d.getMonth()-1); draw(); };
      document.getElementById('next').onclick = function(){ d.setMonth(d.getMonth()+1); draw(); };
      host.querySelectorAll('[data-day]').forEach(function(b){
        b.onclick = function(){
          selected = b.getAttribute('data-day');
          host.querySelectorAll('.d.sel').forEach(function(x){ x.classList.remove('sel'); });
          b.classList.add('sel');
          document.getElementById('times').innerHTML = '<button type="button" class="btn small" data-preview>3:30 pm</button>';
          var dd = document.getElementById('sel-date'); if(dd) dd.textContent = b.getAttribute('data-label') + ' at 3:30 pm';
        };
      });
    }
    draw();
  }

  /* chips and selects filters */
  function filters(){
    var chips = document.querySelectorAll('.chip[data-filter]');
    chips.forEach(function(c){
      c.addEventListener('click', function(){
        chips.forEach(function(x){ x.setAttribute('aria-pressed','false'); });
        c.setAttribute('aria-pressed','true');
        var f = c.getAttribute('data-filter');
        document.querySelectorAll('[data-tags]').forEach(function(card){
          var tags = card.getAttribute('data-tags').split(' ');
          card.classList.toggle('hidden', !(f==='all' || tags.indexOf(f) > -1));
        });
      });
    });
    var sort = document.getElementById('sort');
    if(sort){
      sort.addEventListener('change', function(){
        var grid = document.getElementById('decks');
        var cards = Array.prototype.slice.call(grid.children);
        cards.sort(function(a,b){
          var av = a.classList.contains('soldout') ? 1 : 0, bv = b.classList.contains('soldout') ? 1 : 0;
          return sort.value==='availability' ? av - bv : a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
        });
        cards.forEach(function(c){ grid.appendChild(c); });
      });
    }
    ['f-age','f-lang','f-topic'].forEach(function(id){
      var s = document.getElementById(id); if(!s) return;
      s.addEventListener('change', function(){
        var age = (document.getElementById('f-age')||{}).value || 'all';
        var lg = (document.getElementById('f-lang')||{}).value || 'all';
        var tp = (document.getElementById('f-topic')||{}).value || 'all';
        document.querySelectorAll('#decks > [data-age]').forEach(function(card){
          var ok = (age==='all' || card.dataset.age===age) && (lg==='all' || card.dataset.lang===lg) && (tp==='all' || card.dataset.topic===tp);
          card.classList.toggle('hidden', !ok);
        });
      });
    });
  }

  function init(){ mount(); calendar(); filters(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
