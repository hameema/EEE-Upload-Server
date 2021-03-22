$(function () {
  var form1 = document.getElementById("form1");
  var form2 = document.getElementById("form2");

  form1.addEventListener("submit", (e) => {
    e.preventDefault();
    uploadFiles(form1);
  });
  form2.addEventListener("submit", (e) => {
    e.preventDefault();
    uploadFiles(form2);
  });

  function uploadFiles(form) {
    if (form.id === "form1") {
      var formdata = new FormData(form);
    } else {
      var formdata = new FormData();
      for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].type === "file") {
          for(let j = 0; j < form.elements[i].files.length; j++) {
            formdata.append(`file${j}`, form.elements[i].files[j]);
          }
        } else {
          formdata.append(form.elements[i].name, form.elements[i].value);
        }
      }
    }
    var subjectId = form.elements["subject-id"].value;
    var filetype = form.elements["filetype"].value;
    var url = `/upload/${subjectId}/${filetype}`
    console.log(url);
    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", url);
    ajax.send(formdata);
  }

  function progressHandler(event) {
    var percent = Math.round((event.loaded / event.total) * 100);
    $(".progress-bar").css("width", percent + "%");
  }

  function completeHandler(event) {
    $(".progress-bar").css("width", 0 + "%");
    alert("Upload Complete")
  }

  function errorHandler(event) {
    alert("Upload Failed");
  }

  function abortHandler(event) {
    alert("Upload Aborted");
  }
});
