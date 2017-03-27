$face.sign = $gre({
	vars: {
		host: 'https://m.facebook.com'
	},
	$act: function () {
		return this.is(function (self) {
			var vars = self.vars,
				host = vars.host,
				fail = vars.fail,
				done = vars.done,
				user = self.$,
				data = {},
				ride = {};

			$reqs().seqs({
				1: function (next) {
					return {
						path: host + '/',
						head: {
							type: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
							lang: 'en-US,en;q=0.8',
							enco: 'gzip, deflate',
							cach: 'max-age=0',
							doer: user.doer,
							sess: 'gand=chut'
						},
						sess: {},
						data: {},
						reds: true,
						save: true,
						ride: ride,
						ante: function (resp) {
							/* ---------------------------------------------------------------------------------- */

							ride = resp.ride;

							/* ---------------------------------------------------------------------------------- */

							data = $face.vars(resp.data).pull().$;

							/* ---------------------------------------------------------------------------------- */
						},
						done: function () {
							next(2);
						}
					}
				},
				2: function () {
					return {
						path: host + '/login/async/?refsrc=https%3A%2F%2Fm.facebook.com%2F&lwv=100&login_try_number=1',
						type: 'post',
						head: {
							'authority': 'm.facebook.com',
							'x-requested-with': 'XMLHttpRequest'
						},
						data: {
							'version': data.vers,
							'ajax': data.ajax,
							'width': data.wide,
							'pxr': data._pxr,
							'gps': data._gps,
							'dimensions': data.dime,
							'm_ts': data.__ts,
							'li': data.__li,
							'email': user.mail,
							'pass': user.pass,
							'm_sess': '',
							'fb_dtsg': data.csrf,
							'lsd': data._lsd,
							'__dyn': $face.vars().dyns().$,
							'__req': $face.vars().reqs().$,
							'__ajax__': $face.vars().ajax().$,
							'__user': data.iden
						},
						ride: ride,
						done: function () {
							/* ---------------------------------------------------------------------------------- */

							var cont = true;

							/* ---------------------------------------------------------------------------------- */

							$use(ride.sess).move('c_user').fail(function () {
								cont = false;
							});

							/* ---------------------------------------------------------------------------------- */

							$use(ride.sess).move('checkpoint').done(function () {
								cont = false;
							});

							/* ---------------------------------------------------------------------------------- */

							$use(cont).same(true).fail(function () {
								fail($face.vars(ride.sess).sess(true).$);
							}).done(function () {
								done($face.vars(ride.sess).sess(true).$);
							});

							/* ---------------------------------------------------------------------------------- */
						}
					}
				}
			});
		});
	}
});