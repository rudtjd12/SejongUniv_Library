// ============================================================
// [설정] 상수
// ============================================================
const WARNING_LIMIT_MS = 3 * 60 * 60 * 1000;      // 외출 제한 3시간
const BAN_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 정지 2주
const BASE_USAGE_LIMIT_MS = 6 * 60 * 60 * 1000;   // 기본 사용 6시간
const EXTENSION_DURATION_MS = 3 * 60 * 60 * 1000; // 연장 3시간
const EXTENSION_WINDOW_MS = 2 * 60 * 60 * 1000;   // 종료 2시간 전부터 연장 가능
const MAX_EXTENSIONS = 2;                         // 최대 연장 2회

// [설정] 롤링 문구
const nudgeMessages = [
    "세종대생 95%는 외출 3시간 약속을 정확히 지킵니다.",
    "지금 당신의 배려가, 도서관 문화를 만듭니다.",
    "빈자리는 짐이 아니라, 다음 사람에게 양보해 주세요.",
    "지난달, 1,200명의 학우가 퇴실 버튼을 눌러 배려했습니다.",
    "이 자리는 내일의 당신이 다시 앉고 싶어 할 자리입니다.",
    "전체 이용자 95%는 외출버튼을 누릅니다.",
    "외출, 퇴실 또 까먹었죠? 얼른 눌러주세요.",
    "또 그냥 나가려 하셨나요? 퇴실 버튼은 필수입니다.",
    "외출 안하고 나가는 당신의 양심은 안녕하십니까?"
];

// ============================================================
// [로직 1] 시크릿 로고 & 개발자 버튼 UI 생성
// ============================================================
let logoClickCount = 0;
const logoImg = document.getElementById("secret-logo");

// 1. 기존 HTML에 있는 버튼 (외출 테스트용으로 사용)
const testBtnOut = document.getElementById("btn-test-add-time");

// 2. [신규] 반반 버튼을 담을 컨테이너 생성
const btnRow = document.createElement("div");
btnRow.style.display = "none"; // 처음엔 숨김
btnRow.style.gap = "10px";
btnRow.style.marginTop = "10px";
btnRow.style.width = "100%";

// 3. [신규] 왼쪽 버튼: 연장 가능 상태 만들기
const testBtnExtend = document.createElement("button");
testBtnExtend.className = "btn-test"; 
testBtnExtend.textContent = "조건 충족 (연장 ON)";
testBtnExtend.style.margin = "0"; 
testBtnExtend.style.flex = "1";   
testBtnExtend.style.background = "#1976d2"; 
testBtnExtend.style.display = "block"; // [핵심 수정] 숨김 속성 강제 해제!

// 4. [신규] 오른쪽 버튼: 10초 전 만들기 (자동 퇴실)
const testBtnExpire = document.createElement("button");
testBtnExpire.className = "btn-test";
testBtnExpire.textContent = "10초 전 (자동퇴실)";
testBtnExpire.style.margin = "0";
testBtnExpire.style.flex = "1";   
testBtnExpire.style.background = "#d32f2f"; 
testBtnExpire.style.display = "block"; // [핵심 수정] 숨김 속성 강제 해제!

// 컨테이너에 버튼 2개 넣기
btnRow.appendChild(testBtnExtend);
btnRow.appendChild(testBtnExpire);

// 기존 버튼 뒤에 컨테이너 붙이기
if(testBtnOut && testBtnOut.parentNode) {
    testBtnOut.parentNode.insertBefore(btnRow, testBtnOut.nextSibling);
}

// 로고 클릭 이벤트
logoImg.addEventListener("click", () => {
    logoClickCount++;
    if (logoClickCount === 5) {
        // 버튼들 모두 보이기
        if(testBtnOut) {
            testBtnOut.style.display = "block";
            testBtnOut.textContent = "[개발자] 외출 시간 +3h (경고 테스트)";
        }
        
        // 반반 컨테이너 보이기 (flex 모드)
        btnRow.style.display = "flex";
        
        alert("🛠️ 개발자 모드 활성화: 입/퇴실 시뮬레이션 버튼이 추가되었습니다.");
        
        logoImg.style.transform = "scale(1.2)";
        setTimeout(() => logoImg.style.transform = "scale(1)", 200);
        logoClickCount = 0;
    }
});

// ============================================================
// [로직 2] 설명 팝업 (Modal) 제어
// ============================================================
const modal = document.getElementById("infoModal");

function openModal() {
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("show"), 10);
}

function closeModalBtn() {
    modal.classList.remove("show");
    setTimeout(() => modal.style.display = "none", 300);
}

