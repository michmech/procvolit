function init(){
  $("#next").on("click keyup", goNext);
  $("#prev").on("click keyup", goPrev);
  $("#final").on("click keyup", finish);
  $("#again").on("click keyup", restart);
  $("#restart").on("click keyup", restart);
  $("#start").on("click keyup", start);
  start();
}

function start(e){
  if(!e || e.type=="click" || (e.type=="keyup" && e.key=="Enter")) {
    shuffleArray(qs);
    renderQuestion(0);
  }
}

function renderQuestion(qi){
  var q=qs[qi];
  var $html=$($("#templateQuestion").html());
  $html.find(".title .questionNumber").html(qi+1);
  $html.find(".title .questionTotal").html(qs.length);
  $html.find(".question").html(q.question);
  q.answers.map(a => {
    var $html2=$($("#templateAnswer").html());
    $html2.addClass(a.value);
    if(q.answer==a.value) $html2.addClass("on");
    $html2.find(".bubble").html(a.text);
    $html.find(".answers").append($html2);
  });
  $html.find(".answer").on("click keyup", setAnswer);
  $("#invelope").hide().html($html).fadeIn();
  updateButtons();
}

function renderVerdict(verdict, showSubverdict){
  var $html=$($("#templateVerdict").html());
  $html.find(".verdict").html(verdict);
  $html.find(".finalscore").html($("#score").html());
  if(!showSubverdict) $html.find(".subverdict").hide();
  $("#invelope").hide().html($html).fadeIn();
  updateButtons();
}

function setAnswer(e){
  if(e.type=="click" || (e.type=="keyup" && e.key=="Enter")) {
    if($(".answers .answer.on.yes").length>0) updateScore("yes", -1);
    if($(".answers .answer.on.no").length>0) updateScore("no", -1);
    if($(".answers .answer.on.maybe").length>0) updateScore("maybe", -1);
    var qi=parseInt($("#invelope .title .questionNumber").html())-1;
    qs[qi].answer=null;
    var $answer=$(e.target).closest(".answer");
    if($answer.hasClass("on")){
      $(".answers .answer").removeClass("on");
    } else {
      $(".answers .answer").removeClass("on");
      $answer.addClass("on");
      if($answer.hasClass("yes")) {updateScore("yes", 1); qs[qi].answer="yes";}
      if($answer.hasClass("no")) {updateScore("no", 1); qs[qi].answer="no";}
      if($answer.hasClass("maybe")) {updateScore("maybe", 1); qs[qi].answer="maybe";}
    }
    if(e.type=="click") $answer.blur();
  }
}

function updateScore(value, increment){
  var score=parseInt($("#score ."+value).html());
  score=score+increment;
  $("#score ."+value).html(score);
  if(value=="maybe") {if(score==0) $("#score .maybe").hide(); else $("#score .maybe").show();}
  var total=parseInt($("#score .yes").html())+parseInt($("#score .no").html())+parseInt($("#score .maybe").html());
  if(total==0) $("#restart").hide(); else $("#restart").show();
}

function goNext(e){
  if(e.type=="click" || (e.type=="keyup" && e.key=="Enter")) {
    var qi=parseInt($("#invelope .title .questionNumber").html());
    renderQuestion(qi);
    $(document).scrollTop(0);
    var $clicked=$(e.delegateTarget);
    $clicked.blur();
  }
}

function goPrev(e){
  if(e.type=="click" || (e.type=="keyup" && e.key=="Enter")) {
    var qi=parseInt($("#invelope .title .questionNumber").html())-2;
    if(isNaN(qi)) qi=qs.length-1;
    renderQuestion(qi);
    $(document).scrollTop(0);
    var $clicked=$(e.delegateTarget);
    $clicked.blur();
  }
}

function restart(e){
  if(e.type=="click" || (e.type=="keyup" && e.key=="Enter")) {
    qs.map(q => { q.answer=null });
    $("#score > span").html("0");
    shuffleArray(qs);
    renderQuestion(0);
    var $clicked=$(e.delegateTarget);
    $(document).scrollTop(0);
    $clicked.blur();
  }
}

function finish(e){
  if(e.type=="click" || (e.type=="keyup" && e.key=="Enter")) {
    var yes=parseInt($("#score .yes").html());
    var no=parseInt($("#score .no").html());
    var maybe=parseInt($("#score .maybe").html());
    var known=yes+no+maybe;
    var unknown=qs.length-known;

    var verdict="";
    var showSubverdict=true;
    if(unknown>qs.length/2) verdict="Zdá se, že si svoje názory radši necháváš pro sebe.";
    else if(yes==qs.length) verdict=shuffleArray(["Stoprocentní shoda! Ty a Strana zelených jste si souzeni.", "No jasně! Ty a Strana zelených jste si souzeni."])[0];
    else if(yes+(maybe/2)>no && no<2) verdict=shuffleArray(["Dost dobrý! Ty a Strana zelených se na většině věcí shodnete.", "No jasně! Vypadá to, že ty a Strana zelených jste kompatibilní."])[0];
    else if(yes+(maybe/2)>no && no>=2) verdict=shuffleArray(["Perfektní shoda to není, ale na většině věcí se ty a Strana zelených shodnete.", "Perfektní shoda to není, ale vypadá to, že ty a Strana zelených jste kompatibilní."])[0];
    else if(yes>0 || maybe>0) {verdict="Ty a Strana zelených mnoho společného nemáte, ale na pár věcech se shodnete."; showSubverdict=false; }
    else {verdict="Hm. Ty a Strana zelených se asi budete muset shodnout na tom, že se na ničem neshodnete."; showSubverdict=false; }

    renderVerdict(verdict, showSubverdict);
    $(document).scrollTop(0);
    var $clicked=$(e.delegateTarget);
    $clicked.blur();
  }
}

function updateButtons(){
  var qi=parseInt($("#invelope .title .questionNumber").html())-1;
  if(qi==0) $("#prev").hide(); else $("#prev").show();
  if(isNaN(qi) || qi>=qs.length-1) $("#next").hide(); else $("#next").show();
  if(qi==qs.length-1) $("#final").show(); else $("#final").hide();
  if(isNaN(qi)) $("#again").show(); else $("#again").hide();
  if(isNaN(qi)) $("#score").hide(); else $("#score").show();
  if(isNaN(qi)) $("#tools").hide(); else $("#tools").show();
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}
