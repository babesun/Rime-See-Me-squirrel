function exConvert(name,color){
	a=color.toString();
	a= a[4]+a[5]+a[2]+a[3]+a[0]+a[1];
	color=a.toUpperCase();
	document.getElementById(name+'_color').innerHTML='0x'+color;}
function writeIn(name, value){
	document.getElementById(name).innerHTML=value;}
function changeNumber(value)
	{
	var a= parseInt(value);b=a+1;
	for(var i=a;i>=1;i--)
		document.getElementById('n'+i).style.display='inherit';for(var j=b;j<=9;j++)document.getElementById('n'+j).style.display='none';}
function changeColor(element,mode,name,color){
	var BG = "bg", BD = "bd";
	switch(mode){
	case BG:
	document.getElementById(element).style.backgroundColor = '#'+color;break;
	case BD:
	document.getElementById(element).style.borderColor = '#'+color;break;
	default: document.getElementById(element).style.color = '#'+color;}
	color=exConvert(name,color);}
function setInputColor(input){
	var hex = (input.value||'').replace('#','').toUpperCase();
	if(!/^[0-9A-F]{6}$/.test(hex)) return;
	var r = parseInt(hex.slice(0,2),16);
	var g = parseInt(hex.slice(2,4),16);
	var b = parseInt(hex.slice(4,6),16);
	var lum = (0.299*r + 0.587*g + 0.114*b) / 255;
	input.style.backgroundColor = '#'+hex;
	input.style.color = lum > 0.5 ? '#000000' : '#FFFFFF';
}
function exMode(origin,direction,color){
	a=color.toString();
	if(a.length!=6){alert("Error!");}
	else{
	b= a[4]+a[5]+a[2]+a[3]+a[0]+a[1];
	a=a.toUpperCase();
	b=b.toUpperCase();
	if(origin=="rgb"){
	document.getElementById(origin).style.backgroundColor = '#'+a;
	document.getElementById(direction).style.backgroundColor = '#'+a;
	document.getElementById(origin).value=a;
	document.getElementById(direction).value=b;}
	else if(origin=="bgr"){
	document.getElementById(origin).style.backgroundColor = '#'+b;
	document.getElementById(origin).value=a;
	document.getElementById(direction).style.backgroundColor = '#'+b;
	document.getElementById(direction).value=b;}
	}}
function writeInQ(name, value){
	document.getElementById(name).innerHTML="'"+value+"'";}
function renderCandidates(format){
	var labels = ['1','2','3','4','5','6','7','8','9'];
	var words = ['配色','陪','配','赔','培','佩','裴','斐','呸'];
	var codes = ['(pei se)','(pei)','(pei)','(pei)','(pei)','(pei)','(pei)','(pei)','(pei)'];
	for(var i=1;i<=9;i++){
		var tpl = format;
		tpl = tpl.replace(/\[label\]/g, '<span class="cand-label" id="label'+i+'">'+labels[i-1]+'</span>');
		tpl = tpl.replace(/\[candidate\]/g, '<span class="cand-word" id="word'+i+'">'+words[i-1]+'</span>');
		tpl = tpl.replace(/\[comment\]/g, '<span class="cand-code" id="code'+i+'">'+codes[i-1]+'</span>');
		document.getElementById('n'+i).innerHTML = tpl;}}
