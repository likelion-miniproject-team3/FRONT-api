const searchInput = document.getElementById('searchInput');
const yearButtons = document.querySelectorAll('.year-buttons button');
const requiredContainer = document.getElementById('required-subjects');
const electiveContainer = document.getElementById('elective-subjects');
const navItems = document.querySelectorAll('.nav-item');
const subjectDetailList = document.getElementById('subject-detail-list');

let currentYear = 1;

// 과목 API 호출 함수
async function fetchSubjects(year, query = '') {
  const endpoint = query
    ? /api/majors/courses?q=${encodeURIComponent(query)}
    : /api/majors/courses;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('과목 목록을 불러오지 못했습니다.');
    const data = await res.json();
    return data.filter((sub) => sub.year === year);
  } catch (err) {
    alert(err.message);
    return [];
  }
}

// 과목 카드 렌더링
async function renderSubjects(year, query = '') {
  requiredContainer.innerHTML = '';
  electiveContainer.innerHTML = '';

  const ordered = await fetchSubjects(year, query);

  ordered.forEach((sub) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.classList.add(sub.type === 'required' ? 'required-card' : 'elective-card');

    if (query && sub.name.includes(query)) {
      card.classList.add('match');
    }

    card.innerHTML = 
      <div class="subject-header">
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="subject-info">
        <div class="subject-name">${sub.name}</div>
        <div class="subject-semester">${sub.semester}</div>
        <div class="subject-buttons">
          ${
            sub.type === 'required'
              ? <button class="complete-button" data-id="${sub.id}" data-complete="false"><i class="fas fa-check"></i> 수강완료</button>
              : 
                <button class="add-button" data-id="${sub.id}" data-added="false"><i class="fas fa-plus"></i> 담기</button>
                <button class="complete-button" data-id="${sub.id}" data-complete="false"><i class="fas fa-check"></i> 수강</button>
              
          }
        </div>
      </div>
    ;

    if (sub.type === 'required') {
      requiredContainer.appendChild(card);
    } else {
      electiveContainer.appendChild(card);
    }
  });

  setupButtonToggle();
  renderSubjectTextInfo(year, ordered);
}

// 버튼 클릭 시 토글 및 API 요청
function setupButtonToggle() {
  document.querySelectorAll('.add-button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const added = btn.dataset.added === 'true';
      const method = added ? 'DELETE' : 'POST';
      const url = /api/bookmarks${added ? /${id} : ''};

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ courseId: id }) : null,
      });

      if (res.ok) {
        btn.classList.toggle('selected');
        btn.dataset.added = (!added).toString();
      }
    });
  });

  document.querySelectorAll('.complete-button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const complete = btn.dataset.complete === 'true';
      const method = complete ? 'DELETE' : 'POST';
      const url = /api/enrollments${complete ? /${id} : ''};

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ courseId: id }) : null,
      });

      if (res.ok) {
        btn.classList.toggle('selected');
        btn.dataset.complete = (!complete).toString();
      }
    });
  });
}

// 상세 텍스트 정보 렌더링
function renderSubjectTextInfo(year, data) {
  subjectDetailList.innerHTML = '';
  const filtered = data.filter((sub) => sub.year === year);

  filtered.forEach((sub) => {
    const div = document.createElement('div');
    div.className = 'subject-line';
    div.innerHTML = 
      <div class="profile-icon"></div>
      <div class="text-info">
        <div class="name">${sub.name}</div>
        <div class="desc">${sub.desc}</div>
        <div class="followup">${sub.followup || ''}</div>
      </div>
      <button class="review-button">수강평 보기</button>
    ;
    subjectDetailList.appendChild(div);
  });

  const reviewButtons = document.querySelectorAll('.subject-line .review-button');
  reviewButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      alert('${filtered[idx].name}' 과목의 수강평 페이지로 이동합니다.);
    });
  });
}

// 학년 버튼 클릭 처리
yearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentYear = parseInt(button.value);
    yearButtons.forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    renderSubjects(currentYear, searchInput.value);
  });
});

// 검색 입력 처리
searchInput.addEventListener('input', () => {
  renderSubjects(currentYear, searchInput.value);
});

// 네비게이션 탭 선택 처리
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((i) => i.classList.remove('selected'));
    item.classList.add('selected');
  });
});

