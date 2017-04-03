window.$nets = $gre({
	vars: {},
	func: {},
	stat: function (data) {
		return this.is(function (self) {
			var back = true;

			$when(self.$).same({
				'conn': function () {
					$use(navigator.connection.type).same(Connection.NONE).done(function () {
						back = false;
					});
				}
			});

			self._ = back === data;
		});
	}
});