window.$path = $gre({
	func: {
		enco: function (data) {
			var back = [];

			$use(data).each(function (name, data) {
				var seg1 = encodeURIComponent(name),
					seg2 = encodeURIComponent(data);

				$use(back).prop(seg1 + '=' + seg2);
			});

			return $sets(back).join('&').$;
		},
		deco: function (data) {
			var back = {};

			$use($char(data).tear('&').$).each(function (curr, name) {
				$char(name).tear('=').done(function (data) {
					var seg1 = $def(data[0], ''),
						seg2 = $def(data[1], '');

					seg1 = decodeURIComponent(seg1);
					seg2 = decodeURIComponent(seg2);

					$use(seg1).same('').fail(function () {
						$use(back).prop(seg1, seg2);
					});
				});
			});

			return back;
		}
	},
	enco: function () {
		return this.is(function (self) {
			self.$ = encodeURIComponent(self.$);
		});
	},
	deco: function () {
		return this.is(function (self) {
			self.$ = decodeURIComponent(self.$);
		});
	},
	form: function (data) {
		return this.is(function (self) {
			var func = self.func;

			$when(data).same({
				'enco': function () {
					self.$ = func.enco(self.$);
				},
				'deco': function () {
					self.$ = func.enco(self.$);
				}
			});
		});
	},
	core: function () {
		return this.is(function (self) {
			var func = self.func,
				path = self.$,
				back = {
					prot: '',
					host: '',
					port: '',
					path: '',
					hash: '',
					quer: '',
					args: {}
				};

			$regx('(.*?)\\#(.*)').uniq(true).data(path).done(function (data) {
				path = data[1];

				back.hash = data[2];
			});

			$regx('(.*?)\\?(.*)').uniq(true).data(path).done(function (data) {
				path = data[1];

				back.quer = data[2];

				back.args = func.deco(data[2]);
			});

			$char(path).have('/').done(function (data) {
				$use(data).more(2).fail(function () {
					path = path + '/';
				});
			});

			$regx('(.*?):\\/\\/(.*?)\\/(.*)').uniq(true).data(path).done(function (data) {
				back.prot = $when(data[1]).same({
					'http': function () {
						return 'http';
					},
					'https': function () {
						return 'htts';
					}
				}).$;

				$regx('(.*?):(.*)').uniq(true).data(data[2]).fail(function () {
					back.host = data[2];

					back.port = $when(back.prot).same({
						'http': function () {
							return '80';
						},
						'htts': function () {
							return '443';
						}
					}).$;
				}).done(function (data) {
					back.host = data[1];

					back.port = data[2];
				});

				back.path = '/' + data[3];
			});

			self.$ = back;
		});
	}
});