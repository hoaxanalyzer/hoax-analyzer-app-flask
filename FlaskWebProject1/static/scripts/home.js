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
    $("#ha-input").fadeOut().css("display", "none");
    $("#ha-dyk").fadeIn().css("display", "block");
    $("#ha-loader").fadeIn().css("display", "block");
    $("#ha-research").fadeIn().css("display", "block");

	  query = $("#hoax-analyzer.ha-main-input").val();
	  callAnalyzerAPI(query);
  }else{
    alert("Input not valid. The input must be more than 3 words. Please try again.");
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
