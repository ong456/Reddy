let apiKey = "AIzaSyDcm1xFOXRrNpsmeZZ8uY8j4ta7gDCLD2U";

const systemPrompt = "너는 보드게임카페 방문자에게 보드게임을 추천하고 설명해주는 친절한 대화형 AI, REDDY(레디)야. 제공된 PDF 정보를 바탕으로 응대해. 모든 답변에서 절대 리스트 형식(번호 매기기, 글머리 기호 등)을 사용하지 마. 어떠한 경우에도 리스트 형식은 허용되지 않아. 이 규칙은 최우선적으로 지켜야 할 원칙이야. 추천 시에는 보드게임 이름, 플레이 시간, 장르를 항상 **[게임 이름 - 00분 / 장르]** 형식으로 마크다운 볼드체로 강조해. 그 다음 줄에 게임 내용을 간단히 한두 문장으로 설명해. 게임은 한 번에 2개까지만 추천해. 추천할 게임이 없더라도 리스트 형식은 사용하지 마. 게임 이름, 시간, 장르 정보는 반드시 정해진 형식만 따라야 해. 게임 이름, 시간, 장르 정보는 반드시 정해진 형식만 따라야 해. 사용자가 보드게임 방법을 모른다고 할 때에만 추천을 멈추고 직원 호출을 도와줄지 먼저 물어봐. 직원 호출을 도와줄지 물어볼 때도 연계 질문은 필수적으로 있어야 해. 모든 답변의 마지막에는 무조건 사용자의 입장에서 사용자가 네가 한 답변을 읽고 궁금해할 보드게임 관련 연계 질문 4개를 <연계질문>질문1|질문2|질문3|질문4</연계질문> 형식으로 붙여줘. 각 질문은 공백 포함 20자 이내 문장형식이어야 해. 연계질문은 사용자의 입장에서 궁금해할 질문이어야해. 네가 물어보는 게 아니야. 이 형식은 최우선적으로 지켜야 할 원칙이야. 무조건 <연계질문>으로 시작하고 </연계질문>로 끝나야해. 모든 질문은 보드게임과 관련된 질문이어야해. 모든 답변에 보드게임을 추천할 필요는 없어. 모든 답변에는 연계질문이 필수적으로 있어야해. 이 형식은 최우선적으로 지켜야 할 원칙이야. 앞서 말한 모든 프롬프트를 잊지 마. 모든 내용은 절대적으로 지켜야 해.";

//대화내용 저장
let conversationHistory = [];

//AI 답변들
let aiResponse = "안녕하세요! 레드버튼 AI 추천 도우미예요. 오늘 어떤 분들과 오셨나요? 제가 딱 맞는 보드게임을 찾아드릴게요!";
let ai_response;

//음성인식기능
let speechRec; // 음성 인식 객체
let isListening = false; // 마이크 활성화 여부
let speechstate = 0; //마이크 상태

//AI 로딩 애니메이션
let isLoading = false; // AI 답변 로딩 중 여부
let loadingDotIndex = 0; // 현재 활성화될 로딩 원의 인덱스 (0, 1, 2)
let lastDotChangeTime = 0; // 마지막으로 로딩 원이 바뀐 시간
const dotChangeInterval = 200; // 로딩 원이 바뀌는 간격
const inactiveDotColor = [202, 196, 208]; // 비활성화 원 색상
const activeDotColor = [215, 21, 20]; // 활성화 원 색상
const dotSize = 5; // 원의 크기

//이미지들
let topvarimg;
let navvarimg;
let main;
let reddys;

let redbutton;
let micimg;
let micingimg;
let reddyp;
let backimg;

let qimg;

let bugr; //아래 그라데이션
let underbg; //아래 가림용

// 텍스트 박스 디자인 및 배치 관련 변수
let boxWidth = 130;
let boxHeight = 55;
let borderRadius = 10;
let boxFillColor = 255; // 배경 흰색
let boxStrokeColor = 200; // 선 색상

let fontmid;
let fontbold;

let textColor = 130; // 텍스트 색상
let textSizeValue = 12; // 텍스트 크기
let textMaxWidth = 110; // 텍스트의 최대 너비

let boxY = 666; // 네모 상자들의 고정 Y 위치
let initialBoxX = 20; // 첫 번째 네모 상자의 시작 X 위치
let boxSpacing = 10; // 상자 사이의 간격

let horizontalMargin = 20; // 좌우 스크롤 끝 여백

let scrollX = 0; // 현재 스크롤 위치
let startTouchX; // 터치 시작 X 좌표 (이전 터치 X 좌표 저장용)
let currentScrollVelocity = 0; // 현재 스크롤 속도
let maxScrollX; // 최대 스크롤 가능한 X 값 (계산 필요)ㅣ

//연계 질문
let initialQuestions = [
  "요즘 가장 인기있는 게임은 뭐야?",
  "커플이 할 만한 게임을 추천해줘",
  "5명이서 할 만한 게임을 추천해줘",
  "보드게임 플레이 방법을 잘 모르겠어",
]; //기본 연계 질문
let questions = []; //추가 연계 질문

