const searchInput = document.getElementById('searchInput');
const yearButtons = document.querySelectorAll('.year-buttons button');
const requiredContainer = document.getElementById('required-subjects');
const electiveContainer = document.getElementById('elective-subjects');
const navItems = document.querySelectorAll('.nav-item');
const subjectDetailList = document.getElementById('subject-detail-list');

let currentYear = 1;

// 과목 데이터 가져오기 (전체 or 검색)
async function fetchSubjects(query = '') {
  const url = query
    ? `/api/majors/courses?q=${encodeURIComponent(query)}`
    : `/api/majors/courses`;

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

  const matched = subjects.filter((s) => s.name.includes(query));
  const unmatched = subjects.filter((s) => !s.name.includes(query));
  const ordered = [...matched, ...unmatched];

  ordered.forEach((sub) => {
    const card = document.createElement('div');

    if (query && sub.name.includes(query)) {
      card.classList.add('match');
    }

    card.className = 'subject-card';
    card.classList.add(
      sub.type === 'required' ? 'required-card' : 'elective-card'
    );

    card.innerHTML = `
      <div class="subject-header"><i class="fas fa-chevron-right"></i></div>
      <div class="subject-info">
        <div class="subject-name">${sub.name}</div>
        <div class="subject-semester">${sub.semester}</div>
        <div class="subject-buttons">
          ${
            sub.type === 'required'
              ? `<button class="complete-button" data-id="${sub.id}" data-complete="false"><i class="fas fa-check"></i> 수강완료</button>`
              : `
                <button class="add-button" data-id="${sub.id}" data-added="false"><i class="fas fa-plus"></i> 담기</button>
                <button class="complete-button" data-id="${sub.id}" data-complete="false"><i class="fas fa-check"></i> 수강</button>
              `
          }
        </div>
      </div>
    `;

    if (sub.type === 'required') {
      requiredContainer.appendChild(card);
    } else {
      electiveContainer.appendChild(card);
    }
  });

  setupButtonEvents();
  renderSubjectTextInfo(ordered);
}

// 버튼 API 동기화
function setupButtonEvents() {
  document.querySelectorAll('.add-button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const added = btn.dataset.added === 'true';

      const res = await fetch(`/api/bookmarks${added ? `/${id}` : ''}`, {
        method: added ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: added ? null : JSON.stringify({ courseId: id }),
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

      const res = await fetch(`/api/enrollments${complete ? `/${id}` : ''}`, {
        method: complete ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: complete ? null : JSON.stringify({ courseId: id }),
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
    div.innerHTML = `
      <div class="profile-icon"></div>
      <div class="text-info">
        <div class="name">${sub.name}</div>
        <div class="desc">${sub.desc}</div>
        <div class="followup">${sub.followup || ''}</div>
      </div>
      <button class="review-button">수강평 보기</button>
    `;
    subjectDetailList.appendChild(div);
  });

  document.querySelectorAll('.review-button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      alert(`${filtered[i].name} 과목의 수강평 페이지로 이동합니다.`);
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
  document
    .querySelector('.year-buttons button[value="1"]')
    .classList.add('selected');
  renderSubjects();
});