function closeModal(event) {
    if (event.target === modal) {
        closeModalBtn();
    }
}

// ============================================================
// [로직 3] 롤링 문구
// ============================================================
let msgIndex = 0;
const msgElement = document.getElementById("footer-msg");

function rotateMessage() {
    if(nudgeMessages.length > 0) {
        msgElement.style.opacity = 0;
        setTimeout(() => {
            msgElement.textContent = nudgeMessages[msgIndex];
            msgElement.style.opacity = 1;
            msgIndex = (msgIndex + 1) % nudgeMessages.length;
        }, 300);
    }
}
rotateMessage(); 
setInterval(rotateMessage, 6000); 

// ============================================================
// [로직 4] URL 및 중복 검사
// ============================================================
const params = new URLSearchParams(window.location.search);
const seatNum = params.get("seat");
const activeSeat = localStorage.getItem("device_active_seat");

if (activeSeat && seatNum && activeSeat !== seatNum) {
    alert(`🚫 오류: 이미 ${activeSeat}번 좌석을 이용 중입니다!\n\n해당 좌석 대시보드로 이동합니다.`);
    window.location.href = `?seat=${activeSeat}`;
    throw new Error("Redirecting...");
}

// ============================================================
// [로직 5] DOM 연결
// ============================================================
const idCard = document.getElementById("id-card");
const seatCard = document.getElementById("seat-card");
const idInputEl = document.getElementById("idInput");
const idErrorEl = document.getElementById("idError");
const seatTitleFormEl = document.getElementById("seat-title-form");
const seatTitleEl = document.getElementById("seat-title");

const studentIdTextEl = document.getElementById("student-id-text");
const warningCountEl = document.getElementById("warning-count");
const statusTextEl = document.querySelector("#status span");
const timerBox = document.getElementById("out-timer-box");
const timerText = document.getElementById("timer-text");
const usageTimerBox = document.getElementById("usage-timer-box");
const usageTimerText = document.getElementById("usage-timer-text");
const extendBtn = document.getElementById("btn-extend-time");
const warningDisplay = document.getElementById("warning-display");

const controlsIn = document.getElementById("controls-in");
const controlsOut = document.getElementById("controls-out");

let currentId = "";
let timerInterval = null;
let usageInterval = null;

// ============================================================
// [로직 6] 초기 세팅
// ============================================================
if (!seatNum) {
    seatTitleFormEl.textContent = "좌석 번호 오류";
    idErrorEl.style.display = "block";
    idErrorEl.textContent = "URL에 ?seat=번호 형식이 필요합니다.";
    document.getElementById("idSubmit").disabled = true;
} else {
    const seatInt = parseInt(seatNum); 
    if (isNaN(seatInt) || seatInt < 1 || seatInt > 165) {
        seatTitleFormEl.textContent = "유효하지 않은 좌석";
        idErrorEl.style.display = "block";
        idErrorEl.textContent = `좌석 번호는 1번부터 165번까지만 존재합니다.\n(입력된 값: ${seatNum})`;
        document.getElementById("idSubmit").disabled = true; 
    } 
    else {
        seatTitleFormEl.textContent = `제 6열람실 ${seatNum}번 좌석`;
        seatTitleEl.textContent = `제 6열람실 ${seatNum}번 좌석`;
        
        const savedId = localStorage.getItem(`seat_${seatNum}_studentId`);
        if (savedId) {
            login(savedId);
        }
    }
}

// ============================================================
// [로직 7] 이벤트 핸들러
// ============================================================

// 1. 로그인
document.getElementById("idSubmit").addEventListener("click", () => {
    const inputId = idInputEl.value.trim();
    if (!inputId) { showError("학번을 입력해주세요."); return; }
    if((inputId < 14000000) || (inputId > 25999999)){
        showError("유효하지 않은 학번입니다. (14~25학번)"); 
        return;
    }
    if (!/^\d{8}$/.test(inputId)) { showError("학번은 숫자 8자리여야 합니다."); return; }
    
    const banInfo = getStudentBanInfo(inputId);
    if (banInfo.isBanned) {
        showError(`이용 정지된 사용자입니다.\n해제일: ${banInfo.date}`);
        return;
    }

    localStorage.setItem(`seat_${seatNum}_studentId`, inputId);
    localStorage.setItem("device_active_seat", seatNum);
    login(inputId);
});

document.getElementById("btn-go-out").addEventListener("click", setOutStatus);

document.getElementById("btn-return").addEventListener("click", () => {
    checkOutDurationAndProcess(); 
    setInStatus(); 
});