// 초기 렌더링
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector(.year-buttons button[value="1"]).classList.add('selected');
  renderSubjects(1);
});이거 대신  const searchInput = document.getElementById('searchInput');
const yearButtons = document.querySelectorAll('.year-buttons button');
const requiredContainer = document.getElementById('required-subjects');
const electiveContainer = document.getElementById('elective-subjects');
const navItems = document.querySelectorAll('.nav-item');
const subjectDetailList = document.getElementById('subject-detail-list');

let currentYear = 1;

// 과목 데이터 가져오기 (전체 or 검색)
async function fetchSubjects(query = '') {
  const url = query
    ? /api/majors/courses?q=${encodeURIComponent(query)}
    : /api/majors/courses;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('과목 데이터를 불러오지 못했습니다');
    const data = await res.json();
    return data.filter((s) => s.year === currentYear);
  } catch (err) {
    alert(err.message);
    return [];
  }
}

// 과목 렌더링
async function renderSubjects(query = '') {
  requiredContainer.innerHTML = '';
  electiveContainer.innerHTML = '';

  const subjects = await fetchSubjects(query);

  subjects.forEach((sub) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.classList.add(sub.type === 'required' ? 'required-card' : 'elective-card');

    card.innerHTML = 
      <div class="subject-header"><i class="fas fa-chevron-right"></i></div>
      <div class="subject-info">
        <div class="subject-name">${sub.name}</div>
        <div class="subject-semester">${sub.semester}</div>
        <div class="subject-buttons">
          ${sub.type === 'required'
            ? <button class="complete-button" data-id="${sub.id}" data-complete="false"><i class="fas fa-check"></i> 수강완료</button>
            : <button class="add-button" data-id="${sub.id}" data-added="false"><i class="fas fa-plus"></i> 담기</button>
               <button class="complete-button" data-id="${sub.id}" data-complete="false"><i class="fas fa-check"></i> 수강</button>}
        </div>
      </div>
    ;

    if (sub.type === 'required') {
      requiredContainer.appendChild(card);
    } else {
      electiveContainer.appendChild(card);
    }
  });

  setupButtonEvents();
  renderSubjectTextInfo(subjects);
}

// 버튼 API 동기화
function setupButtonEvents() {
  document.querySelectorAll('.add-button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const added = btn.dataset.added === 'true';

      const res = await fetch(/api/bookmarks${added ? /${id} : ''}, {
        method: added ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: added ? null : JSON.stringify({ courseId: id })
      });

      if (res.ok) {
        btn.dataset.added = (!added).toString();
        btn.classList.toggle('selected');
      } else {
        alert('서버 요청 실패');
      }
    });
  });

  document.querySelectorAll('.complete-button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const complete = btn.dataset.complete === 'true';

      const res = await fetch(/api/enrollments${complete ? /${id} : ''}, {
        method: complete ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: complete ? null : JSON.stringify({ courseId: id })
      });

      if (res.ok) {
        btn.dataset.complete = (!complete).toString();
        btn.classList.toggle('selected');
      } else {
        alert('수강 상태 변경 실패');
      }
    });
  });
}

// 텍스트 정보 렌더링
function renderSubjectTextInfo(data) {
  subjectDetailList.innerHTML = '';
  const filtered = data.filter((sub) => sub.year === currentYear);

  filtered.forEach((sub) => {
    const div = document.createElement('div');
    div.className = 'subject-line';
    div.innerHTML = 
      <div class="profile-icon"></div>
      <div class="text-info">
        <div class="name">${sub.name}</div>
        <div class="desc">${sub.desc}</div>
        <div class="followup">${sub.followup || ''}</div>
      </div>
      <button class="review-button">수강평 보기</button>
    ;
    subjectDetailList.appendChild(div);
  });

  document.querySelectorAll('.review-button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      alert('${filtered[i].name}' 과목의 수강평 페이지로 이동합니다.);
    });
  });
}

// 학년 버튼 처리
yearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentYear = parseInt(button.value);
    yearButtons.forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    renderSubjects(searchInput.value);
  });
});

// 검색 처리
searchInput.addEventListener('input', () => {
  renderSubjects(searchInput.value.trim());
});

// 하단 탭 선택
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((i) => i.classList.remove('selected'));
    item.classList.add('selected');
  });
});

// 초기 렌더링
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector(.year-buttons button[value="1"]).classList.add('selected');
  renderSubjects();
}); 