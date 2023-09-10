// Tạo biến canvas
var canvas = document.getElementById("gamezone");
var context = canvas.getContext('2d');
var scoreshow = document.getElementById("score");
var sound = document.getElementById("sound");
// Khởi tạo 4 đối tượng
var hinhnenchinh = new Image();
var birdimg = new Image();
var ongtren = new Image();
var ongduoi = new Image();
var quatrung = new Image();
var sugia = new Image();
var lose = new Image();


// Nạp các ảnh vào
hinhnenchinh.src = "images/hds.jpg";
birdimg.src = "images/bird.png";
ongtren.src = "images/ongtren.png";
ongduoi.src = "images/ongduoi.png";
quatrung.src = "images/quatrung.png";
sugia.src = "images/sugia.png";
lose.src = "images/lose.jpg";

// Khoảng cách hai ống
var score = 0;
var khoangcachhaiong = 300;
var khoangcachdenongduoi;

// Thiết lập vị trí của vật
var bird = {
    x: hinhnenchinh.width / 5,
    y: hinhnenchinh.height / 2
};

// Tạo mảng chứa các ống
var ong = [];
ong[0] = {
    x: canvas.width,
    y: 0 // Khởi tạo ống đầu tiên nằm bên phải ngoài cùng và y=0;
};

// Mảng chứa các sứ giả
var sugias = [];

var sugiaLoaded = false;

// Nạp hình ảnh và xử lý sự kiện sau khi hình ảnh đã được tải xong
sugia.onload = function () {
    sugiaLoaded = true;
};

// Hàm tạo sứ giả mới và thêm vào mảng sugias
function taoSugia() {
    if (sugiaLoaded) {
        var minY = canvas.height / 2 - 250; // Giới hạn y tối thiểu
        var maxY = canvas.height / 2 + 250; // Giới hạn y tối đa

        var sugiaObj = {
            x: canvas.width,
            y: Math.random() * (maxY - minY) + minY
        };
        sugias.push(sugiaObj);
    }
}

// Hàm gọi tạo sứ giả sau mỗi khoảng thời gian
function taoSugiaDinhKy() {
    taoSugia(); // Gọi hàm tạo sứ giả
    setTimeout(taoSugiaDinhKy, 1000); // Gọi lại hàm tạo sứ giả sau mỗi 5 giây
}

// Biến để kiểm tra trạng thái của chú chim (lên, xuống, trái, phải)
var isMovingUp = false;
var isMovingDown = false;
var isMovingLeft = false;
var isMovingRight = false;

// Biến để kiểm tra trạng thái của quả trứng
var isEggFlying = false;
var eggX = bird.x;
var eggY = bird.y;

// Sự kiện bắt phím xuống
document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        case 38: // Mũi tên lên
        case 87: // Phím w
            isMovingUp = true;
            break;
        case 40: // Mũi tên xuống
        case 83: // Phím s
            isMovingDown = true;
            break;
        case 37: // Mũi tên trái
        case 65: // Phím a
            isMovingLeft = true;
            break;
        case 39: // Mũi tên phải
        case 68: // Phím d
            isMovingRight = true;
            break;
    }
});

// Sự kiện bắt phím nhả ra
document.addEventListener("keyup", function (event) {
    switch (event.keyCode) {
        case 38: // Mũi tên lên
        case 87: // Phím w
            isMovingUp = false;
            break;
        case 40: // Mũi tên xuống
        case 83: // Phím s
            isMovingDown = false;
            break;
        case 37: // Mũi tên trái
        case 65: // Phím a
            isMovingLeft = false;
            break;
        case 39: // Mũi tên phải
        case 68: // Phím d
            isMovingRight = false;
            break;
    }
});

// Sự kiện bắt phím xuống hoặc click chuột
document.addEventListener("keydown", function (event) {
    if (!isEggFlying && (event.keyCode === 32 || event.type === "click")) {
        // Phát âm thanh
        sound.play();
        isEggFlying = true;
        eggX = bird.x;
        eggY = bird.y;
    }
});

// Hàm để vẽ các sứ giả
function veSugias() {
    for (var i = 0; i < sugias.length; i++) {
        var sugiaObj = sugias[i];
        context.drawImage(sugia, sugiaObj.x, sugiaObj.y);
        sugiaObj.x -= 5; // Để sứ giả di chuyển sang trái

        // Kiểm tra va chạm với quả trứng
        if (
            eggX + quatrung.width >= sugiaObj.x &&
            eggX <= sugiaObj.x + sugia.width &&
            eggY + quatrung.height >= sugiaObj.y &&
            eggY <= sugiaObj.y + sugia.height
        ) {
            // Xóa sứ giả và đặt lại trạng thái cho quả trứng
            score++;
            score++;
            score++;
            score++;
            score++;
            sugias.splice(i, 1);
            isEggFlying = false;
            i--;
            continue;
        }

        // Nếu sứ giả ra khỏi màn hình, xóa sứ giả khỏi mảng
        if (sugiaObj.x + sugia.width < 0) {
            sugias.splice(i, 1);
            i--;
        }
    }
}

