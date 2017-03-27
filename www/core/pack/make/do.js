$face.make = $gre({
	vars: {
		host: 'https://mbasic.facebook.com'
	},
	$act: function () {
		return this.is(function (self) {
			var vars = self.vars,
				host = vars.host,
				fail = vars.fail,
				done = vars.done,
				user = self.$,
				data = {},
				ride = {},
				path = {
					__sk: '',
					code: '',
					skip: '/',
					regs: '/reg/?cid=103&refid=8',
					post: '/reg/?cid=103'
				},
				veri = $def(function (done) {
					$use(ride.sess).move('checkpoint').fail(function () {
						$use(ride.sess).move('c_user').fail(function () {
							fail(ride.sess);
						}).done(function () {
							done();
						});
					}).done(function () {
						fail(ride.sess);
					});
				});

			$reqs().seqs({
				1: function (next) {
					return {
						path: host + '/',
						head: {
							type: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
							lang: 'en-US,en;q=0.8',
							enco: 'gzip, deflate',
							cach: 'max-age=0',
							doer: user.doer
						},
						sess: {},
						data: {},
						from: from,
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
						done: function (resp) {
							$regx('"(\\/reg\\/.*?)"').pure(true).data(resp.data).done(function (data) {
								$use(data).move(1).done(function (data) {
									$use(data).move(1).done(function (data) {
										path.regs = $html(data).deco().$;
									});
								});
							});

							$regx('(.*?)&').pure(true).data(path.regs).done(function (data) {
								$use(data).move(0).done(function (data) {
									$use(data).move(1).done(function (data) {
										path.post = $html(data).deco().$;
									});
								});
							});

							next(2);
						}
					}
				},
				2: function (next) {
					return {
						path: host + path.regs,
						ride: ride,
						done: function (resp) {
							$regx('sk=(.*?)&').pure(true).data(resp.meta.path).done(function (data) {
								$use(data).move(0).done(function (data) {
									$use(data).move(1).done(function (data) {
										path.__sk = data;
									});
								});
							});

							next(3);
						}
					}
				},
				3: function (next) {
					return {
						path: host + path.post,
						type: 'post',
						data: {
							'lsd': data._lsd,
							'ccp': data._ccp,
							'reg_instance': data.regs,
							'submission_request': 'true',
							'i': '',
							'helper': '',
							'firstname': user.name_1,
							'lastname': user.name_2,
							'reg_email__': user.mail_1,
							'sex': user.gend,
							'birthday_day': user.date_d,
							'birthday_month': user.date_m,
							'birthday_year': user.date_y,
							'reg_passwd__': user.pass,
							'submit': 'Sign Up'
						},
						ride: ride,
						done: function () {
							veri(function () {
								next(4);
							});
						}
					}
				},
				4: function (next) {
					return {
						path: host + '/setemail',
						type: 'post',
						data: {
							'fb_dtsg': data.csrf,
							'next': '',
							'old_email': user.mail_1,
							'reg_instance': data.regs,
							'new': user.mail_2,
							'submit': 'Add'
						},
						ride: ride,
						done: function () {
							veri(function () {
								$time(15000).done(function () {
									next(5);
								});
							});
						}
					}
				},
				5: function (next) {
					return {
						path: 'http://graphlo.com/',
						type: 'post',
						kind: 'json',
						data: {
							'_': 'face/iden/mail',
							'iden': user.mail_2
						},
						done: function (resp) {
							$use(resp.data).move('done').done(function (data) {
								$use(data).move('code').done(function (data) {
									path.code = data;
								});
							});

							$use(path.code).same('').fail(function () {
								$sign('CODE ::', path.code);

								next(6);
							}).done(function () {
								fail(ride.sess);

								$sign('FAIL :: CODE ::', $face.vars(ride.sess).sess().$);
							});
						}
					}
				},
				6: function (next) {
					return {
						path: host + '/confirmemail.php?msite_source_surface=hard_cliff&confirmation_event_location=cliff&e=' + encodeURIComponent(user.mail_2),
						type: 'post',
						data: {
							'fb_dtsg': data.csrf,
							'c': path.code,
							'submit[confirm]': 'Confirm'
						},
						ride: ride,
						done: function () {
							veri(function () {
								next(7);
							});
						}
					}
				},
				7: function (next) {
					return {
						path: host + path.skip,
						ride: ride,
						done: function (resp) {
							veri(function () {
								$regx('"(\\/a\\/nux\\/.*?)"').pure(true).data(resp.data).fail(function () {
									done($face.vars(ride.sess).sess(true).$);

									$sign('DONE :: SESS ::', $face.vars(ride.sess).sess().$);
								}).done(function (data) {
									$use(data).move(0).done(function (data) {
										$use(data).move(1).done(function (data) {
											path.skip = $html(data).deco().$;

											next(7);
										});
									});
								});
							});
						}
					}
				}
			});
		});
	}
});