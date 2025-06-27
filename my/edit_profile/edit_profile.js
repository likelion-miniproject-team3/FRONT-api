document.addEventListener('DOMContentLoaded', function () {
  // 사용자 정보 불러오기
  const userInfoStr = localStorage.getItem('userInfo');

  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);

      // HTML 요소에 데이터 삽입
      document.getElementById('nicknameDisplay').innerText =
        userInfo.usernickname || '';
      document.getElementById('studentNumberDisplay').innerText =
        userInfo.usernumber || '';
      document.getElementById('emailDisplay').innerText =
        userInfo.useremail || '';
    } catch (e) {
      console.error('사용자 정보 불러오기 실패:', e);
    }
  } else {
    console.warn('userInfo가 localStorage에 없음');
  }

  // 닉네임 저장 버튼 클릭 이벤트 (edit_nickname.html에서 사용)
  const saveBtn = document.querySelector('.save-button');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      const updatedNickname = document.getElementById('nickname').value;

      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userInfo.usernickname = updatedNickname;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        alert('닉네임이 성공적으로 수정되었습니다!');
      } catch (e) {
        alert('저장 중 오류가 발생했습니다.');
      }
    });
  }

  // 사진 버튼 팝업 토글
  const cameraBtn = document.querySelector('.camera-btn');
  const uploadOptions = document.getElementById('uploadOptions');

  if (cameraBtn && uploadOptions) {
    cameraBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      uploadOptions.classList.toggle('hidden');
    });

    document.addEventListener('click', function (e) {
      if (!uploadOptions.contains(e.target) && !cameraBtn.contains(e.target)) {
        uploadOptions.classList.add('hidden');
      }
    });
  }

  // 업로드 옵션 클릭 처리
  const galleryOption = document.querySelector('#uploadOptions li:first-child');
  const fileOption = document.querySelector('#uploadOptions li:last-child');

  const galleryInput = document.createElement('input');
  galleryInput.type = 'file';
  galleryInput.accept = 'image/*';
  galleryInput.style.display = 'none';
  document.body.appendChild(galleryInput);

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  if (galleryOption) {
    galleryOption.addEventListener('click', () => {
      galleryInput.click();
    });
  }

  if (fileOption) {
    fileOption.addEventListener('click', () => {
      fileInput.click();
    });
  }

  // ✅ 하단 홈 버튼 클릭 시 진로에 따라 분기 이동
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