// Biến lưu trữ góc xoay của ống trên và ống dưới
var pipeRotateAngle = 0;

// Function để vẽ ống trên và ống dưới
function drawPipe(pipeImage, x, y) {
    context.drawImage(pipeImage, x, y);
}

// Function để chạy trò chơi
function run() {
    // Vẽ hình nền và vật (bird)
    context.drawImage(hinhnenchinh, 0, 0);
    context.drawImage(birdimg, bird.x, bird.y);

    // Vẽ hai ống
    for (var i = 0; i < ong.length; i++) {
        khoangcachdenongduoi = ongtren.height + khoangcachhaiong;

        // Vẽ ống trên và ống dưới
        drawPipe(ongtren, ong[i].x, ong[i].y);
        drawPipe(ongduoi, ong[i].x, ong[i].y + khoangcachdenongduoi);

        // Cập nhật góc xoay của ống
        pipeRotateAngle += 2;
        if (pipeRotateAngle >= 360) {
            pipeRotateAngle = 0;
        }

        ong[i].x -= 5; // Để ống di chuyển

        // Khi ống đến giữa màn hình
        if (ong[i].x == canvas.width / 2) {
            ong.push({
                x: canvas.width,
                y: Math.floor(Math.random() * ongtren.height) - ongtren.height // Làm cho ống xuất hiện ngẫu nhiên
            });
        }

        if (ong[i].x == 0) ong.splice(0, 1); // Nếu ống đụng lề trái thì xóa nó đi để tránh mảng ống

        if (ong[i].x == 180) {
            score++;
        }

        // Điều kiện khi thua
        if (bird.y < 0 || bird.y > canvas.height ||
            bird.x + birdimg.width >= ong[i].x && bird.x <= ong[i].x + ongtren.width &&
            (bird.y <= ong[i].y + ongtren.height ||
                bird.y + birdimg.height >= ong[i].y + khoangcachdenongduoi)
        ) {
            // Thua - xuất hiện hình "lose" xoay 360 độ ở giữa màn hình
            var rotateAngle = 0;
            var rotateInterval = setInterval(function () {
                rotateAngle += 10;
                if (rotateAngle >= 360) {
                    clearInterval(rotateInterval);
                    context.drawImage(lose, canvas.width / 2 - lose.width / 2, canvas.height / 2 - lose.height / 2);

                    // Hiển thị số điểm
                    var text = "Số điểm mà bạn đạt được: " + score;
                    context.font = "24px Arial";
                    context.fillStyle = "#ffffff";
                    context.fillText(text, canvas.width / 2 - context.measureText(text).width / 2, canvas.height / 2 - 50);

                    // Click vào hình "lose" để bắt đầu lại game
                    canvas.addEventListener("click", function () {
                        location.reload();
                    });
                } else {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.save();
                    context.translate(canvas.width / 2, canvas.height / 2);
                    context.rotate(rotateAngle * Math.PI / 180);
                    context.drawImage(lose, -lose.width / 2, -lose.height / 2);
                    context.restore();
                }
            }, 50);

            return;
        }

    }

    scoreshow.innerHTML = "Điểm: " + score;

    // Cho chú chim di chuyển lên khi biến isMovingUp là true
    if (isMovingUp) {
        bird.y -= 5;
    }
    // Cho chú chim di chuyển xuống khi biến isMovingDown là true
    if (isMovingDown) {
        bird.y += 5;
    }
    // Cho chú chim di chuyển sang trái khi biến isMovingLeft là true
    if (isMovingLeft) {
        bird.x -= 5;
    }

    // Cho chú chim di chuyển sang phải khi biến isMovingRight là true
    if (isMovingRight) {
        bird.x += 5;
    }

    // Nếu quả trứng đang bay
    if (isEggFlying) {
        eggX += 10; // Tăng tọa độ x của quả trứng để nó di chuyển sang phải

        // Nếu quả trứng ra khỏi màn hình, đặt lại trạng thái cho quả trứng
        if (eggX > canvas.width) {
            isEggFlying = false;
        }
    }

    // Vẽ quả trứng nếu đang bay
    if (isEggFlying) {
        context.drawImage(quatrung, eggX, eggY);
    }

    veSugias();

    requestAnimationFrame(run);
}

// Gọi hàm tạo sứ giả định kỳ
taoSugiaDinhKy();

// Chạy game
run();