document.getElementById("btn-leave").addEventListener("click", () => {
    const userCheck = confirm("퇴실하시겠습니까?\n\n빈자리는 다음 학우에게 큰 도움이 됩니다.");
    if (userCheck) logout(true);
});

document.getElementById("btn-leave-out").addEventListener("click", () => {
    checkOutDurationAndProcess();
    if (currentId) {
        const userCheck = confirm("외출 상태에서 바로 퇴실하시겠습니까?");
        if (userCheck) logout(true);
    }
});

extendBtn.addEventListener("click", () => {
    const startTime = parseInt(localStorage.getItem(`seat_${seatNum}_startTime`));
    if (!startTime) return;

    const extensions = parseInt(localStorage.getItem(`seat_${seatNum}_extensions`) || "0");
    const remaining = getUsageEndTime() - Date.now();

    if (extensions >= MAX_EXTENSIONS) {
        alert("연장은 최대 2회까지 가능합니다.");
        return;
    }
    if (remaining > EXTENSION_WINDOW_MS) {
        alert("남은 시간이 2시간 이하일 때만 연장할 수 있습니다.");
        return;
    }

    const newExtensions = extensions + 1;
    localStorage.setItem(`seat_${seatNum}_extensions`, newExtensions);
    alert(`사용 시간이 3시간 연장되었습니다. (총 ${newExtensions}회 연장)`);
    updateUsageTimer();
});

// [테스트 1] 외출 시간 +3시간 (기존 버튼)
if(testBtnOut) {
    testBtnOut.addEventListener("click", () => {
        const outStartKey = `seat_${seatNum}_outStartTime`;
        let outTime = parseInt(localStorage.getItem(outStartKey));
        if (outTime) {
            const newOutTime = Date.now() - (3 * 60 * 60 * 1000) + (5 * 1000); 
            localStorage.setItem(outStartKey, newOutTime);
            localStorage.setItem(`seat_${seatNum}_usagePauseStart`, newOutTime); 
            alert("⚡ [외출] 3시간 초과 상태로 변경! (잠시 후 경고)");
        } else {
            alert("먼저 '외출 하기' 상태여야 합니다.");
        }
    });
}

// [테스트 2] 연장 가능 상태 (남은 시간 1시간 59분)
testBtnExtend.addEventListener("click", () => {
    const startKey = `seat_${seatNum}_startTime`;
    const extKey = `seat_${seatNum}_extensions`;

    if (localStorage.getItem(startKey)) {
        const extensions = parseInt(localStorage.getItem(extKey) || "0");
        const totalDuration = BASE_USAGE_LIMIT_MS + (extensions * EXTENSION_DURATION_MS);
        
        // 목표: 남은 시간을 1시간 59분으로 설정
        const targetRemaining = 1 * 60 * 60 * 1000 + 59 * 60 * 1000;
        const trickStartTime = Date.now() - (totalDuration - targetRemaining);
        
        localStorage.setItem(startKey, trickStartTime);
        updateUsageTimer(); 
        alert(`⚡ [입실] 종료 2시간 전으로 이동!\n(연장 횟수 ${extensions}회 유지 / 버튼 활성화)`);
    } else {
        alert("먼저 '입실' 상태여야 합니다.");
    }
});

// [테스트 3] 자동 퇴실 (남은 시간 10초)
testBtnExpire.addEventListener("click", () => {
    const startKey = `seat_${seatNum}_startTime`;
    const extKey = `seat_${seatNum}_extensions`;

    if (localStorage.getItem(startKey)) {
        const extensions = parseInt(localStorage.getItem(extKey) || "0");
        const totalDuration = BASE_USAGE_LIMIT_MS + (extensions * EXTENSION_DURATION_MS);
        
        // 목표: 남은 시간을 딱 10초로 설정
        const targetRemaining = 10 * 1000; // 10초
        const trickStartTime = Date.now() - (totalDuration - targetRemaining);
        
        localStorage.setItem(startKey, trickStartTime);
        updateUsageTimer(); 
        alert(`⚡ [입실] 종료 10초 전입니다!\n자동 퇴실 로직을 확인하세요.`);
    } else {
        alert("먼저 '입실' 상태여야 합니다.");
    }
});


// ============================================================
// [기능] 다크 모드
// ============================================================
const themeBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️";
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "🌙";
    }
}

// ============================================================
// [핵심 함수]
// ============================================================
function login(id) {
    currentId = id;
    idInputEl.value = "";
    idErrorEl.style.display = "none";
    
    idCard.style.display = "none";
    seatCard.style.display = "block";
    studentIdTextEl.textContent = currentId;

    ensureUsageSession();
    startUsageTimer();

    updateWarningDisplay();

    const savedStatus = localStorage.getItem(`seat_${seatNum}_status`) || "입실";
    if (savedStatus === "외출") {
        resumeOutStatus();
    } else {
        setInStatus(false);
    }
}

