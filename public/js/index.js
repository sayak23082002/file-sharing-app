const dropZone = document.querySelector(".drop-zone");
const browseButton = document.querySelector(".browsBtn");
const fileInput = document.querySelector('#fileinput');

const bgProgress = document.querySelector(".bg-progress");

const fileURLInput = document.querySelector("#fileURL");

const copyButton = document.querySelector("#copuBtn");

const emailForm = document.querySelector("#emailForm");

const toast = document.querySelector(".toast");

const sharingContainer = document.querySelector(".sharing-container");

const progressContainer = document.querySelector(".progress-container");

const progressBar = document.querySelector(".progress-bar");

const percentDiv = document.querySelector("#percent");

const host = "https://easy-share-files.onrender.com";
const uploadURL = `${host}/api/files`;
const emailURL = `${host}/api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024;

const resetFileInput = () => {
    fileInput.value = "";
}

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
})

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
})
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
})
fileInput.addEventListener("change", () => {
    
    const delayInMilliseconds = 1000;
    setTimeout(() => {
        uploadFile();
    }, delayInMilliseconds);
})
browseButton.addEventListener("click", () => {
    fileInput.click();
})

copyButton.addEventListener("click", () => {
    fileURLInput.select();
    document.execCommand("copy");
    showToast("Link Copied")
})

const uploadFile = () => {

    if(fileInput.files.length > 1){
        resetFileInput();
        showToast("Only upload 1 file!");
        return;
    }
    
    const file = fileInput.files[0];
    
    if(file.size > maxAllowedSize){
        resetFileInput();
        showToast("Can't upload more than 100MB");
        return;
    }

    progressContainer.style.display = "block";

    const formData = new FormData();

    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            onUploadSuccess(xhr.response);
        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = () =>{
        resetFileInput();
        showToast(`Error in upload: ${xhr.statusText}`);
    }

    xhr.open("POST", uploadURL);
    xhr.send(formData);
}

const updateProgress = (e) => {
    const percent = Math.round(e.loaded / e.total) * 100;
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent/100})`;
}

const onUploadSuccess = (res) => {
    resetFileInput();
    emailForm[2].removeAttribute("disabled");
    const delayInMilliseconds = 2000;
    setTimeout(() => {
        progressContainer.style.display = "none";
        sharingContainer.style.display = "block";
        fileURLInput.value = JSON.parse(res).file;
    }, delayInMilliseconds);
}


emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = fileURLInput.value;
    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value
    }
    emailForm[2].setAttribute("disabled", "true");
    fetch(emailURL, {
        method: 'post',
        body: JSON.stringify(formData),
        mode: 'cors',
        headers: new Headers ({
            "Contect-Type": "application/json",
        })
    }).then((res) => res.json()).then((data) => {
        if(data) {
            sharingContainer.style.display = "none";
            showToast("Email Sent");
        }
    });
});

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)";
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50%, 60px)";
    }, 2000);
}