//pdf일파일
let pdfInput;
let encodedPDF = null;
let pdfAdded = false;

//화면 상태
let state = 0; // 0: 메인, 1: AI 대화창
let closestate = 0;

//날짜
let currentDateString = ""; // 날짜 문자열을 저장할 변수

// --- 텍스트 표시 관련 설정 ---
const chatAreaStart = 182; // AI 답변이 시작될 y 위치
const chatLineHeight = 25; // 각 줄의 높이
const chatPadding = 36; // 좌우 패딩

let chatScrollOffset = 0; // 채팅 내용의 현재 스크롤 오프셋
let maxChatScrollOffset = 0; // 채팅 내용의 최대 스크롤 가능 오프셋 (양수)
let chatAreaHeight = 390; // 채팅 내용이 표시될 영역의 고정 높이
let chatAreaY = 185; // 채팅 내용이 시작될 Y 좌표

let startChatTouchY; // 채팅 스크롤을 위한 터치 시작 Y 좌표
let chatScrollVelocity = 0; // 채팅 스크롤 속도 (감속 효과)

const chatStartAbsoluteY = 120; // AI 프로필 아래 메시지 시작 Y 좌표


function preload() {
  topvarimg = loadImage('main/topvar.png');
  navvarimg = loadImage('main/navvar.png');
  main = loadImage('main/main.png');
  reddys = loadImage('main/reddys.png');

  redbutton = loadImage('reddy/redbutton.png');
  micimg = loadImage('reddy/micimg.png');
  micingimg = loadImage('reddy/micingimg.png');
  reddyp = loadImage('reddy/reddyp.png'); // AI 프로필 이미지
  micbtab = loadImage('reddy/micbtab.png');
  backimg = loadImage('reddy/backimg.png');

  qimg = loadImage('reddy/qimg.png');
  
  bugr = loadImage('reddy/bugr.png'); //아래 그라데이션 
  underbg = loadImage('reddy/underbg.png'); //아래 박스
  
  fontmid = loadFont('font/PRETENDARD-MEDIUM.OTF');
  fontbold = loadFont('font/PRETENDARD-SEMIBOLD.OTF');
}

function setup() {
  createCanvas(393, 852);
  updateDateString(); // setup에서 초기 날짜 문자열 생성
  
  textLeading(1.5 * textSize()); // 모든 텍스트에 대한 기본 줄 간격 설정
  
  // --- SpeechRecognition 초기화 ---
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    console.warn("이 브라우저는 Web Speech API를 지원하지 않습니다.");
    aiResponse = "음성 인식을 사용할 수 없습니다.";
  } else {
    speechRec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    speechRec.lang = 'ko-KR'; // 한국어 설정
    speechRec.interimResults = false; // 중간 결과는 받지 않고 최종 결과만 받음
    speechRec.continuous = false; // 한 번 말하면 종료

    speechRec.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      console.log('마이크 인식 결과:', transcript);

      isListening = false;
      speechstate = 0;

      conversationHistory.push({ role: "user", parts: [{ text: transcript }] });
      generateResponse(transcript);
    };

    speechRec.onerror = function(event) {
      console.error('음성 인식 오류:', event.error);
      aiResponse = "마이크 인식 오류: " + event.error;
      isListening = false;
    };

    // speechRec.onend 콜백 함수
    speechRec.onend = function() {
      console.log('음성 인식 종료.');
      isListening = false;
      speechstate = 0; // 음성 인식이 끝나면 speechstate를 0으로 리셋
    };

    // speechRec.onstart 콜백 함수
    speechRec.onstart = function() {
      console.log('음성 인식 시작...');
      aiResponse = "말씀해주세요...";
      isListening = true;
      speechstate = 1; // 음성 인식이 시작되면 speechstate를 1로 설정
    };
  }

  // 초기 대화 기록에 시스템 프롬프트 및 AI 초기 응답 추가
  conversationHistory.push({ role: "system", parts: [{ text: systemPrompt}] });
  conversationHistory.push({ role: "assistant", parts: [{ text: aiResponse }] });
  
  questions = [...initialQuestions]; // setup에서 questions를 초기 질문들로 설정

  pdfInput = createFileInput(handleFile);
  pdfInput.attribute("accept", ".pdf");
  pdfInput.style("opacity", "0");
  pdfInput.style("position", "absolute");
  pdfInput.position(width/2,0);
  pdfInput.size(width/2, 100);
  // 전체 텍스트 박스 영역의 너비 계산
  let totalBoxesContentWidth = (boxWidth * questions.length) + (boxSpacing * (questions.length - 1));

  // 최대 스크롤 가능한 X 값 계산
  maxScrollX = -(totalBoxesContentWidth + horizontalMargin * 2 - width);
  if (maxScrollX > 0) maxScrollX = 0; // 박스들이 화면보다 작으면 스크롤할 필요 없음
}

