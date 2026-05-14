/* eslint-disable no-undef */
(function () {
  var vscode = acquireVsCodeApi();
  var projects = [];
  var filter = '';

  var $projects = document.getElementById('projects');
  var $empty = document.getElementById('empty');
  var $search = document.getElementById('search');

  var ICONS = {
    plus: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 3.5a.5.5 0 0 0-1 0V7H4a.5.5 0 0 0 0 1h3.5v3.5a.5.5 0 0 0 1 0V8H12a.5.5 0 0 0 0-1H8.5V3.5z"/></svg>',
    folder: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.12 3H2.63C2.4 3 2 3.26 2 3.87v8.27c0 .6.4.86.63.86H13c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1H8.04L6.12 3z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.63 2C1.73 2 1 2.84 1 3.87v9.27C1 14.16 1.73 15 2.63 15H13c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H8.47L6.84 2.31A1 1 0 0 0 6.12 2H2.63zM2 3.87C2 3.26 2.4 3 2.63 3h3.49l1.92 2H13c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1H2.63c-.23 0-.63-.27-.63-.87V3.87z"/></svg>',
    download: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 1a.5.5 0 0 1 .5.5v7.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 9.293V1.5A.5.5 0 0 1 8 1z"/><path d="M2.5 13a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11z"/></svg>',
    theme: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM3 8a5 5 0 0 1 5-5v10a5 5 0 0 1-5-5z"/></svg>',
    keyboard: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-11zM2 4.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-7zM4 6h1v1H4V6zm3 0h2v1H7V6zm4 0h1v1h-1V6zM5 9h6v1H5V9z"/></svg>',
    plugins: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 3.5H9c0 .276.224.5.5.5V3.5zm3 0H13a.5.5 0 0 0-.5-.5v.5zm0 3H12c0 .276.224.5.5.5V6.5zm0 4v-.5a.5.5 0 0 0-.5.5h.5zm0 3v.5a.5.5 0 0 0 .5-.5h-.5zm-10 0H2c0 .276.224.5.5.5V14zm3-10V4c.276 0 .5-.224.5-.5H5.5zm-3 0V3a.5.5 0 0 0-.5.5h.5zm0 3H2c0 .276.224.5.5.5V6.5zm0 4v-.5a.5.5 0 0 0-.5.5h.5zM7.5 0C6.119 0 5 1.119 5 2.5h1C6 1.672 6.672 1 7.5 1V0zM10 2.5C10 1.119 8.881 0 7.5 0v1C8.328 1 9 1.672 9 2.5h1zm0 1v-1H9v1h1zm2.5-1h-3v1h3V2.5zM13 6.5v-3h-1v3h1zm-.5.5h1V6h-1v1zm1 0A1.5 1.5 0 0 1 15 8.5h1C16 7.119 14.881 6 13.5 6v1zM15 8.5c0 .828-.672 1.5-1.5 1.5v1c1.381 0 2.5-1.119 2.5-2.5h-1zm-1.5 1.5h-1v1h1v-1zm-.5 3.5v-3h-1v3h1zM2.5 14h10v-1h-10v1zm3-11h-3v1h3V3zM5 2.5v1h1v-1H5zm-3 1v3h1v-3H2zm0 7v3h1v-3H2zm.5-4h1V6h-1v1zm1 3h-1v1h1V10zM5 8.5c0 .828-.672 1.5-1.5 1.5v1A2.5 2.5 0 0 0 6 8.5H5zM3.5 7C4.328 7 5 7.672 5 8.5h1A2.5 2.5 0 0 0 3.5 6v1z"/></svg>',
    pin: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="5" r="2.5"/><path d="M8 7.5v5.5"/></svg>',
    pinFilled: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="5" r="2.5"/><path d="M8 7.5v5.5"/></svg>',
    external: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M6 3H4.5A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5V10"/><path d="M9 3h4v4"/><path d="M13 3L7 9"/></svg>',
    close: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 4.5l7 7"/><path d="M11.5 4.5l-7 7"/></svg>',
  };

  document.querySelectorAll('[data-icon]').forEach(function (el) {
    var key = el.getAttribute('data-icon');
    if (ICONS[key]) el.innerHTML = ICONS[key];
  });

  document.querySelectorAll('[data-action]').forEach(function (el) {
    el.addEventListener('click', function () {
      vscode.postMessage({ type: el.getAttribute('data-action') });
    });
  });

  $search.addEventListener('input', function () {
    filter = $search.value.trim().toLowerCase();
    render();
  });

  window.addEventListener('message', function (event) {
    var msg = event.data;
    if (msg && msg.type === 'projects') {
      projects = Array.isArray(msg.payload) ? msg.payload : [];
      render();
    }
  });

  function render() {
    var filtered = projects.filter(function (p) {
      if (!filter) return true;
      return (p.name || '').toLowerCase().indexOf(filter) !== -1 ||
             (p.path || '').toLowerCase().indexOf(filter) !== -1;
    });

    $projects.innerHTML = '';
    if (filtered.length === 0) {
      $empty.classList.remove('hidden');
      return;
    }
    $empty.classList.add('hidden');

    var pinned = filtered.filter(function (p) { return p.pinned; });
    var rest = filtered.filter(function (p) { return !p.pinned; });

    if (pinned.length > 0) {
      $projects.appendChild(divider('Pinned'));
      pinned.forEach(function (p) { $projects.appendChild(renderProject(p)); });
    }
    if (rest.length > 0) {
      if (pinned.length > 0) $projects.appendChild(divider('Recent'));
      rest.forEach(function (p) { $projects.appendChild(renderProject(p)); });
    }
  }

  function divider(label) {
    var el = document.createElement('div');
    el.className = 'project-divider';
    el.textContent = label;
    return el;
  }

  function renderProject(p) {
    var el = document.createElement('div');
    el.className = 'project' + (p.exists ? '' : ' missing');
    el.setAttribute('role', 'listitem');
    el.tabIndex = 0;
    el.title = p.path + (p.exists ? '' : ' (missing)');

    var avatar = document.createElement('div');
    avatar.className = 'project-avatar';
    avatar.style.background = colorFromName(p.name || p.path);
    avatar.textContent = (p.name || '?').charAt(0).toUpperCase();

    var meta = document.createElement('div');
    meta.className = 'project-meta';
    var name = document.createElement('div');
    name.className = 'project-name';
    name.textContent = p.name + (p.exists ? '' : ' (missing)');
    var pathEl = document.createElement('div');
    pathEl.className = 'project-path';
    pathEl.textContent = p.path;
    meta.appendChild(name);
    meta.appendChild(pathEl);

    var right = document.createElement('div');
    right.className = 'project-right';

    var time = document.createElement('span');
    time.className = 'project-time';
    time.textContent = relTime(p.lastOpened);
    right.appendChild(time);

    var actions = document.createElement('div');
    actions.className = 'project-actions';

    if (p.exists) {
      actions.appendChild(iconBtn('external', 'Open in new window', function (e) {
        e.stopPropagation();
        vscode.postMessage({ type: 'openProject', payload: { path: p.path, newWindow: true } });
      }));
    }
    actions.appendChild(iconBtn(p.pinned ? 'pinFilled' : 'pin', p.pinned ? 'Unpin' : 'Pin', function (e) {
      e.stopPropagation();
      vscode.postMessage({ type: 'togglePin', payload: { path: p.path } });
    }, p.pinned ? 'pinned' : ''));
    actions.appendChild(iconBtn('close', 'Remove from list', function (e) {
      e.stopPropagation();
      vscode.postMessage({ type: 'removeProject', payload: { path: p.path } });
    }));
    right.appendChild(actions);

    el.appendChild(avatar);
    el.appendChild(meta);
    el.appendChild(right);

    el.addEventListener('click', function (ev) {
      openProject(p, ev.metaKey || ev.ctrlKey || ev.shiftKey);
    });
    el.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') openProject(p, ev.metaKey || ev.ctrlKey || ev.shiftKey);
      else if (ev.key === 'Delete' || ev.key === 'Backspace') {
        vscode.postMessage({ type: 'removeProject', payload: { path: p.path } });
      }
    });

    return el;
  }

  function openProject(p, newWindow) {
    if (!p.exists) {
      vscode.postMessage({ type: 'missingProject', payload: { path: p.path } });
      return;
    }
    vscode.postMessage({ type: 'openProject', payload: { path: p.path, newWindow: !!newWindow } });
  }

  function iconBtn(iconKey, title, onClick, extraClass) {
    var b = document.createElement('button');
    b.className = 'icon-btn' + (extraClass ? ' ' + extraClass : '');
    b.title = title;
    b.setAttribute('aria-label', title);
    b.innerHTML = ICONS[iconKey] || '';
    b.addEventListener('click', onClick);
    return b;
  }

  function colorFromName(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) {
      h = (h * 31 + name.charCodeAt(i)) | 0;
    }
    var palette = [
      '#3574F0', '#5FAD65', '#E16D49', '#9C27B0', '#00838F',
      '#C62828', '#6A1B9A', '#1565C0', '#2E7D32', '#EF6C00',
      '#AD1457', '#283593', '#00695C', '#558B2F', '#D84315',
    ];
    return palette[Math.abs(h) % palette.length];
  }

  function relTime(ts) {
    if (!ts) return '';
    var diff = Date.now() - ts;
    var sec = Math.floor(diff / 1000);
    if (sec < 60) return 'Just now';
    var min = Math.floor(sec / 60);
    if (min < 60) return min + ' min ago';
    var hr = Math.floor(min / 60);
    if (hr < 24) return hr + ' hour' + (hr > 1 ? 's' : '') + ' ago';
    var day = Math.floor(hr / 24);
    if (day === 1) return 'Yesterday';
    if (day < 7) return day + ' days ago';
    if (day < 30) return Math.floor(day / 7) + ' week' + (day >= 14 ? 's' : '') + ' ago';
    if (day < 365) return Math.floor(day / 30) + ' month' + (day >= 60 ? 's' : '') + ' ago';
    return Math.floor(day / 365) + ' year' + (day >= 730 ? 's' : '') + ' ago';
  }

  vscode.postMessage({ type: 'ready' });
})();