function applyLayoutAndOrientation(){
	// 根据当前 radio 值统一应用 #box / #display 的布局+方向样式
	var layoutEl = document.querySelector('input[name="candidate_list_layout"]:checked');
	var orientEl = document.querySelector('input[name="text_orientation"]:checked');
	if(!layoutEl || !orientEl) return;
	var isLinear = layoutEl.value === 'linear';
	var isVertical = orientEl.value === 'vertical';
	var box = document.getElementById('box');
	var display = document.getElementById('display');

	// 1. 重置所有相关 inline 样式
	box.style.writingMode = '';
	box.style.width = '';
	box.style.maxWidth = '';
	box.style.height = '';
	display.style.display = '';
	display.style.flexDirection = '';
	display.style.flexWrap = '';
	document.body.classList.remove('linear');

	// 2. 根据组合状态应用
	if(isVertical){
		box.style.writingMode = 'vertical-rl';
		box.style.width = 'auto';
		box.style.maxWidth = 'none';
		box.style.height = '200px';
	} else if(isLinear){
		document.body.classList.add('linear');
		box.style.width = 'fit-content';
		box.style.maxWidth = '100%';
		display.style.display = 'flex';
		display.style.flexDirection = 'row';
		display.style.flexWrap = 'nowrap';
	}
	// horizontal + stacked: 使用 CSS 默认（width: 160px, 无 height 限制）

	// 3. 重新应用 line_spacing（linear 时不生效）
	var lsEl = document.querySelector('input[name="line_spacing"]');
	if(lsEl){
		var dis = document.querySelectorAll('#display div');
		if(isLinear){
			for(var i=0;i<dis.length;i++) dis[i].style.margin = '';
		} else {
			for(var i=0;i<dis.length;i++) dis[i].style.margin = lsEl.value + 'px 0 ' + lsEl.value + 'px 0';
		}
	}
}
var _inChangeStyle = false;
function changeStyle(name, value){
	if(_inChangeStyle) return;
	_inChangeStyle = true;
	try {
	switch(name){
	case 'corner_radius':
		document.getElementById('box').style.borderRadius = value + 'px';
		break;
	case 'hilited_corner_radius':
		var v = value + 'px';
		document.getElementById('n1').style.borderRadius = v;
		document.getElementById('hilited').style.borderRadius = v;
		break;
	case 'font_point':
		document.getElementById('box').style.fontSize = value + 'px';
		document.getElementById('little_box').style.fontSize = value + 'px';
		break;
	case 'font_face':
		document.getElementById('box').style.fontFamily = value;
		document.getElementById('little_box').style.fontFamily = value;
		break;
	case 'label_font_point':
		for(var i=1;i<=9;i++) document.getElementById('label'+i).style.fontSize = value + 'px';
		break;
	case 'label_font_face':
		for(var i=1;i<=9;i++) document.getElementById('label'+i).style.fontFamily = value;
		break;
	case 'comment_font_point':
		document.getElementById('tip').style.fontSize = value + 'px';
		for(var i=1;i<=9;i++) document.getElementById('code'+i).style.fontSize = value + 'px';
		break;
	case 'comment_font_face':
		document.getElementById('tip').style.fontFamily = value;
		for(var i=1;i<=9;i++) document.getElementById('code'+i).style.fontFamily = value;
		break;
	case 'border_height':
	case 'border_width':
	case 'border_color':
		var widthEl = document.querySelector('input[name="border_width"]');
		var heightEl = document.querySelector('input[name="border_height"]');
		var colorEl = document.getElementById('border_input');
		var w = widthEl ? parseInt(widthEl.value) : 0;
		var h = heightEl ? parseInt(heightEl.value) : 0;
		var color = (colorEl && colorEl.value) ? colorEl.value.replace('#', '') : '000000';
		// Squirrel 行为：只有 width 和 height 都为 -2 才不显示边框
		// 其他情况渲染 max(1, value + 1) px（Squirrel 默认加 1px）
		function effective(v) {
			var n = parseInt(v);
			if (isNaN(n) || n === -2) return 0;
			return Math.max(1, n + 1);
		}
		var size = Math.max(effective(w), effective(h));
		var border = size > 0 ? size + 'px solid #' + color : 'none';
		document.getElementById('box').style.border = border;
		document.getElementById('little_box').style.border = border;
		if (colorEl) setInputColor(colorEl);
		break;
	case 'line_spacing':
		// line_spacing 是文字行间距（候选列表行间），仅在 stacked 模式生效
		var layout = document.querySelector('input[name="candidate_list_layout"]:checked');
		var isLinear = layout && layout.value === 'linear';
		var dis = document.querySelectorAll('#display div');
		if(isLinear){
			// 横向布局：line_spacing 不生效，恢复 CSS 默认
			for(var i=0;i<dis.length;i++) dis[i].style.margin = '';
		} else {
			for(var i=0;i<dis.length;i++) dis[i].style.margin = value + 'px 0 ' + value + 'px 0';
		}
		break;
	case 'inline_preedit':
		updateInlinePreedit(value);
		// 重新应用 spacing（结构变化后 gap 位置变了）
		var sEl = document.querySelector('input[name="spacing"]');
		if(sEl) changeStyle('spacing', sEl.value);
		break;
	case 'inline_candidate':
		// 切换 #hilited 文字：true → 候选词汉字，false → 拼音
		var hilited = document.getElementById('hilited');
		if(hilited){
			hilited.textContent = value ? (hilited.dataset.candidate || '') : (hilited.dataset.pinyin || '');
		}
		break;
	case 'spacing':
		var display = document.getElementById('display');
		var box = document.getElementById('box');
		var inside = document.querySelector('input[name="inline_preedit"]').checked;
		if(inside){
			// #select 在 #box 内：间距加在 #display 顶部
			display.style.marginTop = value + 'px';
			box.style.marginTop = '';
		} else {
			// #select 在 #box 外：间距加在 #box 顶部
			display.style.marginTop = '';
			box.style.marginTop = value + 'px';
		}
		break;
	case 'shadow_size':
		if(parseInt(value) > 0) document.getElementById('n1').style.boxShadow = '0 0 ' + value + 'px black';
		else document.getElementById('n1').style.boxShadow = 'none';
		break;
	case 'surrounding_extra_expansion':
		var w = 125 + parseInt(value);
		for(var i=2;i<=9;i++) document.getElementById('n'+i).style.width = w + 'px';
		break;
	case 'translucency':
	case 'mutual_exclusive':
	case 'alpha':
		var aEl = document.querySelector('input[name="alpha"]');
		var tEl = document.querySelector('input[name="translucency"]');
		var mEl = document.querySelector('input[name="mutual_exclusive"]');
		var a = aEl ? parseFloat(aEl.value) : 1;
		var t = tEl ? tEl.checked : false;
		var m = mEl ? mEl.checked : false;
		document.getElementById('box').style.opacity = t ? a : 1;
		document.getElementById('little_box').style.opacity = t ? a : 1;
		break;
	case 'base_offset':
		document.getElementById('display').style.transform = 'translateY(' + value + 'px)';
		break;
	case 'text_orientation':
	case 'candidate_list_layout':
		applyLayoutAndOrientation();
		break;
	case 'candidate_format':
		renderCandidates(value);
		break;
	}
	} finally { _inChangeStyle = false; }
}
function hexToHsl(hex){
	var r=parseInt(hex.slice(0,2),16)/255;
	var g=parseInt(hex.slice(2,4),16)/255;
	var b=parseInt(hex.slice(4,6),16)/255;
	var max=Math.max(r,g,b), min=Math.min(r,g,b);
	var h, s, l=(max+min)/2;
	if(max===min){h=s=0;}
	else{
		var d=max-min;
		s=l>0.5?d/(2-max-min):d/(max+min);
		switch(max){
			case r: h=(g-b)/d+(g<b?6:0); break;
			case g: h=(b-r)/d+2; break;
			case b: h=(r-g)/d+4; break;
		}
		h/=6;
	}
	return [h*360, s*100, l*100];
}
function hslToHex(h,s,l){
	h/=360; s/=100; l/=100;
	var r,g,b;
	if(s===0){r=g=b=l;}
	else{
		var q=l<0.5?l*(1+s):l+s-l*s;
		var p=2*l-q;
		var hue=function(p,q,t){
			if(t<0) t+=1; if(t>1) t-=1;
			if(t<1/6) return p+(q-p)*6*t;
			if(t<1/2) return q;
			if(t<2/3) return p+(q-p)*(2/3-t)*6;
			return p;
		};
		r=hue(p,q,h+1/3);
		g=hue(p,q,h);
		b=hue(p,q,h-1/3);
	}
	var toHex=function(x){
		var n=Math.round(x*255).toString(16);
		return n.length===1?'0'+n:n;
	};
	return (toHex(r)+toHex(g)+toHex(b)).toUpperCase();
}
function updateInlinePreedit(inside){
	// true: #select 移到 #box 外（行内预编辑）
	// false: #select 放回 #box 内
	var select = document.getElementById('select');
	var box = document.getElementById('box');
	var display = document.getElementById('display');
	if(!select || !box || !display) return;
	if(inside){
		if(select.parentNode === box){
			box.parentNode.insertBefore(select, box);
		}
	} else {
		if(select.parentNode !== box){
			box.insertBefore(select, display);
		}
	}
}
function onPrimaryChange(value){
	// 只有 auto 模式下才根据主色自动判断深浅；手动模式保留用户选择
	var hex=value.replace('#','').toUpperCase();
	var autoEl=document.getElementById('theme_auto');
	if(autoEl && autoEl.checked && /^[0-9A-F]{6}$/.test(hex)){
		var hsl=hexToHsl(hex);
		var mode = hsl[2]>50 ? 'light' : 'dark';
		var radios = document.querySelectorAll('input[name="theme_mode"]');
		for(var i=0;i<radios.length;i++){
			radios[i].checked = (radios[i].value === mode);
		}
	}
	generateScheme(value);
	applyEnvBackground();
}
function onThemeModeChange(){
	// 用户手动切换深浅：按当前主色重新生成配色
	var primary=document.getElementById('primary_input');
	if(primary && primary.value) generateScheme(primary.value);
	applyEnvBackground();
}
function adjustEnvBackgroundForContrast(boxColor){
	// 当小视窗背景色与环境背景色接近时，自动调亮或调暗环境色（纯黑白灰）以增加对比
	if(!boxColor || !/^[0-9A-F]{6}$/i.test(boxColor)) return;
	// 当前环境背景色（从输入框实际值读取）
	var isLight = document.getElementById('effect').classList.contains('theme-light');
	var bgInput = document.getElementById('background');
	var bgValue = bgInput && bgInput.value && /^[0-9A-F]{6}$/i.test(bgInput.value) ? bgInput.value : (isLight ? 'F2F2F2' : '2f3238');

	function relLum(hex){
		hex = hex.replace('#','');
		var r=parseInt(hex.slice(0,2),16)/255;
		var g=parseInt(hex.slice(2,4),16)/255;
		var b=parseInt(hex.slice(4,6),16)/255;
		var rs=r<=0.03928?r/12.92:Math.pow((r+0.055)/1.055,2.4);
		var gs=g<=0.03928?g/12.92:Math.pow((g+0.055)/1.055,2.4);
		var bs=b<=0.03928?b/12.92:Math.pow((b+0.055)/1.055,2.4);
		return 0.2126*rs+0.7152*gs+0.0722*bs;
	}

	var boxLum = relLum(boxColor);
	var envLum = relLum(bgValue);
	var diff = Math.abs(boxLum - envLum);

	if(diff < 0.08){
		var targetLum;
		if(boxLum < 0.5){
			targetLum = Math.min(boxLum + 0.2, 0.98);
		} else {
			targetLum = Math.max(boxLum - 0.2, 0.02);
		}
		// 转为纯黑白灰（R=G=B）
		var gray = Math.round(targetLum * 255);
		var part = ('0' + gray.toString(16)).slice(-2).toUpperCase();
		var newEnvHex = part + part + part;
		var effect = document.getElementById('effect');
		if(effect) effect.style.backgroundColor = '#' + newEnvHex;
		// 同步更新"环境参考背景"输入框
		var bgInput = document.getElementById('background');
		if(bgInput){
			bgInput.value = newEnvHex;
			bgInput.style.backgroundColor = '#' + newEnvHex;
			// 文字色与背景形成对比
			bgInput.style.color = gray > 127 ? '#000000' : '#FFFFFF';
			// 同步 jscolor picker 显示
			if(bgInput.color && typeof bgInput.color.fromString === 'function'){
				bgInput.color.fromString(newEnvHex);
			}
		}
	} else {
		var effect = document.getElementById('effect');
		if(effect) effect.style.backgroundColor = '';
		// 恢复输入框为默认色
		var bgInput = document.getElementById('background');
		if(bgInput){
			bgInput.value = 'F9F9F9';
			bgInput.style.backgroundColor = '';
			bgInput.style.color = '';
			if(bgInput.color && typeof bgInput.color.fromString === 'function'){
				bgInput.color.fromString('F9F9F9');
			}
		}
	}
}
function applyEnvBackground(){
	// 根据当前深浅模式切换页面环境背景
	var modeEl=document.querySelector('input[name="theme_mode"]:checked');
	var mode=modeEl ? modeEl.value : 'auto';
	var isLight;
	if(mode==='light') isLight=true;
	else if(mode==='dark') isLight=false;
	else {
		// auto: 从主色推断
		var pEl=document.getElementById('primary_input');
		if(pEl && pEl.value && /^[0-9A-F]{6}$/i.test(pEl.value)){
			var hsl=hexToHsl(pEl.value);
			isLight = hsl[2]>50;
		} else {
			isLight = true;
		}
	}
	var target = document.getElementById('effect') || document.body;
	target.classList.toggle('theme-light', isLight);
	target.classList.toggle('theme-dark', !isLight);
}
function getContrastColor(hex){
	// WCAG 2.0 相对亮度：返回黑或白以保证 ≥4.5:1 对比度
	var r=parseInt(hex.slice(0,2),16)/255;
	var g=parseInt(hex.slice(2,4),16)/255;
	var b=parseInt(hex.slice(4,6),16)/255;
	var rs=r<=0.03928?r/12.92:Math.pow((r+0.055)/1.055,2.4);
	var gs=g<=0.03928?g/12.92:Math.pow((g+0.055)/1.055,2.4);
	var bs=b<=0.03928?b/12.92:Math.pow((b+0.055)/1.055,2.4);
	var lum=0.2126*rs+0.7152*gs+0.0722*bs;
	return lum>0.179?'000000':'FFFFFF';
}
function generateScheme(primaryHex){
	primaryHex=primaryHex.replace('#','').toUpperCase();
	if(!/^[0-9A-F]{6}$/.test(primaryHex)){alert('请输入 6 位十六进制色值（例如 BD8F13）'); return;}
	var hsl=hexToHsl(primaryHex);
	var h=hsl[0], s=hsl[1], l=hsl[2];
	// 主题明暗：手动优先，否则按主色 L 自动判断
	var modeEl=document.querySelector('input[name="theme_mode"]:checked');
	var mode=modeEl ? modeEl.value : 'auto';

	// 1. 主色相对亮度（WCAG 2.0），决定背景自适应方向
	function relativeLuminance(hex){
		hex=hex.replace('#','');
		var r=parseInt(hex.slice(0,2),16)/255;
		var g=parseInt(hex.slice(2,4),16)/255;
		var b=parseInt(hex.slice(4,6),16)/255;
		var rs=r<=0.03928?r/12.92:Math.pow((r+0.055)/1.055,2.4);
		var gs=g<=0.03928?g/12.92:Math.pow((g+0.055)/1.055,2.4);
		var bs=b<=0.03928?b/12.92:Math.pow((b+0.055)/1.055,2.4);
		return 0.2126*rs+0.7152*gs+0.0722*bs;
	}
	function contrastRatio(hex1, hex2){
		var L1=relativeLuminance(hex1);
		var L2=relativeLuminance(hex2);
		var a=Math.max(L1,L2), b=Math.min(L1,L2);
		return (a+0.05)/(b+0.05);
	}
	var primaryRL=relativeLuminance(primaryHex);
	var isBright=primaryRL>0.4;   // 较亮主色
	var isDark=primaryRL<0.2;     // 较暗主色

	// 2. 背景：始终比主色更亮（让高亮作为视觉焦点，背景衬托不抢戏）
	//    基调先由手动模式决定（手动优先），自动模式按主色亮度判断
	var useLight;
	if(mode==='light') useLight=true;
	else if(mode==='dark') useLight=false;
	else {
		// auto：亮主色用浅色基调，暗主色用深色基调
		if(isBright) useLight=true;
		else if(isDark) useLight=false;
		else useLight = l>50;
	}
	var backL, backS;
	if(useLight){
		if(isBright){
			// 亮主色 → 背景更浅、更低饱和度（接近中性）
			backL=Math.min(99, Math.max(l+18, 95));
			backS=Math.min(s*0.08, 4);
		} else {
			backL=97;
			backS=Math.min(s*0.1, 5);
		}
	} else {
		if(isDark){
			// 暗主色 → 背景比主色略亮（不更暗），同色系微调
			backL=Math.min(35, l+15);
			backS=Math.min(s*0.55, 20);
		} else {
			backL=12;
			backS=Math.min(s*0.5, 15);
		}
	}
	var back=hslToHex(h, backS, backL);

	// 3. 边框：单一色相，介于背景和主色之间
	var borderL=backL>50
		? Math.max(backL-12, 75)   // 浅色背景：边框略深于背景
		: Math.min(backL+12, 28);  // 深色背景：边框略浅于背景
	var borderS=Math.min(s*0.25, 15);
	var border=hslToHex(h, borderS, borderL);

	// 4. 正文：保留主色色相倾向，浅色背景配深灰、深色背景配浅灰（不直接用纯黑/白）
	var textL=backL>50 ? 20 : 88;
	var textS=Math.min(s*0.18, 12);
	var text=hslToHex(h, textS, textL);
	// 兜底：若与背景对比度不足 4.5:1，降级为纯黑/纯白
	if(contrastRatio(back, text) < 4.5) text=getContrastColor(back);

	// 5. Comment：比正文弱一级（更接近背景明度）
	var commentL=backL>50 ? 50 : 62;
	var commentS=Math.min(s*0.22, 16);
	var comment=hslToHex(h, commentS, commentL);

	// 6. Label：再弱一级（最弱，最接近背景）
	var labelL=backL>50 ? 66 : 48;
	var labelS=Math.min(s*0.22, 16);
	var label=hslToHex(h, labelS, labelL);

	// Accent：主色，仅用于高亮（不用于背景/正文）
	var accent=primaryHex;
	// 高亮文字：WCAG 优先，与主色背景形成 ≥4.5:1 对比
	var candidateContrast=getContrastColor(primaryHex);
	// 同步更新预览与输入框
	function setColor(inputId,name,hex,mode,element){
		var input=document.getElementById(inputId);
		if(!input) return;
		input.value=hex;
		if(input.color && typeof input.color.fromString==='function'){
			input.color.fromString(hex);
		}
		changeColor(element, mode, name, hex);
		setInputColor(input);
	}
	setColor('back_input','back',back,'bg','box');
	changeColor('little_box','bg','back',back);
	// 小视窗背景色与环境背景对比度不足时自动调整环境色
	adjustEnvBackgroundForContrast(back);
	// 边框：单一色相下的 Border 角色
	setColor('border_input','border',border,'bd','box');
	changeColor('little_box','bd','border',border);
	setColor('text_input','text',text,'c','text');
	// 组字区高亮（编码 pinyin）= Accent；组字区高亮背景 = 主背景
	setColor('hilited_text_input','hilited_text',accent,'c','hilited');
	setColor('hilited_back_input','hilited_back',back,'bg','hilited');
	// 选定候选项：背景 = Accent，内部建立独立信息层级
	// 正文（最高权重）= 纯对比色；Comment = 对比色与主色 20% 混合；
	// Label = 对比色与主色 40% 混合；通过明度建立层级，引入主题色倾向
	function mixHex(c1, c2, ratio){
		var r1=parseInt(c1.slice(0,2),16), g1=parseInt(c1.slice(2,4),16), b1=parseInt(c1.slice(4,6),16);
		var r2=parseInt(c2.slice(0,2),16), g2=parseInt(c2.slice(2,4),16), b2=parseInt(c2.slice(4,6),16);
		var r=Math.round(r1*(1-ratio)+r2*ratio);
		var g=Math.round(g1*(1-ratio)+g2*ratio);
		var b=Math.round(b1*(1-ratio)+b2*ratio);
		return ('00'+((r<<16)|(g<<8)|b).toString(16)).slice(-6).toUpperCase();
	}
	var hilitedText = candidateContrast;
	var hilitedComment = mixHex(candidateContrast, primaryHex, 0.20);
	var hilitedLabel = mixHex(candidateContrast, primaryHex, 0.40);
	// 兜底：与主色对比度过低时降级到对比色（保留可读性）
	if(contrastRatio(primaryHex, hilitedComment) < 3.0) hilitedComment = candidateContrast;
	if(contrastRatio(primaryHex, hilitedLabel) < 2.5) hilitedLabel = candidateContrast;

	setColor('hilited_candidate_text_input','hilited_candidate_text',hilitedText,'c','n1');
	setColor('hilited_candidate_back_input','hilited_candidate_back',primaryHex,'bg','n1');
	setColor('hilited_candidate_label_input','hilited_candidate_label',hilitedLabel,'c','label1');
	setColor('hilited_comment_text_input','hilited_comment_text',hilitedComment,'c','code1');
	// 其他候选项文字 = 正文色
	var ct=document.getElementById('candidate_text_input');
	if(ct){ct.value=text; if(ct.color && ct.color.fromString) ct.color.fromString(text); setInputColor(ct);}
	changeColor('cursor','c','candidate_text',text);
	for(var i=2;i<=9;i++) document.getElementById('n'+i).style.color='#'+text;
	exConvert('candidate_text',text);
	// 其他候选项序号 = label 色（最弱）
	var lb=document.getElementById('label_input');
	if(lb){lb.value=label; if(lb.color && lb.color.fromString) lb.color.fromString(label); setInputColor(lb);}
	for(var i=2;i<=9;i++) document.getElementById('label'+i).style.color='#'+label;
	exConvert('label',label);
	// 其他候选项提示 = comment 色（弱一级）
	var cm=document.getElementById('comment_text_input');
	if(cm){cm.value=comment; if(cm.color && cm.color.fromString) cm.color.fromString(comment); setInputColor(cm);}
	changeColor('tip','c','comment_text',comment);
	for(var i=2;i<=9;i++) document.getElementById('code'+i).style.color='#'+comment;
	exConvert('comment_text',comment);
}
var COLOR_INPUT_IDS = [
	'primary_input','back_input','border_input','text_input','hilited_text_input',
	'hilited_back_input','hilited_candidate_text_input','hilited_candidate_back_input',
	'hilited_candidate_label_input','hilited_comment_text_input',
	'candidate_text_input','label_input','comment_text_input'
];
document.addEventListener('change', function(e){
	var t = e.target;
	if(t && t.tagName === 'INPUT' && (t.id === 'primary_input' || t.classList.contains('color'))){
		setInputColor(t);
	}
});
window.addEventListener('load', function(){
	var el = document.querySelector('input[name="candidate_format"]');
	if(el) renderCandidates(el.value);
	// 应用默认的布局/文字方向到预览
	var layoutEl = document.querySelector('input[name="candidate_list_layout"]:checked');
	if(layoutEl && typeof changeStyle === 'function') changeStyle('candidate_list_layout', layoutEl.value);
	var orientEl = document.querySelector('input[name="text_orientation"]:checked');
	if(orientEl && typeof changeStyle === 'function') changeStyle('text_orientation', orientEl.value);
	// 应用默认的 inline_preedit 状态到 DOM
	var inlineEl = document.querySelector('input[name="inline_preedit"]');
	if(inlineEl && typeof updateInlinePreedit === 'function') updateInlinePreedit(inlineEl.checked);
	// 应用默认的 inline_candidate 到 #hilited
	var candEl = document.querySelector('input[name="inline_candidate"]');
	if(candEl) changeStyle('inline_candidate', candEl.checked);
	// 应用默认的 spacing 到预览
	var sEl = document.querySelector('input[name="spacing"]');
	if(sEl && typeof changeStyle === 'function') changeStyle('spacing', sEl.value);
	if(typeof applyEnvBackground === 'function') applyEnvBackground();
	for(var i=0; i<COLOR_INPUT_IDS.length; i++){
		var el2 = document.getElementById(COLOR_INPUT_IDS[i]);
		if(el2) setInputColor(el2);
	}
});