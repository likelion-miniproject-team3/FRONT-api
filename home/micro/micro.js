const searchInput = document.getElementById('searchInput');
const yearButtons = document.querySelectorAll('.year-buttons button');
const requiredContainer = document.getElementById('required-subjects');
const electiveContainer = document.getElementById('elective-subjects');
const navItems = document.querySelectorAll('.nav-item');
const subjectDetailList = document.getElementById('subject-detail-list');

let currentYear = 1;
let subjects = []; // API에서 받아온 데이터 저장

// 1. 과목 데이터 불러오기
async function fetchSubjects() {
  try {
    const res = await fetch('/api/majors/courses');
    if (!res.ok) throw new Error('과목 정보를 불러오지 못했습니다.');
    subjects = await res.json();
    renderSubjects(currentYear, searchInput.value);
  } catch (err) {
    console.error(err);
  }
}

// 2. 검색 시 호출 (선택)
async function searchSubjects(query) {
  try {
    const res = await fetch(
      `/api/majors/courses?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error('검색 실패');
    subjects = await res.json();
    renderSubjects(currentYear, query);
  } catch (err) {
    console.error(err);
  }
}

// 3. 과목 카드 렌더링
function renderSubjects(year, query = '') {
  requiredContainer.innerHTML = '';
  electiveContainer.innerHTML = '';

  const yearSubjects = subjects.filter((sub) => sub.year === year);
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
    if (query && sub.name.includes(query)) {
      card.classList.add('match');
    }

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
                </button>
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

  setupButtonToggle();
  renderSubjectTextInfo(year);
}

// 4. 버튼 동작
function setupButtonToggle() {
  document.querySelectorAll('.add-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      const courseId = btn.dataset.courseId;
      addToBookmark(courseId);
    });
  });

  document.querySelectorAll('.complete-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      const courseId = btn.dataset.courseId;
      markAsCompleted(courseId);
    });
  });
}

// 5. 수강바구니 API 호출
async function addToBookmark(courseId) {
  try {
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    if (!res.ok) throw new Error('수강바구니 담기 실패');
    alert('수강바구니에 담았습니다!');
  } catch (err) {
    console.error(err);
  }
}

// 6. 수강완료 API 호출
async function markAsCompleted(courseId) {
  try {
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    if (!res.ok) throw new Error('수강완료 등록 실패');
    alert('수강 완료로 등록했습니다!');
  } catch (err) {
    console.error(err);
  }
}

// 7. 과목 설명 리스트 렌더링
function renderSubjectTextInfo(year) {
  subjectDetailList.innerHTML = '';
  const filtered = subjects.filter((sub) => sub.year === year);

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
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = filtered[idx].name;
      const subjectName = tempDiv.textContent.trim();
      window.location.href = `review.html?subject=${encodeURIComponent(
        subjectName
      )}`;
    });
  });
}

// 8. 학년 버튼 이벤트
yearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentYear = parseInt(button.value);
    yearButtons.forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    renderSubjects(currentYear, searchInput.value);
  });
});

// 9. 검색 이벤트
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim();
  if (keyword === '') {
    renderSubjects(currentYear);
  } else {
    searchSubjects(keyword);
  }
});

// 10. 네비게이션 하단 선택 이벤트
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((i) => i.classList.remove('selected'));
    item.classList.add('selected');
  });
});

// 11. 최초 실행 시
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector(`.year-buttons button[value="1"]`)
    .classList.add('selected');
  fetchSubjects(); // API로 과목 불러오기
});
