window.$bars = $gre({
	vars: {},
	func: {},
	drop: function () {
		return this.is(function (self) {
			$when(self.$).same({
				'stat': function () {
					StatusBar.hide();
				}
			});
		});
	}
});