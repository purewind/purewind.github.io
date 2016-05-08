window.OZ = window.OZ || {};
(function() {
	var CONN_CACHE = {};
	var CONN_INDEX = 0;
	var CONN_HTML5_IFM;

	var CFG = {
		clientpath : null,
		clientformUrl : null
	};

	// 执行函数
	function callClientMethod(sMethod, oArgs, oCallBack) {
		var callback_index = "conn_" + CONN_INDEX;
		var cache = CONN_CACHE[callback_index] = {};
		cache.callback = oCallBack;
		CONN_INDEX++;

		var args = $.toJSON(oArgs);
		args = escape(args);
		cache.ifm = createIFM(sMethod, args, callback_index);
	}

	function createIFM(sMethod, sArgs, sCallBackIndex) {
		var url = OTK.core.util.URL(CFG.clientpath);
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

	function parseData(sData) {
		var oJson = OTK.core.json.queryToJson(sData);
		//URL参数
		var sMethod = oJson.method;
		var sArgs = oJson.args;
		var sMethodIndex = oJson.callback_index;
		//postMessage数据
		var oData = oJson.data;
		var bStatus = oJson.status;
		var oArgs = unescape(sArgs)
		try {
			oArgs = OTK.core.json.strToJson(oArgs);
		} catch (e) {
		}
		if(sMethodIndex){
			var data_cache = CONN_CACHE[sMethodIndex];
			if (data_cache && data_cache.callback) {
				data_cache.callback(oArgs, (bStatus == "true" || bStatus == true))
			}
			if (data_cache && data_cache.ifm) {
				OTK.core.dom.removeNode(data_cache.ifm)
			}
		}else if(window[sMethod]){
			window[sMethod](oArgs);
		}
	}
	function init(cfg) {
		$.extend(CFG, cfg);
		if (CFG.clientpath == null) {
			throw "init -> clientpath is null"
		}
		if (CFG.clientformUrl == null) {
			throw "init -> clientformUrl is null"
		}
		// 初始化Form页面
		initForm();
		// parseData("origin=server&method=ready");
	}

	/**
	 * 初始化第三方Form
	 */
	function initForm() {
		var objectId = $("#docId").val();
		if (objectId > 0) {
			openForm(CFG.clientformUrl + "?action=view&id=" + objectId);
		} else {
			openForm(CFG.clientformUrl + "?action=add");
		}
	}
	/**
	 * 打开第三方Form
	 */
	function openForm(url) {
		$("#clientWeb")[0].src = url;
	}
	var that = {};
	that.callClientMethod = callClientMethod;
	that.parseData = parseData;
	that.init = init;
	that.initForm = initForm;

	OZ.server = that;
})();
