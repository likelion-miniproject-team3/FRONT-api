const searchInput = document.getElementById('searchInput');
const yearButtons = document.querySelectorAll('.year-buttons button');
const requiredContainer = document.getElementById('required-subjects');
const electiveContainer = document.getElementById('elective-subjects');
const navItems = document.querySelectorAll('.nav-item');
const subjectDetailList = document.getElementById('subject-detail-list');

let allSubjects = [];
let currentYear = 1;

// 과목 리스트 불러오기
async function fetchSubjects(query = '') {
  try {
    const url = query
      ? `/api/majors/courses?q=${encodeURIComponent(query)}`
      : `/api/majors/courses`;
    const response = await fetch(url);
    const data = await response.json();
    allSubjects = data;
    renderSubjects(currentYear, query);
  } catch (err) {
    console.error('과목 목록 로드 실패:', err);
  }
}

// 수강 바구니 추가
async function addToBookmark(courseId) {
  try {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    if (!response.ok) throw new Error();
    alert('수강바구니에 담았어요!');
  } catch {
    alert('수강바구니 담기 실패');
  }
}

// 수강 완료 등록
async function markAsCompleted(courseId) {
  try {
    const response = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    if (!response.ok) throw new Error();
    alert('수강 완료로 등록했어요!');
  } catch {
    alert('수강 완료 등록 실패');
  }
}

// 과목 카드 렌더링
function renderSubjects(year, query = '') {
  requiredContainer.innerHTML = '';
  electiveContainer.innerHTML = '';

  const yearSubjects = allSubjects.filter((sub) => sub.year === year);
  const matched = query
    ? yearSubjects.filter((s) => s.name.includes(query))
    : [];
  const unmatched = query
    ? yearSubjects.filter((s) => !s.name.includes(query))
    : yearSubjects;
  const ordered = [...matched, ...unmatched];

  ordered.forEach((sub) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.classList.add(
      sub.type === 'required' ? 'required-card' : 'elective-card'
    );
    if (query && sub.name.includes(query)) card.classList.add('match');

    card.innerHTML = `
      <div class="subject-header">
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="subject-info">
        <div class="subject-name">${sub.name}</div>
        <div class="subject-semester">${sub.semester}</div>
        <div class="subject-buttons">
          ${
            sub.type === 'required'
              ? `<button class="complete-button" data-course-id="${sub.id}">
                   <i class="fas fa-check"></i> 수강완료
                 </button>`
              : `
                <button class="add-button" data-course-id="${sub.id}">
                  <i class="fas fa-plus"></i> 담기
                </button>
                <button class="complete-button" data-course-id="${sub.id}">
                  <i class="fas fa-check"></i> 수강
                </button>`
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

  setupButtonActions();
  renderSubjectTextInfo(year);
}

// 버튼 이벤트 연결
function setupButtonActions() {
  document.querySelectorAll('.add-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const courseId = btn.dataset.courseId;
      addToBookmark(courseId);
    });
  });

  document.querySelectorAll('.complete-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const courseId = btn.dataset.courseId;
      markAsCompleted(courseId);
    });
  });
}

// 상세 설명 텍스트 영역
function renderSubjectTextInfo(year) {
  subjectDetailList.innerHTML = '';
  const filtered = allSubjects.filter((sub) => sub.year === year);

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

  const reviewButtons = document.querySelectorAll(
    '.subject-line .review-button'
  );
  reviewButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      alert(`'${filtered[idx].name}' 과목의 수강평 페이지로 이동합니다.`);
    });
  });
}

// 학년 버튼 클릭
yearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentYear = parseInt(button.value);
    yearButtons.forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    renderSubjects(currentYear, searchInput.value);
  });
});

// 검색창 입력
searchInput.addEventListener('input', () => {
  fetchSubjects(searchInput.value.trim());
});

// 하단 네비게이션
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((i) => i.classList.remove('selected'));
    item.classList.add('selected');
  });
});

// 초기 로딩
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector(`.year-buttons button[value="1"]`)
    .classList.add('selected');
  fetchSubjects();
});
