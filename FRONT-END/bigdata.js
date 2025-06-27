const searchInput = document.getElementById('searchInput');
const yearButtons = document.querySelectorAll('.year-buttons button');
const requiredContainer = document.getElementById('required-subjects');
const electiveContainer = document.getElementById('elective-subjects');
const navItems = document.querySelectorAll('.nav-item');
const subjectDetailList = document.getElementById('subject-detail-list');

let currentYear = 1;
let allSubjects = []; // API에서 불러온 전체 과목 데이터 저장용

// 과목 데이터 가져오기
async function fetchSubjects() {
  try {
    const response = await fetch('/api/majors/courses');
    const data = await response.json();
    allSubjects = data;
    renderSubjects(currentYear, '');
  } catch (err) {
    console.error('과목 데이터 불러오기 실패:', err);
  }
}

// 검색 기능
async function searchSubjects(query) {
  try {
    const response = await fetch(
      `/api/majors/courses?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    renderSubjects(currentYear, query, data);
  } catch (err) {
    console.error('검색 에러:', err);
  }
}

// 과목 카드 렌더링
function renderSubjects(year, query = '', data = allSubjects) {
  requiredContainer.innerHTML = '';
  electiveContainer.innerHTML = '';

  const yearSubjects = data.filter((sub) => sub.year === year);
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
      <div class="subject-header"><i class="fas fa-chevron-right"></i></div>
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
  renderSubjectTextInfo(year, ordered);
}

// 버튼 기능 연결 (POST 요청)
function setupButtonActions() {
  document.querySelectorAll('.add-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const courseId = btn.dataset.courseId;
      addToBookmark(courseId);
      btn.classList.toggle('selected');
    });
  });

  document.querySelectorAll('.complete-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const courseId = btn.dataset.courseId;
      markAsCompleted(courseId);
      btn.classList.toggle('selected');
    });
  });
}

// 수강바구니에 담기
async function addToBookmark(courseId) {
  try {
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    if (!res.ok) throw new Error();
    alert('수강바구니에 담았어요!');
  } catch {
    alert('수강바구니 담기 실패 😢');
  }
}

// 수강 완료 등록
async function markAsCompleted(courseId) {
  try {
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    if (!res.ok) throw new Error();
    alert('수강 완료로 등록했어요!');
  } catch {
    alert('수강 완료 등록 실패 😢');
  }
}

// 설명 텍스트 영역
function renderSubjectTextInfo(year, data) {
  subjectDetailList.innerHTML = '';
  const filtered = data.filter((sub) => sub.year === year);

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
      alert(`'${filtered[i].name}' 과목의 수강평 페이지로 이동합니다.`);
    });
  });
}

// 학년 버튼
yearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentYear = parseInt(button.value);
    yearButtons.forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    renderSubjects(currentYear, searchInput.value);
  });
});

// 검색창
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim();
  if (keyword === '') fetchSubjects();
  else searchSubjects(keyword);
});

// 하단 탭 선택
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((i) => i.classList.remove('selected'));
    item.classList.add('selected');
  });
});

// 시작 시
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector(`.year-buttons button[value="1"]`)
    .classList.add('selected');
  fetchSubjects();
});
