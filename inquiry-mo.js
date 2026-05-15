// 모바일 메뉴 제어
const mMenuBtn = document.getElementById('mMenuBtn');
const mFsMenu = document.getElementById('mFsMenu');
const mFsClose = document.getElementById('mFsClose');

if(mMenuBtn) {
    mMenuBtn.addEventListener('click', () => mFsMenu.classList.add('active'));
}
if(mFsClose) {
    mFsClose.addEventListener('click', () => mFsMenu.classList.remove('active'));
}

// 모바일 전용 상단 이동
function mScrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}