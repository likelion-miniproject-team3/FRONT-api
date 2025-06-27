const subjects = [
  {
    name: '데이터 분석 기초',
    year: 1,
    semester: '1학기·3학점',
    type: 'required',
    desc: '기초적인 데이터 처리 및 분석 역량의 <br> 토대 형성을 주요 목적으로 파이썬 언어를 학습합니다.',
    followup: '후속 과목: 인공지능개론',
  },
  {
    name: '인공지능 개론',
    year: 1,
    semester: '1학기·3학점',
    type: 'required',
    desc: '인공지능의 기본 개념과 역사, 대표적인 알고리즘 <br> (기계학습, 신경망 등)에 대해 전반적으로 소개합니다.',
    followup: '선이수 과목: 데이터분석기초 ⇆ 후속 과목: AI 시스템 활용',
  },
  {
    name: 'SW/HW <br> 플랫폼 설계',
    year: 2,
    semester: '2학기·3학점',
    type: 'required',
    desc: '임베디드 시스템을 기반으로 하드웨어와 소프트웨어를<br> 통합 설계하는 과목. 센서 연동, 장치 제어 등을 실습합니다.',
    followup: '선이수 과목: 미적분학,통계기초 ⇆ 후속 과목: 인공지능개론',
  },
  {
    name: '데이터마이닝 <br> 및 응용실습',
    year: 3,
    semester: '1학기·3학점',
    type: 'required',
    desc: '방대한 데이터를 분석해 숨겨진 패턴, 군집 등 <br> 유용한 정보를 추출하는 실습 위주로 구성되어 있습니다.',
    followup:
      '선이수 과목: 데이터분석기초, 통계기초 ⇆ 후속 과목: AI 시스템 활용',
  },
  {
    name: '소프트웨어 공학',
    year: 3,
    semester: '2학기·3학점',
    type: 'required',
    desc: '소프트웨어 개발 생애주기 전반(요구 분석, 설계, <br> 구현, 테스트)을 배우고 협업 중심 개발 방식을 실습합니다.',
    followup: '선이수 과목: 객체지향프로그래밍⇆ 후속 과목: 시스템 구축 과목',
  },
  {
    name: 'AI 정보보안',
    year: 3,
    semester: '1학기·3학점',
    type: 'elective',
    desc: 'AI 시스템에서 발생할 수 있는 보안 이슈, 데이터 유출 <br> 문제를 다루며, 암호화 기술과 보안 정책을 실습합니다.',
    followup: '선이수 과목: 운영체제 ⇆ 후속 과목: 보안 기반 AI 응용 과목',
  },
  {
    name: '데이터 모델 <br> 및 시각화',
    year: 3,
    semester: '2학기·3학점',
    type: 'elective',
    desc: '데이터를 체계적으로 설계하고 Tableau,Power BI, <br> Python 등을 통해 시각화하는 방법을 학습합니다.',
    followup: '선이수 과목: 데이터분석기초 ⇆ 후속 과목: 데이터사이언스',
  },
  {
    name: '의사결정 <br> 지원 시스템',
    year: 4,
    semester: '1학기·2학점',
    type: 'elective',
    desc: 'AI 기반 예측 모델, 전문가 시스템, 통계적 판단 <br> 알고리즘 등을 의사결정 시나리오에 적용합니다.',
    followup: '선이수 과목: 의료DB설계, 정밀의료 ⇆ 후속 과목: BM 프로젝트',
  },
  {
    name: 'BM 프로젝트',
    year: 4,
    semester: '2학기·3학점',
    type: 'elective',
    desc: '데이터를 기반으로 한 AI 비즈니스 모델을 <br> 설계하고 프로토타입을 제안하는 실무형 수업입니다.',
    followup:
      '선이수 과목: 데이터사이언스, AI 플랫폼 설계 ⇆ 후속 과목: 졸업논문',
  },
];

const searchInput = document.getElementById('searchInput');
const yearButtons = document.querySelectorAll('.year-buttons button');
const requiredContainer = document.getElementById('required-subjects');
const electiveContainer = document.getElementById('elective-subjects');
const navItems = document.querySelectorAll('.nav-item');
const subjectDetailList = document.getElementById('subject-detail-list');

let currentYear = 1;

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
              ? `<button class="complete-button"><i class="fas fa-check"></i> 수강완료</button>`
              : `
                <button class="add-button"><i class="fas fa-plus"></i> 담기</button>
                <button class="complete-button"><i class="fas fa-check"></i> 수강</button>
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

function setupButtonToggle() {
  const buttons = document.querySelectorAll('.subject-buttons button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
    });
  });
}

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
      alert(`'${filtered[idx].name}' 과목의 수강평 페이지로 이동합니다.`);
    });
  });
}

yearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentYear = parseInt(button.value);
    yearButtons.forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    renderSubjects(currentYear, searchInput.value);
  });
});

searchInput.addEventListener('input', () => {
  renderSubjects(currentYear, searchInput.value);
});

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((i) => i.classList.remove('selected'));
    item.classList.add('selected');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector(`.year-buttons button[value="1"]`)
    .classList.add('selected');
  renderSubjects(1);
});
