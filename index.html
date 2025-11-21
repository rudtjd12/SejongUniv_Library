<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8" />
    <title>좌석 상태 데모</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
        }
        .card {
            background: #ffffff;
            padding: 24px 28px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            text-align: center;
            max-width: 360px;
            width: 100%;
        }
        .seat-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 12px;
        }
        .status {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .status span {
            font-weight: 700;
        }
        .status-free {
            color: #2e7d32;
        }
        .status-used {
            color: #c62828;
        }
        button {
            padding: 10px 18px;
            font-size: 16px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
        }
        #toggle {
            background: #1976d2;
            color: #fff;
        }
        #toggle:active {
            opacity: 0.85;
        }
        .info {
            margin-top: 14px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>

<div class="card">
    <div id="seat-title" class="seat-title">좌석</div>
    <div id="status" class="status">상태: <span>알 수 없음</span></div>
    <button id="toggle">상태 변경</button>
    <div class="info">
        이 상태는 이 기기(브라우저)에만 저장됩니다.
    </div>
</div>

<script>
    // 1. URL 파라미터에서 seat 번호 읽기: ?seat=12 이런 식
    const params = new URLSearchParams(window.location.search);
    const seat = params.get("seat");

    const seatTitleEl = document.getElementById("seat-title");
    const statusEl = document.getElementById("status");
    const toggleBtn = document.getElementById("toggle");

    if (!seat) {
        // seat 파라미터가 없으면 에러 메시지
        seatTitleEl.textContent = "좌석 정보 없음";
        statusEl.innerHTML = "URL에 <code>?seat=번호</code>가 필요합니다.";
        toggleBtn.disabled = true;
    } else {
        seatTitleEl.textContent = seat + "번 좌석";

        const key = "seat_" + seat; // localStorage key
        let state = localStorage.getItem(key) || "빈자리"; // 기본값: 빈자리

        function render() {
            const span = statusEl.querySelector("span");
            span.textContent = state;

            // 색상 클래스 초기화
            span.classList.remove("status-free", "status-used");

            if (state === "빈자리") {
                span.classList.add("status-free");
                toggleBtn.textContent = "이 좌석 사용 시작";
            } else {
                span.classList.add("status-used");
                toggleBtn.textContent = "이 좌석 비우기";
            }
        }

        render();

        toggleBtn.addEventListener("click", () => {
            state = (state === "빈자리") ? "사용중" : "빈자리";
            localStorage.setItem(key, state);
            render();
        });
    }
</script>

</body>
</html>
