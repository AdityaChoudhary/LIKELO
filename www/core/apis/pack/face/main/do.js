window.$face = {};

$face.main = $gre({
	json: function () {
		return this.is(function (self) {
			self.$ = $json($use(self.$).turn('for \\(;;\\);', '').$).data().$
		});
	},
	pure: function () {
		return this.is(function (self) {
			self.$ = self.$.replace(/[^a-zA-Z0-9:\-_\/\?\.\=\&]/g, '').replace('//www', '//m');
		});
	},
	wide: function () {
		return this.is(function (self) {
			var area = $def(self.$, [1024, 1366, 1280, 1440, 1600, 1920, 2560, 3840]),
				wide = $rand(area).sets().$,
				high = $rand(((wide / 100) * 50)).digi(((wide / 100) * 75)).$;

			self.$ = wide + 'x' + high;
		});
	},
	path: function (data) {
		return this.is(function (self) {
			var back = '',
				host = data;

			$use({
				'1': 'document.location.href="(.*?)"',
				'2': 'href="(\\/reg\\/.*?)"',
				'3': 'href="(\\/a\\/nux\\/wizard\\/.*?)"'
			}).each(function (name, data) {
				$regx(data).data(self.$).done(function (data) {
					$use(data).move(0).move(1).done(function (data) {
						data = $path(data).deco().$;

						data = $html(data).deco().$;

						$when(name).same({
							'2|3': function () {
								data = host + data;
							}
						});

						back = $use(data).turn('\\\\', '').$;
					});
				});
			});

			$use(back).same('').fail(function () {
				self._ = true;
			}).done(function () {
				self._ = false;
			});

			self.$ = back;
		});
	},
	sess: function (data) {
		return this.is(function (self) {
			var back = '';

			$use($def(data, false)).same(true).fail(function () {
				$use(self.$).type('data').done(function () {
					$use(self.$).each(function (name, data) {
						back = back + 'document.cookie = "' + name + '=' + data + '; expires=Mon, 1 Jan 2020 00:00:00 UTC; path=/"; ';
					});
				});

				$use(self.$).type('char').done(function () {
					$use($char(self.$).tear('; ').$).each(function (curr, data) {
						var sess = $char(data).tear('=').$;

						$use(sess).move(1).done(function () {
							back = back + 'document.cookie = "' + sess[0] + '=' + sess[1] + '; expires=Mon, 1 Jan 2020 00:00:00 UTC; path=/"; ';
						});
					});
				});
			}).done(function () {
				$use(self.$).type('data').done(function () {
					$use(self.$).each(function (name, data) {
						back = back + name + '=' + data + '; ';
					});
				});

				back = $use(back).turn('; $', '').$;
			});

			self.$ = back;
		});
	},
	pull: function () {
		return this.is(function (self) {
			var back = {},
				keep = '';

			$use({
				revs: '"revision":(.*?),',
				iden: '"USER_ID":"(.*?)"',
				__pc: '"pkg_cohort":"(.*?)"',
				__li: 'name="li" value="(.*?)"',
				__ts: 'name="m_ts" value="(.*?)"',
				_lsd: 'name="lsd" value="(.*?)"',
				_ccp: 'name="ccp" value="(.*?)"',
				_mbt: 'name="mbt" value="(.*?)"',
				_pxr: 'name="pxr" value="(.*?)"',
				_gps: 'name="gps" value="(.*?)"',
				ajax: 'name="ajax" value="(.*?)"',
				wide: 'name="width" value="(.*?)"',
				vers: 'name="version" value="(.*?)"',
				csrf: 'name="fb_dtsg" value="(.*?)"',
				dime: 'name="dimensions" value="(.*?)"',
				regs: 'name="reg_instance" value="(.*?)"'
			}).each(function (name, data) {
				$regx(data).data(self.$).fail(function () {
					data = $use(data).turn('"', '\\"').$;

					$regx(data).data(self.$).fail(function () {
						data = $use(data).turn('"', '\\"').$;

						$regx(data).data(self.$).done(function (data) {
							$use(data).move(0).move(1).done(function (data) {
								back[name] = data;
							});
						});
					}).done(function (data) {
						$use(data).move(0).move(1).done(function (data) {
							back[name] = data;
						});
					});
				}).done(function (data) {
					$use(data).move(0).move(1).done(function (data) {
						back[name] = data;
					});
				});
			});

			$use(back).move('csrf').done(function () {
				keep = '2';

				$use($char(back.csrf).tear('').$).each(function (data) {
					keep = keep + back.csrf.charCodeAt(data);
				});

				back.pack = keep;
			});

			self.$ = back;
		});
	},
	reqs: function (data) {
		return this.is(function (self) {
			self.$ = $rand($def(data, '9abcdef')).char(1).$;
		});
	},
	dyns: function () {
		return this.is(function (self) {
			self.$ = $rand([
				'1KQEGho6W4UpwDF3FQ8xHxF348xGi5EmwHwAxu2q643i3u4oswYwGwywlEf84e261gxm0yVEC3y4o7Oq2259oS',
				'1KQEGho6W4UpwDF3FQ8xHxF348xGi5EmwHwAxu2q643i3u4oswYwGwuo20wxg4-5o2bCyoe8hxm3O2Cq2259oS',
				'1KQEGho6W4UpwDF3FQ8xHxF348xGi5EmwHwAxu2q643i3u4oswYwGwywlEf84e4EW1gxm0yVEC3y4o7Oq2259oS',
				'1KQEGho6W4UpwDF3FQ8xHxF348xGi5EmwHwAxu2q643i3u4oswYwGwywlEf84e250jUlw8Kq9wUx65of8apE88kBzo',
				'1KQEGho6W4UpwDF3FQ8xHxF348xGi5EmwHwAxu2q643i3u4oswYwGwywlEf84e4EV0jUlw8Kq9wUx65of8apE88kBzo'
			]).sets().$;
		});
	},
	ajax: function () {
		return this.is(function (self) {
			self.$ = $rand([
				'AYmDmAXkvxFDNZ73lAbuTAEQT53EpNYi_O_p7kxPQXiqN25S5x-uhFta0eWB9ViG3CoDwKNpT812AfVFOaod7GNXe9HUfhIGF0l-_iGh6jcaag',
				'AYlRb7tGci4f-0XZUTQTCipdDplfK_Iibe3pmEUAc72P7m1wgVFLkr0ch-p3svTD1aUWRI4Wq5eSUKr3Bqn2gys8Tn9kwyOV3QbIPEblX8JN7Q',
				'AYn2CgZmdAGnxhS9Bc-HG58uEcv72O41LNnfdsS2_tyDd_wbH33k4RKME2vm6pSzoa-DIh_Z4z8lzV3NNq949syp62sJx0XkP_Ym9CQAQUOFVg',
				'AYlGntDHFT_dIVTUGsUYG2xHreIym-CWLq9dYGqwrl0-iS5x41bj-n3t0ip2d4Dt_jILpyR8jdJYZRrnB4GqcoVhz6JP1u5EpwB0KCrcyHjScQ',
				'AYnRjB30GbKjtX7-qQVyV0nu9iQC59cHSKklBefgx3kZVuM_5QqTBFJZgvq6-2pvskBbxP6pAgZD1SG-QNJW_BAbWtN3jYCxZdFD67Ut8-jW4Q',
				'AYmPyRydjLoyzXZb1gIkVCow2TO1qnrufRkv1FJsam9sliokMBvp4pl0iftKqU9YXB-Ga_KjYWCMkzI8tDymEvMZDHshxbb2vX1voShAJ6CLog',
				'AYkjICR_EWN6YQYeONHcTzuPOPkfz55mlgEegwAKrFcSthNNnyzOGdafZGmlP9JomADihAl_tEdphptRwY4RN6lQWv002HsFK04k-FeLbR-K6g',
				'AYkJP0FIVKnh3B07lnUTLVtjoukzrnvrPu7piZOhfV15-5H6XYupEqz539K_q3JBk5XkujDt5EsNdz9P3XJTl1C3hTcwrQ6f3TLEU_p7FEJQGA',
				'AYn_EUwCogbVSE4NEKUl6paC86kHNEgNYYZNaL7XCUbv6YEw22_cpXDrDzdKSYavkkj4ghDNA3lM1Z5HotVxmCuAAdj2EZPhuTiOQpSaaQK2Ig',
				'AYkybTx-Y-ZyM6FkyL9MAKFG0NsQuFp4qhuM7y3rzWMosAVjLO3TfhHYu_NQ91Dvh3kiLlJm6-5G1ONJoBgrNNrjF2FAZLnDZW7QN2o6jubWJg',
				'AYn5ad86BKPiBgdU4PeOYaXlUxn7CYelcEOb-8U7pLTcIBa7PxyaF95joaTOu5byjV8znmC4QhA9Q6LdDQO9UNK546O_B6Kx_yb9ST-GcNM08Q',
				'AYlMZWzhcZKpsVma3RNqsKxiWS8ewiNyLElB8tFU228TaNJQL_jOeLzBxfBgm2kbbUW2WryxnNWZXHT4wt7Iuwj74pkQRrYuYld3xdC33PafRA',
				'AYlOTLPHmXQpo0YNDtCXTtBYL3OJzHjOjhOnu8PFhzYim3QgPYa2XGBiyJDjsB4x-YLPEExWJ9AZ20l09GdeX5Pn2V64Ri5Ao09umuKyOGREsg',
				'AYmE_Gx-hzJAZ-2EusSDOV8xR161S5384JxWBRHyST_JURG4ZFuldp0rpZTfFNdpjH4ly7fejHIuR7lbQ3jVu0YJIITNZZ9UlFZA2_6kt-rakA',
				'AYmiAa5imFnnYr5H4hC7-c9mXvUP9oTfj_jSu7NQ5n1__YyRuhI4OU2lzBchckvDDZikuf9WUV1HDEVMu4ymnMOKUIE5m7X1GKH28Or0x4T0QA',
				'AYnamiU3t3ndCfvDXdaE6dPWxJldYng1rCqmeyK9nmzGvTh0gX8DnmOEPP6V4ITGWkdSJZwiuL2zrY1-qBBA_jRgtzlZ3AWSZUeRmp09Bqm4XA',
				'AYmn6KQar72BQZhh2jsGS555WCF4fP9AuGCmbh85mxqjmy-VCk7vyffuxxqMo7BFH5zdveg6iRDPrtYxNSD9rnb1rAYQzXGvhNbQJRXT_TzMvA',
				'AYnPFi92f7jm5BARJH46U7Kw2SElU01Rj1UJCCLC5f6Hwev11LCPHGvUFGcn0kWJ-IWjLCGfpTH5IXYMGmhQFBgo_psDheGSlwsIZqRr4fqjKw',
				'AYnxXWSmdpbVoiTGMpC0hcCwR_K1gVPYqXBseAwQaBCh-SuR2-i-u3wTcbolXzNM_teh0iNJ6jp79Coxky_tn6M5xcgTOTBRRT_AQXjRIvPcNQ',
				'AYnBcyszGAi96Qi5jqElQmVY-jdPcvF15RimAmB78MZHhu2xDmpJK96FSLAlB-KtrH-3uwPfE1577FaOf_LpGke9K_Ft9Dkke5LBjXDU8DdC2w',
				'AYk5xP4PD8nk_6I4AfmMvCRctp4QBgif78vI0jJGsUelNaFDp5OoSAFAIw8A8Hmo1PckZxp7QxYBWrnwFS8hPTPuAxMawCdrWWKOsrMbaspCKg',
				'AYkMzNDcxFCfSOwUlHWahcpMH4kQNlPUjpEBaK7lscBooCN3JzjW2KqOFWsRLEow1-0p29a0BHlCh7eHyDgdhXWDLgFGMCpP6RA669aJgZT55w',
				'AYnDCbpvphPCzwgA_RGAjeCMnCHgaOJJkDI0EYgrOyNdA3iPDla3CUkXaKQKwczgikUvH0YZi5VGpnQS7j-sL2JNRgja_BPcfcLFS001nXzAIw',
				'AYmYgp5xQeqEryRLK9kz3OnzEAPGogZB49sFEC34YwARHVRHOq5dvHCxPDeEBLboqR8TkagVSQNz3kn2pbpDq6dl9jwNAkFxpjmwLdkOlhBC0A',
				'AYlMuZbrUzweTD3frrawiQmFejj-nWLY7uELn94yA41E1HM-A1-OcT02vdN7DgspHZ6rUvqmN6bXEB8ejOk8zrRwP5APwnAuk7TU9iFxCcarNw',
				'AYnZxC3CcFEKr-1bFTzGf3ZaM8Oog7bsBeKeMSUFCOC5xJXjS-SXzGz1IfIz7IUcMF5TO3CAVMO-4nkoj1z8K4-Au4MInoSDly28iWVBFgBE9A',
				'AYnFie7XHQw7XsY2fIA4B3S0sNWiTigZ49N63r6clfyV-Ah0IiEqmFvUS5jFT8KmWuwCUuWjQf6ahAGRi9t8gxD9mDA5pWqvG4I2le0aksM_YA',
				'AYmwF6Q2A_fD_3e4rBcwTydsJdwM_7IH1jnHBcb570AVhBfEQW8PJ_4EzkDrjLHeNw_k--Pm10lPKQ7SsJZs6-8fSgXyB4Z87lJG-o1T2R6xPA',
				'AYmB8GjgBssCjrU1ESIlGK99EOYnhbRApz-N7-qogyCbjTjXzPeR1wfNf0-4UkMpRSjI-GWvtiJdqhCmmLhcKVZJZjIzdVyihFbx6YdgTsyypg',
				'AYl6q_G7sDPt9S5ZNk0fVKjrde_MpcyX8kJX2NUynaAmyain7C_1zvw5rNQnntqfK-ddzJHROl4HJdO6oOzvea9ck1NVxzMCCGngPAXtj1aaBA',
				'AYkE7ByX5hH1zOqEnvXkAkc2yf1wMeglpCYH2DhBjMZioktwtnq7CWYstNlTxCUNrsGLcPuj9rz4hSvh7wNTGY0X-onMNCLz3S7-LsE4PB1VWA',
				'AYljoNyWKKPCPJ5To42GFV_2AgXCy0BG6Mt_Yt6zMIYjwAIZtO7swRB4c9s7Yx2_j63Qg77lda93yBu5qOLXj2knvYshMaDxy-OeQIdmYjOOQw',
				'AYmmRnZDg0ntLoUjcSmIysSBkIImAeaqoU3UVAaXOt34GVILvXSgOXuBOmM-8sEz3yn1TuaOwXH5fnjVss9Do1fB5V80o89aWDMKzH8eD2mvmA',
				'AYk-A8zdYpb3rDcJ2R8-6eIX27GdMmvYhXZu-NJQNfo-bwUJx1SN_7a3rzLMtkuwkm4akPGg2LAiKFn437ffh6WfOZqeIPHvLlm8J8GQercZ8A',
				'AYkOcAhicKYVKG9YppnBzkgsohrwXzfVklSPK70_xGrEOKsqf7_5OjM2yxsHbA2Up0Dy6UYPUqVo_zD4JD5FxkBYZprN_DDE8zz0L-eclCImBA',
				'AYkMp3N5QXCD4jKjKaKzH5CAPz6jFhlVEomz5fUZ8bf5HGgkvcGj8GviaQjiHI-rPXVJ5NuztnNiX93moYQaA7_UhoNI2yRbNK_vexWIujFWgA',
				'AYmtYjborI_3mshuMcBdHvppMNjWlK4jRX3igQXi76EDOKgxTb3VM-NFMPKmGt99HAMrmISMtL7TGYyKdmBUOXUyg0Qd-FTszSMQBhFaTdS5wg',
				'AYkuodUCHFMH7hm8ko7VIfUt3GIGaBY57rzqKBVJ5ga4hX-qd8_1A-t2F_kOQToi0rp4rV6IwNwZzEADWas1B7IBNvkg4JJmkfHT8zrcf7fK9g',
				'AYl6WS-bZyAteHrelBR5UBAz0nMh8tdJIIjhP8WGGm_Od9xiSmqWLRICLOwyERFFzxCaJKxvuliRXBQyetiSaVTpLd8wTw_9CGGakSP5-j7GVg',
				'AYmbFkB9tqsMuhSPVY2EOgYjjuLavQ5sP7y7opWekh1quL3H79iy-qO0MFpZlOx2B6aZcddoo90nEH0-LrkK7rehNOayY3Naqcld6pBf5fa_Lw',
				'AYkvRMli3qNDeu1yU4cI45HwVaRmUgwj73VshBdnaFhfjHbrQ3PgOd-R36yf1eX0dn_dwdyzOTkvoXMq1_3n0wRHqzlMdopNp5EphcbULZSELg',
				'AYn8I9L_Sis7B8U3S3oAvrcba3S4YksJRk7lHdBGkKIFketDkM8bmGXGRcjV1-Vh1N5o7y2vdXMPVFo8RF-8WDw5V_ejqxn7h1czWMFeXgM7Kg',
				'AYkhFcfZOxGKfbTp449njb2zVS08IEmxuCaBsGhIf-w0hmi58F1ifG1q4zj5rp-td9j-oerO20m2feLMpUku1cztMEs6-L5dbPAt1O4JRD0YOg',
				'AYmMkAYJzcwvuuhnY7cVX8i-MJfIkGm3rTa9Wp_aCF05O73eWGJFHc72ElsGRBFDMSjneeO0cYx4q7vNKpSYK-xABkcmny_uzG8liZoMQdLb4Q',
				'AYnvxRsWpwkoIIIrGFh6KL1yhf0EOyHBN9Cx5UUDMXz540TUXXSPtwFsxsJL8c4SRevPdP8f7hNyDWBqCq19YDkVHpE7Df2Z9eLoyGkKXwuX-A',
				'AYmprxGQJwOzFZXbpPgL-rLo9vAiak1m-ZGvgr2hUkACk74weuxRtQng20Mp-R0e5pim_4YuhqfUgbGT54xMZffUnTHjBGBSWTzpuSeLM8h1JQ',
				'AYnKxOzMLPtRHtzW3sFpvLD78E8EbITILT53Tv4r91fraO-D6M4N2zJC0iZ-nQBH3qlX_sIO663Q5D1e7LF5V4sT-OvJhaBJDCbQSrW0_w2BnQ',
				'AYmwqQDW_V-3CTuz0GFROOo0xAy341gOe-rJqJwBFdlXjsb-TJpPDaH5o8KUcl6k1QKO98-p75CRgK_oPnvLKTZWsWJ86JorRM4uemmUCLlyUg',
				'AYlEqGMkwE85nT5aQyJTcyS3U8axbWACysW1rbFd7SA4UegWzpyyvqvEQx3ANcihWABZsjlvTi5Z8lPA6YO7eXisKP4scTvE2smHaYTS_l1Mew',
				'AYmwEbRZhK2Xji-3KaQLJSfTmWh3yV4G-ntjgim1w-Bf1jeIlE5hlnNHAJyiLfAzq9KDFjSmuoNXnodzorf2z9FgRKBilwZxEnSklMakiPiCJg'
			]).sets().$;
		});
	}
});