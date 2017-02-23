$(document).ready(function(){
	$('#menu_icon').WCircleMenu({
		width: '50px',
		height: '50px',
		angle_start : 0,//-Math.PI/2,
		delay: 50,
		distance: 100,
		angle_interval: Math.PI/4,
		easingFuncShow:"easeOutBack",
		easingFuncHide:"easeInBack",
		step:35,
		itemRotation:360,
	});

	$('.icons').off('click').on('click',function(){
		console.log($(this).text());
	});

    //close or open function
	//$('#openWCM').off('click').on('click',function(){
	//	$('#menu_icon').WCircleMenu('open');
	//});

	//$('#closeWCM').off('click').on('click',function(){
	//	$('#menu_icon').WCircleMenu('close');
	//});

});
