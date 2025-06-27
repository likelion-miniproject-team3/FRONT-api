document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('nicknameInput');
  const submitBtn = document.getElementById('submitNicknameBtn');

  // 기존 닉네임 placeholder 설정
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    input.placeholder = userInfo.usernickname || '닉네임을 입력해주세요';
  } catch (e) {
    input.placeholder = '닉네임을 입력해주세요';
  }

  // ✅ 실시간 입력 길이에 따라 버튼 스타일 변경
  input.addEventListener('input', () => {
    const length = input.value.trim().length;
    if (length >= 2 && length <= 10) {
      submitBtn.classList.add('active');
    } else {
      submitBtn.classList.remove('active');
    }
  });

  // 닉네임 변경 처리
  submitBtn.addEventListener('click', () => {
    const newNickname = input.value.trim();
    if (newNickname.length < 2 || newNickname.length > 10) {
      alert('닉네임은 2자 이상 10자 이하로 입력해주세요.');
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
      userInfo.usernickname = newNickname;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      alert('닉네임이 변경되었습니다!');
      window.location.href = '/my/edit_profile/edit_profile.html';
    } catch (e) {
      alert('닉네임 저장 중 오류가 발생했습니다.');
    }
  });
  const homeBtn = document.querySelector('a[href="home.html"]');
  if (homeBtn) {
    homeBtn.addEventListener('click', function (e) {
      e.preventDefault();

      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        const field = userInfo.field;

        let targetPage = '/home/home.html'; // 기본 홈

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
      } catch (e) {
        console.error('진로 정보 없음:', e);
        window.location.href = '/home/home.html'; // fallback
      }
    });
  }
});
