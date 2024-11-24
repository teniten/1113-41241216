// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, set, update, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIVW_wM5vGdNp2VlfqJXBjxDixdRqF5S4",
  authDomain: "project-3114685523754369152.firebaseapp.com",
  databaseURL: "https://project-3114685523754369152-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "project-3114685523754369152",
  storageBucket: "project-3114685523754369152.appspot.com",
  messagingSenderId: "660853900271",
  appId: "1:660853900271:web:d25b218d662fe80e516c1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

// DOM 元素
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPhoto = document.getElementById('userPhoto');
const lastLogin = document.getElementById('lastLogin');

// 將日期轉換為 CST 時間格式
function formatDateToCST(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Taipei",  // 設定時區為中原標準時間
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

// Google Sign-In
function googleSignIn(isRegister) {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const userRef = ref(database, 'members/' + user.uid);

      if (isRegister) {
        // 註冊新用戶
        set(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString()
        })
          .then(() => {
            alert('註冊成功！請重新登入。');
          })
          .catch((error) => {
            console.error('註冊失敗：', error.message);
          });
      } else {
        // 檢查用戶是否已註冊
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            // 如果已註冊，更新最後登入時間
            const data = snapshot.val();
            const formattedLoginTime = formatDateToCST(data.lastLogin); // 格式化最後登入時間為 CST
            update(userRef, { lastLogin: new Date().toISOString() });
            userName.textContent = data.name;
            userEmail.textContent = data.email;
            userPhoto.src = data.photoURL;
            lastLogin.textContent = formattedLoginTime;
            userInfo.style.display = 'block';
          } else {
            // 如果未註冊，提示用戶註冊
            alert('此帳號尚未註冊，請先進行註冊！');
          }
        });
      }
    })
    .catch((error) => {
      console.error('Google 登入失敗：', error.message);
    });
}

// 註冊按鈕事件
registerBtn.addEventListener('click', () => googleSignIn(true));

// 登入按鈕事件
loginBtn.addEventListener('click', () => googleSignIn(false));