function logout(showAlert = false) {
    localStorage.removeItem(`seat_${seatNum}_studentId`);
    localStorage.removeItem(`seat_${seatNum}_status`);
    localStorage.removeItem(`seat_${seatNum}_outStartTime`);
    localStorage.removeItem(`seat_${seatNum}_startTime`);
    localStorage.removeItem(`seat_${seatNum}_extensions`);
    localStorage.removeItem(`seat_${seatNum}_usagePauseStart`);
    localStorage.removeItem("device_active_seat");
    
    if (timerInterval) clearInterval(timerInterval);
    if (usageInterval) clearInterval(usageInterval);
    currentId = "";

    seatCard.style.display = "none";
    idCard.style.display = "block";
    
    if (showAlert) alert("퇴실 처리가 완료되었습니다.");
}

function setInStatus(save = true) {
    if(save) localStorage.setItem(`seat_${seatNum}_status`, "입실");
    localStorage.removeItem(`seat_${seatNum}_outStartTime`);

    const pauseStart = parseInt(localStorage.getItem(`seat_${seatNum}_usagePauseStart`));
    if (pauseStart) {
        const pausedDuration = Date.now() - pauseStart; 
        const oldStartTime = parseInt(localStorage.getItem(`seat_${seatNum}_startTime`));
        
        if (oldStartTime) {
            localStorage.setItem(`seat_${seatNum}_startTime`, oldStartTime + pausedDuration);
            alert(`⏳ 외출 시간(${Math.round(pausedDuration/1000/60)}분)만큼 좌석 사용 시간이 연장되었습니다.`);
        }
        localStorage.removeItem(`seat_${seatNum}_usagePauseStart`);
    }
    
    statusTextEl.textContent = "입실 중";
    statusTextEl.className = "status-enter";
    
    controlsIn.style.display = "block";
    controlsOut.style.display = "none";
    timerBox.style.display = "none";
    
    usageTimerBox.style.opacity = "1";
    
    if (timerInterval) clearInterval(timerInterval);
}

function setOutStatus() {
    const now = Date.now();
    localStorage.setItem(`seat_${seatNum}_status`, "외출");
    localStorage.setItem(`seat_${seatNum}_outStartTime`, now);
    
    localStorage.setItem(`seat_${seatNum}_usagePauseStart`, now);

    resumeOutStatus();
}

