$(document).ready(main);

function main() {

	// hide jumbotron until navigation bar finishes loading
	$(".jumbotron").hide();
	// load navigation bar
	$("#navbarheader").load("navigationbar.html",function(){
		$(".jumbotron").show();
	});
		
  // cache selectors
  var $imperialTab = $("#imperialTab"),
    $metricTab = $("#metricTab"),
    $infoPanel1 = $("#infoPanel1"),
    $infoPanel2 = $("#infoPanel2"),
    $infoPanel3 = $("#infoPanel3"),
    $button1 = $("#button1"),
    $button2 = $("#button2"),
    $button3 = $("#button3"),
    $calcButton = $("#calcButton"),
    $calcResultsBox = $("#calcResultsBox"),
    $weight = $("#weight"),
    $heightDiv = $("#heightDiv"),
    $heightInput = $("#heightInput"), //heightInput is either ft or cm
    $heightInputIn = $("#heightInputIn"),
    $age = $("#age"),
    $slider = $("#slider"),
    $weightTarget = $("#weightTarget"),
    imperial = true;
		
  // expand or collapse the descriptions
  $infoPanel1.on("shown.bs.collapse", function() {
    $button1.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
  });
  $infoPanel1.on("hidden.bs.collapse", function() {
    $button1.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
  });
  $infoPanel2.on("shown.bs.collapse", function() {
    $button2.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
  });
  $infoPanel2.on("hidden.bs.collapse", function() {
    $button2.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
  });
  $infoPanel3.on("shown.bs.collapse", function() {
    $button3.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
  });
  $infoPanel3.on("hidden.bs.collapse", function() {
    $button3.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
  });

  // only allow numerical input in the text fields
  $("input[type='text']").keypress(digitsOnly);

  // slider control
  $slider.slider({
    min: 0,
    max: 2.5,
    value: 1,
    step: 0.1,
    slide: function(event, ui) {
      // update the weightTarget label when the slider is moved
      if (imperial)
        $weightTarget.text(ui.value + " lb");
      else
        $weightTarget.text(ui.value + " kg");
    }
  });

  // change units when a tab is clicked. Run changeUOM() on page load.
  changeUOM();
  $metricTab.click(function() {
    imperial = false;
    changeUOM();
  });
  $imperialTab.click(function() {
    imperial = true;
    changeUOM();
  });
  $calcButton.click(calculate); // displays results after clicking the Calculate button

  // calculate the stuff
  function calculate() {
    if (validateInputs()) {
      if ($age.val() > 110) {
        $calcResultsBox.removeClass("hidden").html("<span style='color:red'>Invalid Age</span>");
      } else if (($weight.val() > 600 && imperial) || ($weight.val() > 270 && !imperial)) {
        $calcResultsBox.removeClass("hidden").html("<span style='color:red'>Invalid Weight</span>");
      } else if (imperial) { // calculation if imperial units
        if ($heightInputIn.val() > 12) {
          inchesConvert();
        }
        var BMR = Math.round(calculateBMR());
        var TDEE = Math.round(calculateBMR() * 1.2);
        var BMI = calculateBMI();
        $calcResultsBox.removeClass("hidden").html(
          "To lose " + $slider.slider("value") + " lb per week, you would need to eat " + Math.round((TDEE - 500 * $slider.slider("value"))) + "* kcal per day (not including exercise).<br/><br/>BMR: " + BMR + " kcal<br/>TDEE: " + TDEE + " kcal<br/>BMI: " + BMI + "</td><br/><br/>* Eating less than 1200 kcal daily is not recommended.");
      } else {
        // calculation if metric units
        var BMR = Math.round(calculateBMR());
        var TDEE = Math.round(calculateBMR() * 1.2);
        var BMI = calculateBMI();
        $calcResultsBox.removeClass("hidden").html(
          "To lose " + $slider.slider("value") + " kg per week, you would need to eat " + Math.round((TDEE - 1102 * $slider.slider("value"))) + "* kcal per day (not including exercise).<br/><br/>BMR: " + BMR + " kcal<br/>TDEE: " + TDEE + " kcal<br/>BMI: " + BMI + "</td><br/><br/>* Eating less than 1200 kcal daily is not recommended.");
      }
    } else
      $calcResultsBox.removeClass("hidden").html("<span style='color:red'>Please fill in all fields.</span>");
  }

  // check if all fields are filled
  function validateInputs() {
    if ($("input[type='radio']:checked").val() && $age.val().length > 0 && $weight.val().length > 0 && ($heightInput.val().length > 0 || $heightInputIn.val().length > 0))
      return true;
    else
      return false;
  }

  // only allow numerical input into text fields
  function digitsOnly(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }
  }

  // calculates BMR
  function calculateBMR() {
    if (imperial) {
      var BMR = 4.53592 * $weight.val() + 6.25 * (30.48 * $heightInput.val() + 2.54 * $heightInputIn.val()) - 5 * $age.val()
      if ($("#radio1:checked").val())
        return BMR + 5;
      else
        return BMR - 151;
      return BMR;
    } else {
      var BMR = 10 * $weight.val() + 6.25 * $heightInput.val() - 5 * $age.val();
      if ($("#radio1:checked").val())
        return BMR + 5;
      else
        return BMR - 151;
      return BMR;
    }
  }

  // calculates BMI
  function calculateBMI() {
    if (imperial) {
      var totalIn = 12 * (parseInt($heightInput.val()) || 0) + (parseInt($heightInputIn.val()) || 0);
      var BMI = 703 * ($weight.val() / Math.pow(totalIn, 2));
      BMI = (Math.round(BMI * 10) / 10); // rounds to 1 decimal point
      if (BMI < 18.5)
        return (BMI + " - 'Underweight'");
      else if (BMI >= 18.5 && BMI <= 24.9)
        return (BMI + " - 'Normal'");
      else if (BMI > 24.9 && BMI <= 29.9)
        return (BMI + " - 'Overweight'");
      else
        return (BMI + " - 'Obese'");
      return BMI;
    } else {
      var BMI = $weight.val() / Math.pow($heightInput.val() / 100, 2);
      BMI = (Math.round(BMI * 10) / 10); // rounds to 1 decimal point
      if (BMI < 18.5)
        return (BMI + " - 'Underweight'");
      else if (BMI >= 18.5 && BMI <= 24.9)
        return (BMI + " - 'Normal'");
      else if (BMI > 24.9 && BMI <= 29.9)
        return (BMI + " - 'Overweight'");
      else
        return (BMI + " - 'Obese'");
      return BMI;
    }
  }

  // convert inches to feet if inch input is greater than 12
  function inchesConvert() {
    var newFt = parseInt($heightInput.val()) || 0;
    var newIn = parseInt($heightInputIn.val());
    while (newIn >= 12) {
      newFt++;
      newIn -= 12;
    }
    $heightInput.val(newFt);
    $heightInputIn.val(newIn);
  }

  // change units from imperial to metric or vice versa
  function changeUOM() {
    if (imperial) {
      $weight.attr('placeholder', 'lb').val("");
      //$heightDiv.removeClass("col-md-6").addClass("col-md-3");
      $heightInput.attr('placeholder', 'ft').val("");
      $heightInputIn.removeClass("hidden").val("");
      $slider.slider({
        min: 0,
        max: 2.5,
        value: 1,
        step: 0.1,
      });
      $weightTarget.text($slider.slider("value") + " lb");
    } else {
      $weight.attr('placeholder', 'kg').val("");
      //$heightDiv.removeClass("col-md-3").addClass("col-md-6");
      $heightInput.attr('placeholder', 'cm').val("");
      $heightInputIn.addClass("hidden").val("");
      $slider.slider({
        min: 0,
        max: 1.15,
        value: 0.45,
        step: 0.05,
      });
      $weightTarget.text($slider.slider("value") + " kg");
    }
  }
};