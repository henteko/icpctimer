var myButton_element;
var question_count = 0;
var KEIKA;
var count = 0;
var sum = 0;
var seikai_count = 0;
var seikai_miss_num = 0;
function myWatch() {
	myButton_element = document.getElementById("myButton");
	if(!myButton_element.disabled) {
		Start = new Date();
		myButton_element.disabled = true;

		//問題のセットアップ
		set_question();
		myInterval = setInterval("myWatch()", 1);
	} else {
		Stop = new Date();
		T = Stop.getTime() - Start.getTime();
		KEIKA = T;
		T = count - T;
		if(T <= 0) {
			//終了
			myButton_element.value = "Start";
			clearInterval(myInterval);
			var myClick_element = document.getElementById("myClick");
			myClick_element.innerHTML = "<h1>Time Limit: 0:0:0</h1>";
			compleat();
			alert("The End!!");
			return;
		}
		H = Math.floor(T / (60 * 60 * 1000));
		T = T - (H * 60 * 60 * 1000);
		M = Math.floor(T / (60 * 1000));
		T = T - (M * 60 * 1000);
		S = Math.floor(T / 1000);
		var myClick_element = document.getElementById("myClick");
		myClick_element.innerHTML = "<h1>Time Limit: " + H + ":" + M + ":" + S + "</h1>";
	}
}

function set() {
	var count_h_element = document.getElementById("count_h");
	//時間
	var count_m_element = document.getElementById("count_m");
	//分

	count = ((count_h_element.value * 60 * 60) + (count_m_element.value * 60)) * 1000;
	var question_count_element = document.getElementById("question_count");
	question_count = question_count_element.value;
	myWatch();
}

function compleat() {
	var compleat_element = document.getElementById("compleat");
	var compleatButton = document.createElement("input");
	compleatButton.setAttribute("type", "button");
	compleatButton.setAttribute("value", "Reset");
	compleatButton.setAttribute("onclick", "compleatButton();");
	compleatButton.setAttribute("id", "compleatButton");
	compleatButton.setAttribute("class", "btn btn-primary btn-large");
	//document.createTextNode("所属サークル"　 + cercle_id_num + ": ");

	//誤答分20分追加
	var miss_num = seikai_miss_num * Math.floor(1200000 / 1000);
	sum += miss_num;
	var score_element = document.getElementById("score");
	score_element.innerHTML = "<h3>Correct:" + seikai_count + " TIME:" + sum + "/s (Miss:" + miss_num + "/s)</h3>";

	//ボタンをすべて非選択に
	for(var i = 0; i < question_count; i++) {
		var submit_element = document.getElementById("question_submit" + i);
		var miss_element = document.getElementById("question_miss" + i);

		submit_element.disabled = true;
		miss_element.disabled = true;
	}

	compleat_element.appendChild(compleatButton);
}

function compleatButton() {

	myButton_element.disabled = false;
	var compleat_element = document.getElementById("compleat");
	var compleatButton = document.getElementById("compleatButton");
	compleat_element.removeChild(compleatButton);

	var question_host_element = document.getElementById("question_host");
	var question_element = document.getElementById("question");
	question_host_element.removeChild(question_element);

	//グローバル変数の初期化
	sum = 0;
	seikai_count = 0;
	seikai_miss_num = 0;

	var question_table_host_element = document.getElementById("question_table_host");
	while(question_table_host_element.firstChild) {
		question_table_host_element.removeChild(question_table_host_element.firstChild);
	}

	var score_element = document.getElementById("score");
	score_element.innerHTML = "<h3>Correct:0 TIME:0/s</h3>";
}