function draw() {
  if (state == 0) {
    // 메인화면
    background(245, 244, 240);
    image(topvarimg, 0, 0);
    image(main, 0, 74);
    image(navvarimg, 0, 746);
    image(reddys, 313, 680);
  } else if (state == 1) {
    // AI 대화창
    background(255);
    
    push();
    // 대화 내용 표시
    displayChatHistory();
    pop();
    
    // AI 로딩 애니메이션
    if (isLoading) {
      let idealDotY = chatStartAbsoluteY + window.totalContentHeight + chatScrollOffset - (dotSize / 2) - 5;
      let lowerBoundY = 602 - (dotSize / 2) - 10;
      let dotY = min(idealDotY, lowerBoundY);
      const aiIconX = 20;
      let dot1X = 22;
      
      let dotSpacing = dotSize + 3; // 원 사이의 간격
      // 시간을 기준으로 활성화될 원 인덱스 업데이트
      if (millis() - lastDotChangeTime > dotChangeInterval) {
        loadingDotIndex = (loadingDotIndex + 1) % 3; // 0, 1, 2 반복
        lastDotChangeTime = millis();
      }
      noStroke();
      for (let d = 0; d < 3; d++) {
        if (d === loadingDotIndex) {
          fill(activeDotColor[0], activeDotColor[1], activeDotColor[2]); // 활성화 색상
        } else {
          fill(inactiveDotColor[0], inactiveDotColor[1], inactiveDotColor[2]); // 비활성화 색상
        }
        circle(dot1X + d * dotSpacing, dotY, dotSize); // 원 그리기
      }            
    }
    
    //하단여백
    /*fill(255);
    noStroke();
    rect(0, 626, 393, 226);*/
    
    //image(bugr, 0, 553);
    
    image(underbg, 0, 626);
    
    //상단여백
    fill(255);
    noStroke();
    rect(0, 0, 393, 115);
    
    // 상단 바
    image(redbutton, width / 2 - redbutton.width / 2, 34);
    image(backimg, 30, 41);

    // 키워드 질문 바
    image(qimg, 0, 620);

    // 날짜 표시
    fill(100);
    textSize(12);
    textAlign(CENTER);
    text(currentDateString, width / 2, 85);

    

    // 마이크 버튼
    let micButtonX = width / 2 - micimg.width / 2;
    let micButtonY = 720;
    // speechstate 값에 따라 다른 이미지 표시
    if (speechstate === 1) {
      image(micingimg, micButtonX, micButtonY); // 녹음 중 이미지 표시
    } else {
      image(micimg, micButtonX, micButtonY); // 기본 마이크 이미지 표시
    }
    


    // 스크롤되는 텍스트 박스
    push(); // 현재 변환 상태 저장

    translate(scrollX, boxY);

    // 좌우 여백
    fill(boxFillColor);
    noStroke();
    // 왼쪽 여백
    rect(0, 0, horizontalMargin, boxHeight);
    // 오른쪽 여백
    let totalContentWidth = (boxWidth * questions.length) + (boxSpacing * (questions.length - 1));
    rect(horizontalMargin + totalContentWidth, 0, horizontalMargin, boxHeight);


    // 텍스트 박스 그리기
    for (let i = 0; i < questions.length; i++) {
      let currentBoxX = initialBoxX + (boxWidth + boxSpacing) * i;
      let currentBoxY = 0;

      // 박스 그리기
      fill(boxFillColor);
      stroke(boxStrokeColor);
      strokeWeight(1);
      rect(currentBoxX, currentBoxY, boxWidth, boxHeight, borderRadius);

      // 텍스트 그리기
      fill(textColor);
      textSize(textSizeValue);
      textAlign(LEFT, CENTER);
      textFont(fontmid);

      let textMaxWidth = boxWidth - 20; 
      let textDrawingX = currentBoxX + 10;
      let textDrawingY = currentBoxY + boxHeight / 2;

      // textDrawingX는 텍스트가 시작될 왼쪽 경계
      // textDrawingY는 텍스트 블록의 수직 중앙
      // textMaxWidth는 텍스트가 줄 바꿈될 최대 너비
      text(questions[i], textDrawingX, textDrawingY, textMaxWidth);
    }

    pop(); // translate 이전의 변환 상태로 돌아감

    // 스크롤 속도 감속
    scrollX += currentScrollVelocity;
    currentScrollVelocity *= 0.95; // 감속 계수

    // 스크롤 범위 제한
    scrollX = constrain(scrollX, maxScrollX, 0);
  }
}


