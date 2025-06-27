// home.js

document.addEventListener('DOMContentLoaded', () => {
  const homeBtn = document.getElementById('home-button');

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      fetch('/api/auth/login') // 또는 토큰 기반 사용자 정보 요청
        .then((res) => {
          if (!res.ok) throw new Error('사용자 정보 불러오기 실패');
          return res.json();
        })
        .then((user) => {
          const field = user.field;

          if (field === '대학원 진학형') {
            location.href = 'daehakwon.html';
          } else if (field === '빅데이터 분야') {
            location.href = 'bigdata.html';
          } else if (field === 'ai/클라우드 분야') {
            location.href = 'ai.html';
          } else if (field === '마이크로 전형') {
            location.href = 'micro.html';
          } else {
            alert('희망 분야 정보가 없습니다.');
          }
        })
        .catch((err) => {
          console.error(err);
          alert('홈 이동에 실패했습니다.');
        });
    });
  }
});
