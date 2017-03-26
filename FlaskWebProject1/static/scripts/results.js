var chart_data = [["Error", 1]]

var isSubmittedResultFeedback = false;

google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	data = new google.visualization.DataTable();
  data.addColumn('string', 'Type');
  data.addColumn('number', 'Value');
  data.addRows(chart_data);

  var options = {'width':230,
                 'height':140,
                 'chartArea': {'width': '100%', 'height': '80%'},
                pieSliceText: 'none',
                pieHole: 0.4,
                slices: {0: {color: '#4ECBDA'}, 1:{color: '#FF9198'}, 2:{color: '#DAECF3'}}
                };

  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

$(".text-display-toggle").click(function(){
  //get collapse content selector
  var collapse_content_selector = $(this).attr('href');

  //make the collapse content to be shown or hide
  var toggle_switch = $(this);
  $(collapse_content_selector).toggle(function(){
    if($(this).css('display')=='none'){
      //change the button label to be 'Show'
      toggle_switch.html('<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Show');
      hideTextInputAction();
    }else{
      //change the button label to be 'Hide'
      toggle_switch.html('<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> Hide');
      showTextInputAction();
    }
  });
});

$(".reference-feedback-button").click(function(){
  callReferenceFeedbackAPI($(this).attr("data-id") , $(this).closest('.modal').attr("data-id"));
});

$('#result-label-question').css("display", "none");

$("#radios-0").click(function(){
  $('#result-label-question').css("display", "block");
});

$("#radios-1").click(function(){
  $('#result-label-question').css("display", "block");
});

$("#radios-2").click(function(){
  $('#result-label-question').css("display", "none");
});

$(".radios-4").click(function(){
  $(this).closest('.modal').find('.reference-label-question').css("display", "block");
});

$(".radios-5").click(function(){
  $(this).closest('.modal').find('.reference-label-question').css("display", "none");
});

$('.twitter-popup').click(function(event) {
  event.preventDefault();
    
  var result_url;
    
  if(!window.location.origin) {
    result_url = window.location.protocol + "//" + window.location.hostname + window.location.pathname;
  } else {
    result_url = window.location.origin + window.location.pathname;
  }
  var tweet = 'Go check the result analysis of HoaxAnalyzer here.'; 
  window.open("http://twitter.com/intent/tweet?url=" + result_url + "&text=" + tweet, "twitterwindow", "height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0");

});

$('.fb-popup').click(function(event) {
  var result_url = window.location.href;
  var width  = 575,
  height = 400,
  left   = ($(window).width()  - width)  / 2,
  top    = ($(window).height() - height) / 2,
  url    = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(result_url) ,
  opts   =  'status=1' +
            ',width='  + width  +
            ',height=' + height +
            ',top='    + top    +
            ',left='   + left;
  window.open(url, 'facebook-share', opts);
  return false;
});
  
$('.link-share-button').click(function(event) {
  var text = window.location.href;
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
});  


function callResultFeedbackAPI(resultId){
  if(!isSubmittedResultFeedback){
    var feedback = $('input[name=is-know-radios]:checked').val();
    if(feedback == "Idk"){
      isK = "No";
      l = "";
    } 
    else{
      l = feedback;
      isK = "Yes"
    } 
    var r = $('.result-feedback-reason').val();
    if(!r){
      r = "";
    }

    $.ajax({
      type: "POST",
      url: "/feedback/result",
      data: JSON.stringify({isKnow: isK, label: l, reason: r, id:resultId}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){
        if(data.status == "Success"){
          $('#result-feedback-modal').modal('hide');
          alert("Success! Feedback successfully sent. Thank you ");
          isSubmittedResultFeedback = true;     
        }else{
          alert("Failed! " + data.message + " ");
        }
      },
      failure: function(errMsg){
        alert(errMsg);
      }
    });
  }else{
    alert("You cannot submit the result feedback more than once!");
  }
}

function callReferenceFeedbackAPI(referenceId, id){
  var isR = $('input[name=relevant-radios]:checked').val();
  var l = $('input[name=reference-label-radios]:checked').val();
  var r = $('.reference-feedback-reason').val();
  if(!l){
    l = "";
  }
  if(!r){
    r = "";
  }

  $.ajax({
    type: "POST",
    url: "/feedback/reference",
    data: JSON.stringify({isRelated: isR, label: l, reason: r, id: referenceId}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){
      if(data.status == "Success"){
        $('#reference-feedback-modal-' + id).modal('hide');
        alert("Success! Feedback successfully sent. Thank you");
      }else{
        alert("Failed! " + data.message);
      }
    },
    failure: function(errMsg){
      alert(errMsg);
    }
  });
}

function showTextInputAction(){
  $('#chart_div').fadeOut().css("display", "none");
  $('.panel-body').show();
}

function hideTextInputAction(){
  $('.panel-body').hide();
  $('#chart_div').fadeIn().css("display", "block");
}
