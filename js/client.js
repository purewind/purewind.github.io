window.OZ = window.OZ || {};
(function(){
	var DEFAULT_OZ_PROXY_PATH = "http://{domain}/oz-platform/api/proxy.html";
	var DEFAULT_OZ_DOMAIN = "demohost:8080";
	var ozDomain = DEFAULT_OZ_DOMAIN;

	//4.3rd_proxy	==>	url:	oz_proxy?method=callback&args={}&cb_index=x;
	function callOzMethod(method,oArgs){
		var args = OTK.core.json.jsonToStr(oArgs);
		args = escape(args);
		createIFM(method,args);
	}
	
	function createIFM(sMethod, sArgs, sCallBackIndex) {
	    var url = OTK.core.util.URL(DEFAULT_OZ_PROXY_PATH.replace(/\{domain\}/ig,ozDomain));
	    url.setParam("method", sMethod);
	    if (sArgs != null) {
	        url.setParam("args", sArgs)
	    }
	    if (sCallBackIndex != null) {
	        url.setParam("callback_index", sCallBackIndex)
	    }

	    var ifm = OTK.C("iframe");
	    ifm.style.width = "500px";
	    ifm.style.height = "300px";
	    ifm.style.display = "none";
	    ifm.src = url;
	    document.body.appendChild(ifm);
	    return ifm
	}
	
	//解析传过来的参数
	//source	==>	3rd_proxy?method=save&args={}&cb_index=x;
	//调用method,并传入参数过去
	//target	==>	call:	3rd_web.save();
	function parseData(sData) {
		var oJson = OTK.core.json.queryToJson(sData);
		var sMethod = oJson.method;
		var sArgs = oJson.args;
		var sMethodIndex = oJson.callback_index;
		var oData = oJson.data;
		var bStatus = oJson.status;
		ozDomain = oJson.domain||DEFAULT_OZ_DOMAIN;

		var oArgs = OTK.core.json.strToJson(unescape(sArgs));
		 
		if(window[sMethod]){
			window[sMethod](oArgs);
		}else{
			alert("未定义指定方法:"+sMethod)
		}
	}
	
	//只是代理操作,把传递的参数送到目标执行
	function initClientProxy() {
	    var location_split = window.location.toString().split("?");
	    if (location_split.length < 2) {
	        return
	    }
	    try {
	        parent.clientWeb.OZ.client.parseData(location_split[1]);
	    } catch(e) {alert(e)}
	}
	
	var that = {};
	that.callOzMethod = callOzMethod;
	that.parseData = parseData;
	that.initClientProxy = initClientProxy;
	OZ.client = that;
})();
