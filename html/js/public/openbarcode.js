var img = null;
var blist = [];
function scaned(t, r, f){
	var d = new Date();
	var h=d.getHours(),m=d.getMinutes(),s=d.getSeconds(),ms=d.getMilliseconds();
	if(h < 10){ h='0'+h; }
	if(m < 10){ m='0'+m; }
	if(s < 10){ s='0'+s; }
	if(ms < 10){ ms='00'+ms; }
	else if(ms < 100){ ms='0'+ms; }
	var ts = '['+h+':'+m+':'+s+'.'+ms+']';
	var li=null,hl = document.getElementById('history');
	if(blist.length > 0){
		li = document.createElement('li');
		li.className = 'ditem';
		hl.insertBefore(li, hl.childNodes[0]);
	} else{
		li = document.getElementById('nohistory');
	}
	li.id = blist.length;
	var html = '['+h+':'+m+':'+s+'.'+ms+']'+'　　'+t+'码<div class="hdata">';
	html += r;
	html += '</div>';
	li.innerHTML = html;
	li.setAttribute('ontouchstart', 'selected(id)');
	blist[blist.length] = {type:t,result:r,file:f};
	update(t, r, f);
}
function selected(id){
	var h = blist[id];
	update( h.type, h.result, h.file );
	if(h.result.indexOf('http://')==0  || h.result.indexOf('https://')==0){
		plus.nativeUI.confirm(h.result, function(i){
			if(i.index == 0){
				plus.runtime.openURL(h.result);
			}
		}, '', ['打开', '取消']);
	} else{
		plus.nativeUI.alert(h.result);
	}
}
function update(t, r, f){
	outSet('扫描成功：');
	outLine(t);
	outLine(r);
	outLine('\n图片地址：'+f);
	if(!f || f=='null'){
		img.src = '../img/barcode.png';	
	} else{
		plus.io.resolveLocalFileSystemURL(f, function(entry){
			img.src=entry.toLocalURL();
		});
		//img.src = 'http://localhost:13131/'+f;
	}
}
function onempty(){
	if(window.plus){
		plus.nativeUI.alert('无扫描记录');
	} else {
		alert('无扫描记录');
	}
}
function cleanHistroy(){
	if(blist.length > 0){
		var hl = document.getElementById('history');
		hl.innerHTML = '<li id="nohistory" class="ditem" ontouchstart="onempty();">无历史记录	</li>';
	}
	plus.io.resolveLocalFileSystemURL('_doc/barcode/', function(entry){
		entry.removeRecursively(function(){
			// Success
		}, function(e){
			//alert( "failed"+e.message );
		});
	});
}