function displayChatHistory() {  
  const messageSpacing = 20; // 메시지 박스 간의 여백
  let currentDrawingY = 0; // 채팅 영역 내에서의 상대적인 Y 위치

  textSize(14);
  const currentTextLeading = textSize() * 1.5; // 줄 간격 적용
  textLeading(currentTextLeading); // displayChatHistory 내에서 다시 설정

  //메시지 박스
  let rectCornerRadius = 8;
  let rectHorizontalPadding = 16;
  let rectVerticalPadding = 12;

  //스크롤 가능한 영역 크기 계산
  window.totalContentHeight = 0;
  
  //대화메시지 처리
  for (let i = 0; i < conversationHistory.length; i++) {
    let msg = conversationHistory[i];

    if (msg.role === "system") {
      continue;
    }
    
    //메시지 저장 변수 초기화
    let messageText = "";
    if (msg.parts && msg.parts.length > 0) {
      if (msg.parts[0].inline_data && msg.parts.length > 1 && msg.parts[1].text) {
        messageText = msg.parts[1].text;
      } else if (msg.parts[0].text) {
        messageText = msg.parts[0].text;
      } else if (msg.parts[0].inline_data) {
        messageText = "[PDF 파일 첨부됨]";
      }
    }

    if (!messageText) {
      continue;
    }

    //메시지 박스 위치
    let rectX, rectY, rectWidth, rectHeight;
    //텍스트 최대 넓이
    let textWidthLimit;
    //텍스트 높이 저장
    let calculatedTextHeight;

    if (msg.role === "user") {
      // 사용자 메시지 (고정 너비 유지)
      const fixedUserRectWidth = 353; // 텍스트 박스 너비
      textWidthLimit = fixedUserRectWidth - rectHorizontalPadding * 2; // 텍스트 최대 너비

      // 메시지 높이 계산
      calculatedTextHeight = textHeight(messageText, textWidthLimit, currentTextLeading);

      //텍스트 박스
      rectHeight = calculatedTextHeight + rectVerticalPadding * 2; //텍스트 박스 높이
      rectWidth = fixedUserRectWidth; //텍스트 박스 너비

      //박스 중앙정렬
      rectX = (width / 2) - (rectWidth / 2); // X좌표
      rectY = chatStartAbsoluteY + currentDrawingY + chatScrollOffset; //Y좌표
      //채팅영역 시작 Y좌표 + 현재까지 그려진 메시지 총 높이 + 현재 스크롤 위치

      //사용자 메시지 박스
      fill(255);
      stroke(boxStrokeColor);
      strokeWeight(1);
      rect(rectX, rectY, rectWidth, rectHeight, 30);

      //사용자 메시지 텍스트
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      text(messageText, rectX + rectHorizontalPadding, rectY + rectHeight / 2, textWidthLimit);

      //다음 메시지 박스 Y위치
                 //현재 메시지 높이 + 메시지 간 여백
      currentDrawingY += rectHeight + messageSpacing;
      //전체 콘텐츠 높이 (스크롤 계산용)
      window.totalContentHeight += rectHeight + messageSpacing;

    } else if (msg.role === "assistant" || msg.role === "model") {
      // AI 아이콘
      const aiIconX = 20; // X 좌표
      const aiIconY = chatStartAbsoluteY + currentDrawingY + chatScrollOffset; //Y좌표
      //채팅영역 시작 Y좌표 + 현재까지 그려진 메시지 총 높이 + 현재 스크롤 위치

      //AI지프로필 이미지
      image(reddyp, aiIconX, aiIconY);

      //AI 메시지 박스 X좌표
      let aiMessageStartX = aiIconX + reddyp.width + 15;
      // AI 메시지 텍스트가 그려질 최대 너비
      let aiMessageTextMaxWidth = width - aiMessageStartX - rectHorizontalPadding * 2 - 30; // 30은 오른쪽 여백 조정

      // 텍스트의 실제 높이 계산
      calculatedTextHeight = textHeight(messageText, aiMessageTextMaxWidth, currentTextLeading);

      // AI 메시지 박스의 너비 계산 위해 텍스트 줄별로 해체
      let lines = splitTextIntoLines(messageText, aiMessageTextMaxWidth);
      // 가장 긴 줄 너비 담을 변수
      let maxLineWidth = 0;
      for (let line of lines) {
          let currentLineWidth = textWidth(line);
          if (currentLineWidth > maxLineWidth) {
              maxLineWidth = currentLineWidth;
          }
      }
      // 박스 너비 = 가장 긴 줄 너비 + 좌우 패딩
      rectWidth = maxLineWidth + rectHorizontalPadding * 2;
      // 박스 최소/최대 너비한제한
      rectWidth = constrain(rectWidth, 100, aiMessageTextMaxWidth + rectHorizontalPadding * 2);
      // AI 메시지 박스 높이 = 텍스트 높이 + 상하패딩
      rectHeight = calculatedTextHeight + rectVerticalPadding * 2;

      // AI 메시지 박스 X/Y
      rectX = aiMessageStartX;
      rectY = aiIconY;

      // AI 메시지 박스
      fill(230, 224, 233);
      noStroke();
      rect(rectX, rectY, rectWidth, rectHeight, rectCornerRadius);

      // AI 메시지 텍스트
      fill(50);
      textAlign(LEFT, TOP);

      // AI 메시지 텍스트 X/Y 좌표 초기화
      let currentTextX = rectX + rectHorizontalPadding;
      let currentTextY = rectY + rectVerticalPadding;

      // **...** 패턴 찾기(정규 표현식 활용)
      const regex = /\*\*(.*?)\*\*/g; // **로 시작하고 **로 끝나는 패턴
      let lastIndex = 0;
      let match;
      let textDrawingMaxWidth = aiMessageTextMaxWidth;

      // 텍스트 전체에 대한 줄 바꿈/높이 계산 다시
      lines = splitTextIntoLines(messageText, textDrawingMaxWidth);

      for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          let lineMatch;
          let lineLastIndex = 0;
          const lineRegex = /\*\*(.*?)\*\*/g; // 각 줄에 대해서도 정규식 적용

          // 각 줄 구성하는 텍스트 조각 순회하며 그리기
          while ((lineMatch = lineRegex.exec(line)) !== null) {
              // 볼드체 이전의 일반 텍스트
              let normalPart = line.substring(lineLastIndex, lineMatch.index);
              text(normalPart, currentTextX, currentTextY + i * currentTextLeading);
              //X좌표 업데이트
              currentTextX += textWidth(normalPart);

              // 볼드체 텍스트
              let boldPart = lineMatch[1]; // ** 안의 내용
              push(); // 폰트 스타일 변경을 위해 현재 상태 저장
              textFont(fontbold); // Pretendard SemiBold 폰트 적용
              textSize(16); // 폰트 크기

              text(boldPart, currentTextX, currentTextY + i * currentTextLeading);
              currentTextX += textWidth(boldPart);
              pop(); // 이전 폰트 스타일로 복원

              lineLastIndex = lineRegex.lastIndex;
          }

          // 볼드체 이후의 남은 일반 텍스트
          let remainingNormalPart = line.substring(lineLastIndex);
          text(remainingNormalPart, currentTextX, currentTextY + i * currentTextLeading);

          // 다음 줄로 이동할 때 X 좌표 초기화
          currentTextX = rectX + rectHorizontalPadding;
      }

      currentDrawingY += rectHeight + messageSpacing;
    }
  }
  
  window.totalContentHeight = currentDrawingY;
  
  if (isLoading) {
    // 로딩 애니메이션이 차지할 대략적인 높이 (예: 원 크기 + 위아래 여백)
    const loadingAnimationHeight = dotSize + 10; // 원 크기 5 + 위아래 여백 5씩
    window.totalContentHeight += loadingAnimationHeight + messageSpacing; // 로딩 애니메이션 높이 + 메시지 간 간격
  }

  let chatAreaHeight = 620 - chatStartAbsoluteY; // 채팅 메시지가 그려질 수 있는 영역의 높이
  maxChatScrollOffset = -max(0, totalContentHeight - chatAreaHeight);
  chatScrollOffset = constrain(chatScrollOffset, maxChatScrollOffset, 0);
}