function set_question() {
	//問題のセットアップ
	var question_host_element = document.getElementById("question_host");
	question_host_element.innerHTML = "";

	var question_table_host_element = document.getElementById("question_table_host");

	var question_element = document.createElement("div");
	question_element.setAttribute("id", "question");
	question_host_element.appendChild(question_element);

	var mondai_array = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "L", "O", "P", "Q", "R", "S", "T", "U"];
	for(var i = 0; i < question_count; i++) {
		var element = document.createElement("div");
		element.setAttribute("id","question"+i);
		if(i != 0) element.style.display = 'none';

		//問題:A etc
		var h2_label = document.createElement("h2");
		h2_label.innerHTML = "Q:" + mondai_array[i];
		element.appendChild(h2_label);
		
		//ソースコード
		var h3_src_label = document.createElement("h3");
		h3_src_label.innerHTML = "Source Code";
		element.appendChild(h3_src_label);
		
		//ソースコードテキストエリア
		var src_text = document.createElement("textarea");
		src_text.setAttribute("id","src_text"+i);
		src_text.setAttribute("style","width:100%;height:50%;");
		// src_text.setAttribute("rows",10);
		element.appendChild(src_text);
		
		var button_right = document.createElement("p");
		button_right.setAttribute("class","pull-right");
		element.appendChild(button_right);

		//ボタン:提出
		var submit = document.createElement("input");
		//正解しているかどうか
		submit.submit_flag = false;
		submit.setAttribute("id", "question_submit" + i);
		submit.setAttribute("type", "button");
		submit.setAttribute("value", "Submit");
		submit.setAttribute("onclick", "submit(" + "question" + i + ",this," + "question_miss" + i + ","+ "src_text" + i +");");
		submit.setAttribute("class", "btn btn-success btn-large");
		button_right.appendChild(submit);

		//ボタン:誤答
		var miss = document.createElement("input");
		//何回ミスったか(3回まで可)
		miss.miss_num = 0;
		miss.setAttribute("id", "question_miss" + i);
		miss.setAttribute("type", "button");
		miss.setAttribute("value", "Miss");
		miss.setAttribute("onclick", "miss(" + "question" + i + ",this," + "question_submit" + i + ");");
		miss.setAttribute("class", "btn btn-danger btn-large");
		button_right.appendChild(miss);

		//経過時間記述div
		var keika = document.createElement("div");
		keika.setAttribute("id", "question_keika" + i);
		question_host_element.appendChild(keika);

		//誤答回数記述div
		var gotou = document.createElement("div");
		gotou.setAttribute("id", "question_gotou" + i);
		question_host_element.appendChild(gotou);

		question_element.appendChild(element);

		//問題のリンク表示

		var h2_table_a = document.createElement("a");
		h2_table_a.setAttribute("href", "#" + i);
		h2_table_a.setAttribute("id", "question_table"+i);
		h2_table_a.setAttribute("onclick", "question_change(" + i + ");");
		h2_table_a.innerHTML = "Q:" + mondai_array[i];

		question_table_host_element.appendChild(h2_table_a);

	}

}

function question_change(num) {
	for(var i = 0; i < question_count; i++) {
		var element = document.getElementById("question"+i);
		if (i != num) {
			//非表示
			element.style.display = 'none';
		}else {
			//表示
			element.style.display = 'block';
		}
	}
}

function submit(element, button, miss,src_text) {
	var question_element = document.getElementById(element.id);
	button.submit_flag = true;
	button.disabled = true;
	miss.disabled = true;
	sum = (sum + Math.floor(KEIKA / 1000));
	seikai_miss_num += miss.miss_num;
	//正解数
	seikai_count++;

	var score_element = document.getElementById("score");
	score_element.innerHTML = "<h3>Correct:" + seikai_count + " TIME:" + sum + "/s</h3>";

	var h2_label = document.createElement("h2");
	h2_label.innerHTML = "TIME:" + Math.floor(KEIKA / 1000) + "/s";
	question_element.appendChild(h2_label);
	
	var src_text = document.getElementById(src_text.id);
	//読み取り専用に
	src_text.setAttribute("readonly",true);
	
}

function miss(element, button, submit) {
	var question_element = document.getElementById(element.id);
	button.miss_num++;

	if(button.miss_num == 3) {
		button.disabled = true;
		submit.disabled = true;
	}
	if(button.miss_num > 1) {
		//最初の要素を削除
		question_element.removeChild(question_element.lastChild);
	}

	var h2_label = document.createElement("h2");
	h2_label.innerHTML = "Miss:" + button.miss_num;
	question_element.appendChild(h2_label);
}