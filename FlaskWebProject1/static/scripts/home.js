function isInputValid(){
  var words = $("#hoax-analyzer.searchinput").val().split(" ");

  if(words.length>1){
    return true;
  }else{
    return false;
  }
}

function toStepTwo() {
  if(isInputValid()){
      $(".step-one").fadeOut().css("display", "none");
	  $(".step-two").fadeIn().css("display", "block");

	  query = $("#hoax-analyzer.searchinput").val();
	  callAnalyzerAPI(query);
  }else{
    alert("Input NOT VALID. The input must be more than 2 words. Please try again.");
  }
	
}

function callAnalyzerAPI(q) {
  $.ajax({
    type: "POST",
    url: "https://ah.lelah.ga/analyze",
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