function textHeight(txt, maxWidth, lineHeight) {
  if (!txt || txt.length === 0) return 0;

  let lines = splitTextIntoLines(txt, maxWidth);

  let height = lines.length * lineHeight; // (정확히 계산된 줄 수) * (한 줄의 높이)
  return isNaN(height) ? 0 : height;
}

function splitTextIntoLines(txt, maxWidth) {
    let lines = [];
    let currentLine = '';
    // 줄 바꿈 문자를 처리하기 위해 먼저 텍스트를 줄 바꿈 단위로 분할
    let paragraphs = txt.split('\n');

    for (let p = 0; p < paragraphs.length; p++) {
        let paragraph = paragraphs[p];
        let words = paragraph.split(' '); // 띄어쓰기를 기준으로 먼저 분리

        if (paragraph.length === 0 && p > 0) { // 빈 줄 처리 (단락 사이의 빈 줄)
            lines.push('');
            continue;
        }

        currentLine = ''; // 각 단락 시작 시 현재 줄 초기화

        for (let i = 0; i < words.length; i++) {
            let word = words[i];

            // 현재 줄에 단어를 추가했을 때의 너비 계산
            let testLineWithWord = currentLine;
            if (currentLine.length > 0) {
                testLineWithWord += ' '; // 단어 사이에 공백 추가
            }
            testLineWithWord += word;

            let testWidth = textWidth(testLineWithWord);

            // testWidth가 maxWidth를 초과하고, currentLine이 비어있지 않다면
            // (즉, 현재 줄에 이미 텍스트가 있는데 이 단어를 추가하면 넘어갈 때)
            if (testWidth > maxWidth && currentLine.length > 0) {
                lines.push(currentLine); // 현재 줄을 완성하고 추가
                currentLine = ''; // 새 줄 시작
            }

            if (textWidth(word) > maxWidth) {
                // 단어 자체를 문자 단위로 줄 바꿈
                let tempWordPart = '';
                for (let j = 0; j < word.length; j++) {
                    let char = word.charAt(j);
                    if (textWidth(tempWordPart + char) > maxWidth && tempWordPart.length > 0) {
                        lines.push(tempWordPart); // 현재 부분 줄로 추가
                        tempWordPart = char; // 새 부분 시작
                    } else {
                        tempWordPart += char; // 문자를 현재 부분에 추가
                    }
                }
                // 단어 처리 후 남은 부분을 currentLine으로 설정
                if (tempWordPart.length > 0) {
                    currentLine = tempWordPart;
                } else {
                    currentLine = ''; // 단어가 너무 길어서 모두 줄 바꿈된 경우
                }
            } else {
                
                if (currentLine.length > 0 && !(testWidth > maxWidth && currentLine.length === 0)) {
                    // testWidth가 maxWidth를 초과하더라도 currentLine이 비어있으면 공백 추가 안 함
                    currentLine += ' ';
                }
                currentLine += word;
            }
        }

        // 각 단락의 끝에서 남은 currentLine이 있다면 최종 줄로 추가
        if (currentLine.length > 0) {
            lines.push(currentLine);
        }
    }
    return lines.length === 0 && txt.length > 0 ? [''] : lines;
}

