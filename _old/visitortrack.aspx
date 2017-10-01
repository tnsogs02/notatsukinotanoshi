
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="visitortrack.aspx.cs" Inherits="visitortrack" %>

	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

	<html xmlns="http://www.w3.org/1999/xhtml">

	<head runat="server">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
		<title></title>
		<script type="text/javascript" language="javascript">
			var sender = parent.document.getElementById("sender");
			var country = parent.document.getElementById("country");
			var submitbutton = parent.document.getElementById("submit");
			var recvcomp = parent.document.getElementById("sp");
            var langselect = parent.document.getElementById("lang");
			var submitcounter = document.getElementById("submitcount");
			const langs = {
			    'zh': {
				    counter_text: '已寄出幾封信: '
			    },
				'ja': {
					counter_text: '送られたメールの数: '
				},
				'en': {
					counter_text: 'How many mails sent: '
				}
            }
            var locale = ((lang) => {
			// get full list from https://stackoverflow.com/a/36042028
			switch (lang) {
				case 'zh-TW':
				case 'zh-CN':
				case 'zh-HK':
				case 'zh-SG':
					return 'zh';
				case 'ja':
					return 'ja';
				case 'ko':
					return 'kr';
				default:
					return 'en';
                }
            })(navigator.language)
			
			langselect.onchange = function() {
				locale = langselect.value;
				PageMethods.getSubmitCount(onSuccess, onError);
			}

			submitbutton.addEventListener("click", function() {
				if (sender.value.length != 0 && country.value.length != 0) {
					PageMethods.addRecordToDatabase(recvcomp.options[recvcomp.value].text, null, onError);
				}
			});

			window.onload = function() {
				PageMethods.getSubmitCount(onSuccess, onError);
			}

			function onSuccess(result, context, method) {
				submitcount.innerHTML = langs[locale]['counter_text'] + result;
			}

			function onError(result, context, method) {
				alert('Something went wrong!');
			}
		</script>
	</head>

	<body>
		<form id="form1" runat="server">
			<h3 style="text-align:center" id="submitcount"></h3>
			<div>
				<div>
					<asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true" />
					<br />
				</div>
			</div>
		</form>
	</body>

	</html>
