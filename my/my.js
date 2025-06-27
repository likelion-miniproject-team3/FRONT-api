document.addEventListener('DOMContentLoaded', function () {
  const userInfoStr = localStorage.getItem('userInfo');
  const userNameDisplay = document.getElementById('userNameDisplay');

  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      userNameDisplay.textContent = userInfo.username || '이름 없음';
    } catch (e) {
      userNameDisplay.textContent = '이름 없음';
    }
  } else {
    userNameDisplay.textContent = '이름 없음';
  }

  // ✅ 현재 페이지 경로
  const currentPage = window.location.pathname.split('/').pop();

  document.querySelectorAll('.bottom-nav .nav-item').forEach((item) => {
    const href = item.getAttribute('href');

    if (href === currentPage) {
      item.classList.add('active');
    }

    if (href === 'home.html') {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const field = userInfo?.field;

        let targetPage = '/home/home.html'; // 기본값

        switch (field) {
          case '대학원 진학형':
            targetPage = '/home/daehakwon/daehakwon.html';
            break;
          case '빅데이터 분야':
            targetPage = '/home/bigdata/bigdata.html';
            break;
          case 'AI/클라우드 분야':
            targetPage = '/home/ai/ai.html';
            break;
          case '마이크로 전공형':
            targetPage = '/home/micro/micro.html';
            break;
        }
        window.location.href = targetPage;
      });
    }
  });
});