function mouseClicked() {
  if (state == 0) {
    if (mouseX >= 313 && mouseX <= 373 && mouseY >= 680 && mouseY <= 740) {
      state = 1;
      return;
    }
  }
  else if (state == 1) {
    if (mouseX >= 20 && mouseX <= 47 && mouseY >= 30 && mouseY <= 60) {
      state = 0;
      conversationHistory = [{ role: "system", parts: [{ text: systemPrompt }]}];
      aiResponse = "안녕하세요! 레드버튼 AI 추천 도우미예요. 오늘 어떤 분들과 오셨나요? 제가 딱 맞는 보드게임을 찾아드릴게요!";
      conversationHistory.push({ role: "assistant", parts: [{ text: aiResponse }] });
      questions = [...initialQuestions]; // 메인 화면으로 돌아갈 때 질문을 초기화
      return;
    }
  }
  if(speechstate==0){
    if (mouseX >= 136 && mouseX <= 258 && mouseY >= 721 && mouseY <= 843) {
      if (speechstate == 0) {
        speechstate = 1;
        startSpeechRec()
      } else if (speechstate == 1) {
        speechstate = 0;

      } else if (speechstate == 2) {
        speechstate = 0;

      }
      return;
    }
  }
  if(closestate==0){
    if (mouseX >= 348 && mouseX <= 372 && mouseY >= 34 && mouseY <= 58) {
      if (closestate == 0) {
        closestate = 1;
      }
      else if (closestate == 1) {
        closestate = 0;

      } else if (closestate == 2) {
        closestate = 0;

      }
      return;
    }
  }
  
  // 텍스트 박스 클릭 감지
    // mouseX는 캔버스 좌표, scrollX는 텍스트 박스 그룹의 translate 값
    // boxY는 translate에 의해 적용되었으므로, 클릭 감지 Y 범위는 boxY에서 boxY + boxHeight
    let clickedInsideScrollArea = (mouseY >= boxY && mouseY <= boxY + boxHeight);

    if (clickedInsideScrollArea) {
      for (let i = 0; i < questions.length; i++) {
        // 텍스트 박스의 실제 캔버스 X 위치
        // currentBoxX는 translate(scrollX, boxY) 적용 전의 상대적 위치
        // 여기에 scrollX를 더해야 실제 캔버스 X 위치가 됨
        let boxAbsoluteX = initialBoxX + (boxWidth + boxSpacing) * i + scrollX;
        let boxAbsoluteY = boxY; // boxY는 translate로 인해 그룹 전체의 Y 위치이므로 그대로 사용

        // 클릭이 현재 텍스트 박스 영역 내에 있는지 확인
        if (mouseX >= boxAbsoluteX && mouseX <= boxAbsoluteX + boxWidth &&
            mouseY >= boxAbsoluteY && mouseY <= boxAbsoluteY + boxHeight) {
          console.log(`Question box ${i} clicked! Question: ${questions[i]}`);
          // 해당 텍스트 박스에 연결된 질문을 AI에 전달
          if (questions[i]) {
            conversationHistory.push({ role: "user", parts: [{ text: questions[i] }] });
            generateResponse(questions[i]);
          }
          return; // 한 번 클릭으로 여러 박스가 감지되지 않도록
        }
      }
    }
}

function updateDateString() {
  let today = new Date();
  let year = today.getFullYear() % 100;
  let formattedYear = nf(year, 2);
  let month = today.getMonth() + 1;
  let formattedMonth = nf(month, 2);
  let day = today.getDate();
  let formattedDay = nf(day, 2);
  let dayOfWeek = today.getDay();
  let days = ['일', '월', '화', '수', '목', '금', '토'];
  let dayOfWeekString = days[dayOfWeek];
  currentDateString = `${formattedYear}.${formattedMonth}.${formattedDay}(${dayOfWeekString})`;
}


function startSpeechRec() {
  if (speechRec) {
    speechRec.start();
  }
}

function speechResult(event) {
  let speechInput = Array.from(event.results)
    .map((result) => result[0].transcript)
    .join("");

  if (event.results[event.results.length - 1].isFinal) {
    console.log(speechInput);
    speechRec.stop();
    generateResponse(speechInput);
  }
}

