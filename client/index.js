(function($){
	$(document).ready(function(){
		$('.player').click(function(e){
			var posX = $(this).offset().left,
			posY = $(this).offset().top,
			x = e.pageX - posX
			y = e.pageY - posY
			percentX = x / $(this).width() * 100,
			percentY = y / $(this).height() * 100;
			$.post('http://82.38.95.234:8080/',{x:percentX,y:percentY},function(){
				$('<div/>')
				.prependTo('.player')
				.css({
					'position':'absolute',
					'left':percentX+'%',
					'top':percentY+'%',
					'height':'1rem',
					'width':'1rem',
					'z-index':22,
					'border':'1px solid red',
					'margin-left':'-0.5rem',
					'margin-top':'-0.5rem',
					'border-radius':'30px'
				})
				.fadeOut('slow',function(){
					$(this).remove();
				});
			});
		});
	});
})($);