function resumeOutStatus() {
    statusTextEl.textContent = "외출 중";
    statusTextEl.className = "status-out";
    controlsIn.style.display = "none";
    controlsOut.style.display = "block";
    timerBox.style.display = "block";
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function ensureUsageSession() {
    const startKey = `seat_${seatNum}_startTime`;
    const extensionsKey = `seat_${seatNum}_extensions`;

    if (!localStorage.getItem(startKey)) {
        localStorage.setItem(startKey, Date.now());
    }
    if (!localStorage.getItem(extensionsKey)) {
        localStorage.setItem(extensionsKey, "0");
    }
}

function getUsageEndTime() {
    const startTime = parseInt(localStorage.getItem(`seat_${seatNum}_startTime`));
    const extensions = parseInt(localStorage.getItem(`seat_${seatNum}_extensions`) || "0");
    return startTime + BASE_USAGE_LIMIT_MS + (extensions * EXTENSION_DURATION_MS);
}

function startUsageTimer() {
    if (usageInterval) clearInterval(usageInterval);
    usageInterval = setInterval(updateUsageTimer, 1000);
    updateUsageTimer();
}

function updateUsageTimer() {
    const startTime = parseInt(localStorage.getItem(`seat_${seatNum}_startTime`));
    if (!startTime) return;

    let now = Date.now();
    let isPaused = false;

    const pauseStart = parseInt(localStorage.getItem(`seat_${seatNum}_usagePauseStart`));
    if (pauseStart) {
        now = pauseStart; // 시간을 멈춤
        isPaused = true;
    }

    const endTime = getUsageEndTime();
    const remaining = endTime - now;

    if (!isPaused && remaining <= 0) {
        clearInterval(usageInterval);
        usageInterval = null;
        alert("좌석 사용 제한 시간이 종료되었습니다. 자동으로 퇴실 처리됩니다.");
        logout(false);
        return;
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    const fmt = (n) => n.toString().padStart(2, '0');
    
    if (isPaused) {
        usageTimerText.textContent = `${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`;
        usageTimerBox.style.opacity = "0.6";
    } else {
        usageTimerText.textContent = `${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`;
        usageTimerBox.style.opacity = "1";
    }

    const extensions = parseInt(localStorage.getItem(`seat_${seatNum}_extensions`) || "0");
    const canExtend = !isPaused && remaining <= EXTENSION_WINDOW_MS && extensions < MAX_EXTENSIONS;
    
    if (!canExtend) {
        extendBtn.style.opacity = "0.5"; 
        extendBtn.style.cursor = "not-allowed";
    } else {
        extendBtn.style.opacity = "1";
        extendBtn.style.cursor = "pointer";
    }

    if (extensions >= MAX_EXTENSIONS) {
        extendBtn.textContent = "연장 불가 (최대 2회)";
    } else if (remaining > EXTENSION_WINDOW_MS) {
        extendBtn.textContent = "사용 시간 연장";
    } else {
        extendBtn.textContent = "사용 시간 연장";
    }

    if (!isPaused && remaining <= EXTENSION_WINDOW_MS) {
        usageTimerBox.style.color = "#c62828";
        usageTimerBox.style.fontWeight = "bold";
    } else {
        usageTimerBox.style.color = "#333";
        usageTimerBox.style.fontWeight = "normal";
    }
}

function updateTimer() {
    const startTime = parseInt(localStorage.getItem(`seat_${seatNum}_outStartTime`));
    if (!startTime) return;
    const now = Date.now();
    const diff = now - startTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const fmt = (n) => n.toString().padStart(2, '0');
    
    timerText.textContent = `${fmt(hours)}:${fmt(minutes)}:${fmt(seconds)}`;
    
    if (diff > WARNING_LIMIT_MS) {
        clearInterval(timerInterval);
        timerInterval = null;
        
        let warnings = parseInt(localStorage.getItem(`student_${currentId}_warnings`) || "0");
        warnings++;
        localStorage.setItem(`student_${currentId}_warnings`, warnings);
        
        let msg = `🚨 [자동 퇴실 안내]\n\n외출 제한 시간(3시간)이 초과되었습니다.\n규정에 따라 경고 1회가 부과되며, 좌석은 즉시 반납됩니다.\n(현재 누적 경고: ${warnings}회)`;
        
        if (warnings >= 3) {
            const banEndDate = Date.now() + BAN_DURATION_MS;
            localStorage.setItem(`student_${currentId}_banDate`, banEndDate);
            msg += `\n\n🚫 [이용 정지] 경고 3회 누적으로 2주간 이용이 제한됩니다.`;
        }
        
        alert(msg);
        logout(false);
    } 
    else {
        if (diff > WARNING_LIMIT_MS - (10 * 60 * 1000)) { 
            timerText.style.color = "red";
            timerText.style.fontWeight = "900";
        } else {
            timerText.style.color = "#c62828";
        }
    }
}

function checkOutDurationAndProcess() {
    const startTime = parseInt(localStorage.getItem(`seat_${seatNum}_outStartTime`));
    if (!startTime) return;
    const diff = Date.now() - startTime;
    if (diff > WARNING_LIMIT_MS) {
        addWarning(currentId);
    }
}

function getStudentBanInfo(id) {
    const banDateStr = localStorage.getItem(`student_${id}_banDate`);
    if (banDateStr) {
        const banDate = new Date(parseInt(banDateStr));
        if (new Date() < banDate) {
            return { isBanned: true, date: banDate.toLocaleDateString() };
        } else {
            localStorage.removeItem(`student_${id}_banDate`);
            localStorage.removeItem(`student_${id}_warnings`);
        }
    }
    return { isBanned: false };
}

function addWarning(id) {
    let warnings = parseInt(localStorage.getItem(`student_${id}_warnings`) || "0");
    warnings++;
    localStorage.setItem(`student_${id}_warnings`, warnings);
    if (warnings >= 3) {
        const banEndDate = Date.now() + BAN_DURATION_MS;
        localStorage.setItem(`student_${id}_banDate`, banEndDate);
        alert(`🚨 경고 3회 누적!\n규정에 따라 2주간 이용이 정지됩니다.`);
        logout(false);
    } else {
        alert(`[경고 알림] 외출 3시간 초과.\n현재 누적 경고: ${warnings}회`);
        updateWarningDisplay();
    }
}

function updateWarningDisplay() {
    const warnings = localStorage.getItem(`student_${currentId}_warnings`) || "0";
    warningCountEl.textContent = warnings;
    warningDisplay.style.display = "block";
}

function showError(msg) {
    idErrorEl.textContent = msg;
    idErrorEl.style.display = "block";
}