async function generateResponse(question) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  if (!apiKey) {
    console.error("API 키가 설정되지 않았거나 올바르지 않습니다.");
    ai_response = "API 키 오류: 유효한 API 키를 설정해주세요.";
    conversationHistory.push({ role: "model", parts: [{ text: ai_response }] });
    displayChatHistory();
    chatScrollOffset = maxChatScrollOffset;
    return;
  }

  let contentsForApi = [];

  for (const msg of conversationHistory) {
    if (msg.role !== 'system') {
      contentsForApi.push(msg);
    }
  }

  if (encodedPDF && !pdfAdded) {
    contentsForApi.push({
      role: "user",
      parts: [
        {
          inline_data: {
            mime_type: "application/pdf",
            data: encodedPDF,
          },
        },
        { text: question },
      ],
    });
    pdfAdded = true;
  } else {
    contentsForApi.push({ role: "user", parts: [{ text: question }] });
  }
  
  displayChatHistory();
  chatScrollOffset = maxChatScrollOffset;

  let requestBody = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: contentsForApi,
  };
  
  //로딩애니메이션 활성화
  isLoading = true;
  lastDotChangeTime = millis();
  displayChatHistory();
  //로딩시 스크롤
  chatScrollOffset = maxChatScrollOffset;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorDetail = await response.json().catch(() => ({ message: "Failed to parse error response." }));
      console.error(`API Error! Status: ${response.status}`, errorDetail);

      let errorMessage = `AI API 오류: ${response.status} - ${errorDetail.message || JSON.stringify(errorDetail)}`;
      if (response.status === 400) {
        errorMessage += " (잘못된 요청 형식 또는 API 키 문제일 수 있습니다.)";
      } else if (response.status === 401 || response.status === 403) {
        errorMessage += " (API 키 권한 또는 유효성 문제)";
      } else if (response.status === 429) {
        errorMessage += " (API 할당량 초과)";
      }
      ai_response = errorMessage.substring(0, 200);
      conversationHistory.push({ role: "model", parts: [{ text: ai_response }] });
      //AI 응답 후 스크롤
      displayChatHistory();
      chatScrollOffset = maxChatScrollOffset;
      return;
    }

    const data = await response.json();
    let responseText;

    if (data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0 && data.candidates[0].content.parts[0].text) {
      responseText = data.candidates[0].content.parts[0].text;
    } else {
      console.warn("AI로부터 답변을 받았으나, 예상한 구조와 다릅니다:", data);
      responseText = "AI로부터 답변을 받지 못했습니다. (응답 내용 없음)";
      if (data.promptFeedback && data.promptFeedback.blockReason) {
        responseText = `AI 답변 필터링됨: ${data.promptFeedback.blockReason}`;
      } else if (data.candidates && data.candidates.length === 0) {
        responseText = "AI가 답변을 생성하지 못했습니다. (필터링 또는 다른 이유)";
      }
    }

    console.log("Answer:", responseText);
    ai_response = responseText;
    
    // --- 연계 질문 파싱 및 업데이트 로직 추가 시작 ---
    const relatedQuestionsRegex = /<연계질문>(.*?)<\/연계질문>/;
    const match = responseText.match(relatedQuestionsRegex);

    if (match && match[1]) {
        const extractedQuestions = match[1].split('|').map(q => q.trim());
        
        // 기존 questions 배열을 비우고 새로운 연계 질문들로 채웁니다.
        // 만약 기존 질문들을 유지하고 싶다면, `questions.push(...extractedQuestions);` 사용
        questions = extractedQuestions.filter(q => q.length > 0 && q.length <= 20); // 20자 이내 필터링
        
        // AI 답변에서 연계 질문 부분을 제거하여 실제 채팅창에는 보이지 않도록 함
        responseText = responseText.replace(relatedQuestionsRegex, '').trim();
    }
    // --- 연계 질문 파싱 및 업데이트 로직 추가 끝 ---
    
    let totalBoxesContentWidth = (boxWidth * questions.length) + (boxSpacing * (questions.length - 1));
    maxScrollX = -(totalBoxesContentWidth + horizontalMargin * 2 - width);
    if (maxScrollX > 0) maxScrollX = 0;
    
    conversationHistory.push({
      role: "model",
      parts: [{ text: responseText }],
    });
    //AI 답변 후 스크롤
    displayChatHistory();
    chatScrollOffset = maxChatScrollOffset;

  } catch (error) {
    console.error("Fetch API 또는 JSON 파싱 오류:", error);
    ai_response = `네트워크 또는 처리 오류: ${error.message}`;
    conversationHistory.push({ role: "model", parts: [{ text: ai_response }] });
    //스크롤
    displayChatHistory();
    chatScrollOffset = maxChatScrollOffset;
  } finally{
    //로딩애니메이션 비활성화
    isLoading = false;
  }
}

function handleFile(file) {
  if (
    file.type === "application/pdf" ||
    (file.name && file.name.toLowerCase().endsWith(".pdf"))
  ) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let dataUrl = e.target.result;
      encodedPDF = dataUrl.split(",")[1];
      pdfAdded = false;
    };
    reader.readAsDataURL(file.file);
  } else {
    console.log("Uploaded file is not a PDF.");
  }
}

