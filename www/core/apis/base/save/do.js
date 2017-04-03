window.$save = $gre({
	vars: {},
	func: {},
	sets: function (data) {
		return this.is(function (self) {
			localStorage.setItem(self.$, data);
		});
	},
	gets: function () {
		return this.is(function (self) {
			$use(self.$).same('*').fail(function () {
				self.$ = localStorage.getItem(self.$);

				self._ = $use(self.$).type('unit')._;
			}).done(function () {
				self.$ = localStorage;
			});
		});
	},
	drop: function () {
		return this.is(function (self) {
			$use(self.$).same('*').fail(function () {
				localStorage.removeItem(self.$);
			}).done(function () {
				localStorage.clear();
			});
		});
	}
});