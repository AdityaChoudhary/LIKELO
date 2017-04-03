/* ---------------------------------------------------------------------------------------------------------------------------------------- */

window.$sass = $gre({
	vars: {},
	func: {},
	$act: function () {
		return this.is(function (self) {
			var vars = self.vars,
				done = vars.done,
				back = '';

			$use(self.$).each(function (curr, data) {
				var text = data.text,
					reps = data.reps,
					turn = data.turn;

				$for(reps, function (curr) {
					var keep = text;

					$use(turn).each(function (name, data) {
						keep = $use(keep).turn(name, data * curr).$;
					});

					back = back + keep + ' ';
				});
			});

			done(back);
		});
	}
});

/* ---------------------------------------------------------------------------------------------------------------------------------------- */

// $sass([
// 	{
// 		'text': '.wd-a1 {width: a2%;float: left;}',
// 		'reps': 100,
// 		'turn': {
// 			a1: 1,
// 			a2: 1
// 		}
// 	}
// ]).done(function (data) {
// 	$sign(data);
// });

/* ---------------------------------------------------------------------------------------------------------------------------------------- */