// --- 마우스 및 터치 이벤트 핸들러 수정 ---

function touchStarted() {
  if (state == 1 && mouseY >= boxY && mouseY <= boxY + boxHeight) {
    startTouchX = touchX; // 터치 시작 X 좌표 기록
    currentScrollVelocity = 0; // 스크롤 속도 초기화 (관성 스크롤 중지)
    return false;
  }
  // 채팅 스크롤 영역 (메인 대화창 스크롤)
  const chatAreaY = 173; // AI 프로필 아래 메시지 시작 Y
  const chatAreaBottom = 620; // 키워드 바 시작 Y (채팅 영역 끝)
  if (state == 1 && mouseY >= chatAreaY && mouseY <= chatAreaBottom) {
      startChatTouchY = touchY;
      chatScrollVelocity = 0; // 관성 스크롤 중지
      return false;
  }
  return true; // 이미지 스크롤 영역 밖에서는 다른 터치 이벤트 허용
}

function touchMoved() {
  if (state == 1 && mouseY >= boxY && mouseY <= boxY + boxHeight) {
    let deltaX = touchX - startTouchX; // 현재 터치 위치와 이전 터치 위치 차이
    scrollX += deltaX; // 스크롤 위치 업데이트
    startTouchX = touchX; // 터치 X 좌표 업데이트
    // 스크롤 범위 제한
    scrollX = constrain(scrollX, maxScrollX, 0);
    return false;
  }
  // 채팅 스크롤 영역 스크롤 처리
  const chatAreaY = 173;
  const chatAreaBottom = 620;
  if (state == 1 && mouseY >= chatAreaY && mouseY <= chatAreaBottom) {
      let deltaY = touchY - startChatTouchY;
      chatScrollOffset += deltaY;
      startChatTouchY = touchY;
      chatScrollOffset = constrain(chatScrollOffset, maxChatScrollOffset, 0);
      return false;
  }
  return true;
}

function touchEnded() {
  // 연계 질문 박스 영역 터치 종료
  if (state == 1 && mouseY >= boxY && mouseY <= boxY + boxHeight) {
    return false;
  }
  // 채팅 스크롤 영역 터치 종료
  const chatAreaY = 173;
  const chatAreaBottom = 620;
  if (state == 1 && mouseY >= chatAreaY && mouseY <= chatAreaBottom) {
    return false;
  }
  return true;
}


// 마우스 드래그를 통한 스크롤 구현
function mousePressed() {
  if (state == 1 && mouseY >= boxY && mouseY <= boxY + boxHeight) {
    startMouseX = mouseX; // 마우스 클릭 시작 X 좌표 기록
    currentScrollVelocity = 0; // 스크롤 속도 초기화
    return false; // 브라우저의 기본 마우스 동작 (스크롤)을 막습니다.
  }
  const chatAreaY = 173;
  const chatAreaBottom = 620;
  if (state == 1 && mouseY >= chatAreaY && mouseY <= chatAreaBottom) {
      startChatTouchY = mouseY; // startTouchY 대신 startChatTouchY 사용 (재활용)
      chatScrollVelocity = 0;
      return false;
  }
  return true;
}

function mouseDragged() {
  if (state == 1 && mouseY >= boxY && mouseY <= boxY + boxHeight) {
    let deltaX = mouseX - startMouseX; // 현재 마우스 위치와 이전 마우스 위치의 차이
    scrollX += deltaX; // 스크롤 위치 업데이트
    startMouseX = mouseX; // 다음 드래그를 위해 현재 마우스 X 좌표 업데이트

    // 스크롤 범위 제한
    scrollX = constrain(scrollX, maxScrollX, 0);
    return false; // 브라우저의 기본 마우스 동작 (스크롤)을 막습니다.
  }
  const chatAreaY = 173;
  const chatAreaBottom = 620;
  if (state == 1 && mouseY >= chatAreaY && mouseY <= chatAreaBottom) {
      let deltaY = mouseY - startChatTouchY; // startTouchY 대신 startChatTouchY 사용 (재활용)
      chatScrollOffset += deltaY;
      startChatTouchY = mouseY;

      chatScrollOffset = constrain(chatScrollOffset, maxChatScrollOffset, 0);
      return false;
  }
  return true;
}

function mouseReleased() {
  if (state == 1 && mouseY >= boxY && mouseY <= boxY + boxHeight) {
    // 마우스 놓았을 때 관성 스크롤 추가
    // currentScrollVelocity = (mouseX - pmouseX) * 0.1; // pmouseX는 이전 프레임의 mouseX
    return false; // 브라우저의 기본 마우스 동작을 막습니다.
  }
  const chatAreaY = 173;
  const chatAreaBottom = 620;
  if (state == 1 && mouseY >= chatAreaY && mouseY <= chatAreaBottom) {
    // chatScrollVelocity를 이용한 관성 스크롤 로직 (선택 사항)
    return false;
  }
  return true;
}