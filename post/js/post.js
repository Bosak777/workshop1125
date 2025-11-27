// DOM要素の取得
const videoInput = document.getElementById('videoInput');
const videoUploadArea = document.getElementById('videoUploadArea');
const videoPreview = document.getElementById('videoPreview');
const previewVideo = document.getElementById('previewVideo');
const removeVideoBtn = document.getElementById('removeVideoBtn');
const videoInfo = document.getElementById('videoInfo');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const titleCount = document.getElementById('titleCount');
const descCount = document.getElementById('descCount');
const cancelBtn = document.getElementById('cancelBtn');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const postForm = document.getElementById('postForm');

let selectedVideo = null;

// 動画ファイル選択時の処理
videoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleVideoSelect(file);
    }
});

// アップロードエリアのクリック処理
videoUploadArea.addEventListener('click', () => {
    videoInput.click();
});

// ドラッグ&ドロップ処理
videoUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    videoUploadArea.classList.add('drag-over');
});

videoUploadArea.addEventListener('dragleave', () => {
    videoUploadArea.classList.remove('drag-over');
});

videoUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    videoUploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('video/')) {
            handleVideoSelect(file);
        } else {
            showError('動画ファイルを選択してください');
        }
    }
});

// 動画選択時の処理
function handleVideoSelect(file) {
    selectedVideo = file;
    
    // ビデオプレビューを表示
    const fileURL = URL.createObjectURL(file);
    previewVideo.src = fileURL;
    videoPreview.style.display = 'block';
    
    // 動画情報を表示
    const fileSize = (file.size / (1024 * 1024)).toFixed(2); // MB単位
    const fileType = file.type;
    videoInfo.innerHTML = `
        <strong>ファイル名:</strong> ${file.name}<br>
        <strong>ファイルサイズ:</strong> ${fileSize} MB<br>
        <strong>ファイル形式:</strong> ${fileType}
    `;
    videoInfo.style.display = 'block';
    
    // アップロードエリアをスクロール表示
    videoUploadArea.style.display = 'none';
}

// 動画削除処理
removeVideoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    selectedVideo = null;
    previewVideo.src = '';
    videoPreview.style.display = 'none';
    videoInfo.innerHTML = '';
    videoInfo.style.display = 'none';
    videoUploadArea.style.display = 'block';
    videoInput.value = '';
});

// タイトル文字数カウント
titleInput.addEventListener('input', (e) => {
    titleCount.textContent = e.target.value.length;
});

// 説明文文字数カウント
descriptionInput.addEventListener('input', (e) => {
    descCount.textContent = e.target.value.length;
});

// キャンセル処理
cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('投稿を中止しますか？入力内容は保存されません。')) {
        // フォームをリセット
        postForm.reset();
        selectedVideo = null;
        previewVideo.src = '';
        videoPreview.style.display = 'none';
        videoInfo.innerHTML = '';
        videoInfo.style.display = 'none';
        videoUploadArea.style.display = 'block';
        titleCount.textContent = '0';
        descCount.textContent = '0';
        
        // ホームページに戻る（例）
        // window.location.href = 'index.html';
    }
});

// 下書き保存処理
saveDraftBtn.addEventListener('click', (e) => {
    e.preventDefault();
    saveDraft();
});

function saveDraft() {
    const draftData = {
        title: titleInput.value,
        description: descriptionInput.value,
        videoFileName: selectedVideo ? selectedVideo.name : null,
        timestamp: new Date().toISOString()
    };
    
    // ローカルストレージに保存
    localStorage.setItem('postDraft', JSON.stringify(draftData));
    
    // 確認メッセージ
    showMessage('下書きを保存しました');
}

// メッセージ表示
function showMessage(message) {
    alert(message);
}

// エラーメッセージ表示
function showError(message) {
    alert('エラー: ' + message);
}

// ページ読み込み時に下書きを復元
window.addEventListener('load', () => {
    loadDraft();
});

function loadDraft() {
    const draftData = localStorage.getItem('postDraft');
    if (draftData) {
        try {
            const draft = JSON.parse(draftData);
            titleInput.value = draft.title || '';
            descriptionInput.value = draft.description || '';
            titleCount.textContent = titleInput.value.length;
            descCount.textContent = descriptionInput.value.length;
            
            // 下書きからの復元完了（動画ファイルはセッション終了で失われるため復元しない）
            console.log('下書きを復元しました');
        } catch (e) {
            console.error('下書きの復元に失敗しました:', e);
        }
    }
}

// ページを離れる時の確認
window.addEventListener('beforeunload', (e) => {
    if (titleInput.value || descriptionInput.value || selectedVideo) {
        e.preventDefault();
        e.returnValue = '';
    }
});
