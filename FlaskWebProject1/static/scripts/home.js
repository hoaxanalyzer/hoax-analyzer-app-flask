function uploadImage(){
  var fileInput = $('#image-upload');
  var maxSize = fileInput.data('max-size');
  if(fileInput.get(0).files.length){
      file = fileInput.get(0).files[0];
      if (file) {
        if (!file.name.match(/.(jpg|jpeg|png|gif|tif|tiff|bmp)$/i)) {
          alert('Jenis file harus berupa JPEG, PNG, GIF, TIF, atau BMP');
          return false;
        } else {
          var fileSize = file.size; // in bytes
          if (fileSize>maxSize){
            alert('Ukuran file tidak boleh lebih besar dari ' + maxSize/(1024*1024) + ' MB');
            return false;
          } else {
            var img = new Image();
            img.src = window.URL.createObjectURL( file );
            img.onload = function() {
              var width = img.naturalWidth,
              height = img.naturalHeight;
              window.URL.revokeObjectURL( img.src );
              if (width<40 || height<40 || width>3200 || height>3200) {
                alert('Dimensi gambar harus antara 40x40 dan 3200x3200 pixels');
                return false;
              } else {
                //kirim gambar ke analyzer
              }
            }
          }
        }
      } else {
        return false;
      }
  } else {
    return false;
  }
}

function isInputValid(){
  var words = $("#hoax-analyzer.ha-main-input").val().split(" ");

  if(words.length>2){
    return true;
  }else{
    return false;
  }
}

function toStepTwo() {
  if(isInputValid()){
    $("#image-upload-group").fadeOut().css("display", "none");
    $("#ha-input").fadeOut().css("display", "none");
    $("#ha-dyk").fadeIn().css("display", "block");
    $("#ha-loader").fadeIn().css("display", "block");
    $("#ha-research").fadeIn().css("display", "block");


    query = $("#hoax-analyzer.ha-main-input").val();
    callAnalyzerAPI(query);
  }else{
    alert("Masukan tidak benar. Harus memiliki 3 kata atau lebih. Harap coba kembali.");
  }
}

function callAnalyzerAPI(q) {
  $.ajax({
    type: "POST",
    url: "https://sh.lelah.ga/analyze",
    data: JSON.stringify({query: q}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){
        window.location = "/results/" + data["id"];
    },
    failure: function(errMsg) {
        alert(errMsg);
    }
  });
}
