let video;
let facemesh;
let predictions = [];

function setup() {
  createCanvas(640, 480);

  // 建立視訊捕捉
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 facemesh 模型
  facemesh = ml5.facemesh(video, modelReady);

  // 當模型偵測到臉部特徵時，更新 predictions
  facemesh.on("predict", (results) => {
    predictions = results;
  });

  // 等待用戶互動後啟動 AudioContext
  userStartAudio();
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function userStartAudio() {
  let button = createButton("Start Audio");
  button.position(10, 10);
  button.mousePressed(() => {
    getAudioContext().resume().then(() => {
      console.log("AudioContext resumed");
      button.remove(); // 移除按鈕
    });
  });
}

function draw() {
  background(220);

  // 顯示視訊
  image(video, 0, 0, width, height);

  // 繪製臉部特徵點（如果有）
  drawKeypoints();
}

function drawKeypoints() {
  for (let i = 0; i < predictions.length; i++) {
    const keypoints = predictions[i].scaledMesh;

    for (let j = 0; j < keypoints.length; j++) {
      const [x, y] = keypoints[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(x, y, 5, 5);
    }
  }
}