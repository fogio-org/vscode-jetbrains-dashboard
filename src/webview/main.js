/* eslint-disable no-undef */
(function () {
  const vscode = acquireVsCodeApi();
  let projects = [];
  let filter = '';

  const $projects = document.getElementById('projects');
  const $empty = document.getElementById('empty');
  const $search = document.getElementById('search');
  const ICONS = document.body.getAttribute('data-icons-base') || '';

  $search.addEventListener('input', () => {
    filter = $search.value.trim().toLowerCase();
    render();
  });

  document.querySelectorAll('[data-action]').forEach((el) => {
    el.addEventListener('click', () => {
      const action = el.getAttribute('data-action');
      vscode.postMessage({ type: action });
    });
  });

  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg && msg.type === 'projects') {
      projects = Array.isArray(msg.payload) ? msg.payload : [];
      render();
    }
  });

  function render() {
    const filtered = projects.filter((p) => {
      if (!filter) return true;
      return (
        (p.name || '').toLowerCase().includes(filter) ||
        (p.path || '').toLowerCase().includes(filter)
      );
    });

    $projects.innerHTML = '';
    if (filtered.length === 0) {
      $empty.classList.remove('hidden');
      return;
    }
    $empty.classList.add('hidden');

    const pinned = filtered.filter((p) => p.pinned);
    const rest = filtered.filter((p) => !p.pinned);

    if (pinned.length > 0) {
      $projects.appendChild(divider('Pinned'));
      pinned.forEach((p) => $projects.appendChild(renderProject(p)));
    }
    if (rest.length > 0) {
      if (pinned.length > 0) $projects.appendChild(divider('Recent'));
      rest.forEach((p) => $projects.appendChild(renderProject(p)));
    }
  }

  function divider(label) {
    const el = document.createElement('div');
    el.className = 'project-divider';
    el.textContent = label;
    return el;
  }

  function renderProject(p) {
    const el = document.createElement('div');
    el.className = 'project' + (p.exists ? '' : ' missing');
    el.setAttribute('role', 'listitem');
    el.tabIndex = 0;
    const titleSuffix = p.exists ? '' : ' (missing)';
    el.title = p.path + titleSuffix;

    const avatar = document.createElement('div');
    avatar.className = 'project-avatar';
    avatar.style.background = colorFromName(p.name || p.path);
    avatar.textContent = (p.name || '?').slice(0, 1).toUpperCase();

    const meta = document.createElement('div');
    meta.className = 'project-meta';
    const name = document.createElement('div');
    name.className = 'project-name';
    name.textContent = p.name + (p.exists ? '' : ' (missing)');
    const path = document.createElement('div');
    path.className = 'project-path';
    path.textContent = p.path;
    meta.appendChild(name);
    meta.appendChild(path);

    const right = document.createElement('div');
    right.className = 'project-right';
    const time = document.createElement('span');
    time.className = 'project-time';
    time.textContent = relTime(p.lastOpened);
    right.appendChild(time);

    const actions = document.createElement('div');
    actions.className = 'project-actions';
    if (p.exists) {
      actions.appendChild(iconBtn('external.svg', 'Open in new window', (e) => {
        e.stopPropagation();
        vscode.postMessage({ type: 'openProject', payload: { path: p.path, newWindow: true } });
      }));
    }
    actions.appendChild(iconBtn(p.pinned ? 'pin-filled.svg' : 'pin.svg', p.pinned ? 'Unpin' : 'Pin', (e) => {
      e.stopPropagation();
      vscode.postMessage({ type: 'togglePin', payload: { path: p.path } });
    }, p.pinned ? 'pinned' : ''));
    actions.appendChild(iconBtn('close.svg', 'Remove from list', (e) => {
      e.stopPropagation();
      vscode.postMessage({ type: 'removeProject', payload: { path: p.path } });
    }));
    right.appendChild(actions);

    el.appendChild(avatar);
    el.appendChild(meta);
    el.appendChild(right);

    const open = (newWindow) => {
      if (!p.exists) {
        vscode.postMessage({ type: 'missingProject', payload: { path: p.path } });
        return;
      }
      vscode.postMessage({ type: 'openProject', payload: { path: p.path, newWindow: !!newWindow } });
    };

    el.addEventListener('click', (ev) => {
      open(ev.metaKey || ev.ctrlKey || ev.shiftKey);
    });
    el.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        open(ev.metaKey || ev.ctrlKey || ev.shiftKey);
      } else if (ev.key === 'Delete' || ev.key === 'Backspace') {
        vscode.postMessage({ type: 'removeProject', payload: { path: p.path } });
      }
    });

    return el;
  }

  function iconBtn(iconFile, title, onClick, extraClass) {
    const b = document.createElement('button');
    b.className = 'icon-btn' + (extraClass ? ' ' + extraClass : '');
    b.title = title;
    b.setAttribute('aria-label', title);
    const img = document.createElement('img');
    img.alt = '';
    img.src = ICONS + '/' + iconFile;
    b.appendChild(img);
    b.addEventListener('click', onClick);
    return b;
  }

  function colorFromName(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
      h = (h * 31 + name.charCodeAt(i)) | 0;
    }
    const palette = [
      '#3574F0', '#5FAD65', '#E16D49', '#9C27B0', '#00838F',
      '#C62828', '#6A1B9A', '#1565C0', '#2E7D32', '#EF6C00',
      '#AD1457', '#283593', '#00695C', '#558B2F', '#D84315',
    ];
    return palette[Math.abs(h) % palette.length];
  }

  function relTime(ts) {
    if (!ts) return '';
    const diff = Date.now() - ts;
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return 'Just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return min + ' min ago';
    const hr = Math.floor(min / 60);
    if (hr < 24) return hr + ' hour' + (hr > 1 ? 's' : '') + ' ago';
    const day = Math.floor(hr / 24);
    if (day === 1) return 'Yesterday';
    if (day < 7) return day + ' days ago';
    if (day < 30) return Math.floor(day / 7) + ' week' + (day >= 14 ? 's' : '') + ' ago';
    if (day < 365) return Math.floor(day / 30) + ' month' + (day >= 60 ? 's' : '') + ' ago';
    return Math.floor(day / 365) + ' year' + (day >= 730 ? 's' : '') + ' ago';
  }

  vscode.postMessage({ type: 'ready' });
})();
