var c_width;
var c_height;
window.onload = function() {
	c_width = window.innerWidth * 0.95;
	c_height = window.innerHeight - 200;
	;
	document.getElementById("canvas").style.width = c_width + "px";
	document.getElementById("canvas").style.height = c_height + "px";
	document.getElementById("canvas").width = c_width;
	document.getElementById("canvas").height = c_height;
	document.getElementById("dane").style.width = c_width - 20 + "px";
	document.getElementById("copy1").style.width = c_width + 2 + "px";
	document.getElementById("copy2").style.width = c_width + 2 + "px";
	document.getElementById("copy3").style.width = c_width + 2 + "px";
	document.getElementsByClassName("dane")[0].style.width = c_width - 20 + "px";
	rysuj_drzewo(drzewo(document.getElementById('n').value, drzewo(document.getElementById('n').value)), true);
}
function R(min, max) {
	return Math.min(parseInt(Math.random() * (max - min + 1)) + min, max);
}

function drzewo(n, d /*maksymalna liczba dzieci*/) {
	wierzcholek = [];
	wierzcholek[0] = {};
	wierzcholek[0].dziecko = [];
	wierzcholek[0].rodzic = 0;
	wierzcholek[0].lewa = 0;
	for ( i = 1; i < n; i++) {
		wierzcholek[i] = {};
		wierzcholek[i].dziecko = [];
		do {
			r = R(0, i - 1);
		} while(wierzcholek[r].dziecko.length>=d);
		wierzcholek[i].rodzic = r;
		wierzcholek[r].dziecko[wierzcholek[r].dziecko.length] = i;
	}
	return wierzcholek;
}

function graf(n, m) {
	wierzcholek = [];
	for ( i = 0; i < n; i++) {
		wierzcholek[i] = {};
		wierzcholek[i].sasiad = [];
		wierzcholek[i].odwiedzony = 0;
	}
	for ( i = 0; i < m; i++) {
		do {
			r1 = R(0, n - 1);
			r2 = R(0, n - 1);
		} while(wierzcholek[r1].sasiad.indexOf(r2)!=-1 || r1==r2);
		wierzcholek[r1].sasiad[wierzcholek[r1].sasiad.length] = r2;
		wierzcholek[r2].sasiad[wierzcholek[r2].sasiad.length] = r1;
	}
	return wierzcholek;
}

function szerokosc_dfs(wierzcholek, start) {
	wierzcholek[start].szerokosc = 0;
	wierzcholek[start].i = 0;
	for (; wierzcholek[start].i < wierzcholek[start].dziecko.length; wierzcholek[start].i++)
		wierzcholek[start].szerokosc += szerokosc_dfs(wierzcholek, wierzcholek[start].dziecko[wierzcholek[start].i]);
	if (wierzcholek[start].szerokosc == 0)
		wierzcholek[start].szerokosc++;
	return wierzcholek[start].szerokosc;
}

function drzewo_polozenie_dfs(wierzcholek, start, szerokosc, glebokosc, poziom) {
	wierzcholek[start].lewa = wierzcholek[wierzcholek[start].rodzic].lewa;
	wierzcholek[start].i = 0;
	wierzcholek[start].y = poziom;
	wierzcholek[start].x = wierzcholek[start].lewa + wierzcholek[start].szerokosc / 2;
	for (; wierzcholek[start].i < wierzcholek[start].dziecko.length; wierzcholek[start].i++) {
		drzewo_polozenie_dfs(wierzcholek, wierzcholek[start].dziecko[wierzcholek[start].i], szerokosc, glebokosc, poziom + 1);
		wierzcholek[start].lewa += wierzcholek[wierzcholek[start].dziecko[wierzcholek[start].i]].szerokosc;
	}
}

function glebokosc_dfs(wierzcholek, start) {
	wierzcholek[start].glebokosc = 0;
	wierzcholek[start].i = 0;
	for (; wierzcholek[start].i < wierzcholek[start].dziecko.length; wierzcholek[start].i++)
		wierzcholek[start].glebokosc = Math.max(wierzcholek[start].glebokosc, glebokosc_dfs(wierzcholek, wierzcholek[start].dziecko[wierzcholek[start].i]));
	return wierzcholek[start].glebokosc + 1;
}

function spojny_dfs(wierzcholek, start) {
	wierzcholek[start].odwiedzony = 1;
	wierzcholek[start].i = 0;
	for (; wierzcholek[start].i < wierzcholek[start].sasiad.length; wierzcholek[start].i++)
		if (wierzcholek[wierzcholek[start].sasiad[wierzcholek[start].i]].odwiedzony == 0)
			spojny_dfs(wierzcholek, wierzcholek[start].sasiad[wierzcholek[start].i]);
}

function graf_spojny(wierzcholek) {
	spojny_dfs(wierzcholek, 0);
	for ( i = 0; i < wierzcholek.length; i++)
		if (wierzcholek[i].odwiedzony == 0)
			return false;
	return true;
}

function rysuj_drzewo(wierzcholek, wypisz) {
	if (wypisz) {
		document.getElementById("dane").value = document.getElementById('n').value;
		for ( i = 1; i < wierzcholek.length; i++)
			document.getElementById("dane").value += "\n" + wierzcholek[i].rodzic;
	}
	szerokosc = szerokosc_dfs(wierzcholek, 0);
	glebokosc = glebokosc_dfs(wierzcholek, 0);
	drzewo_polozenie_dfs(wierzcholek, 0, szerokosc, glebokosc, 1);
	ctx = document.getElementById("canvas").getContext("2d");
	ctx.clearRect(0, 0, c_width, c_height);
	ctx.font = (wierzcholek.length < 50 ? 22 : "bold 12") + "px Consolas";
	for ( i = 1; i < wierzcholek.length; i++) {
		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = "1";
		ctx.moveTo(wierzcholek[i].x * c_width / szerokosc, wierzcholek[i].y * c_height / (glebokosc + 1));
		ctx.lineTo(wierzcholek[wierzcholek[i].rodzic].x * c_width / szerokosc, wierzcholek[wierzcholek[i].rodzic].y * c_height / (glebokosc + 1));
		ctx.stroke();
	}
	for ( i = 0; i < wierzcholek.length; i++) {
		ctx.beginPath();
		ctx.arc(wierzcholek[i].x * c_width / szerokosc, wierzcholek[i].y * c_height / (glebokosc + 1), (wierzcholek.length < 50 ? 20 : 10), 0, 2 * Math.PI, false);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#000';
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.textAlign = "center";
		ctx.fillText(i, wierzcholek[i].x * c_width / szerokosc, wierzcholek[i].y * c_height / (glebokosc + 1) + (wierzcholek.length < 50 ? 6 : 3));
	}
}

function rysuj_graf(wierzcholek, wypisz) {
	if (wypisz) {
		document.getElementById("dane").value = document.getElementById('graf_n').value + " " + document.getElementById('graf_m').value;
		for ( i = 0; i < wierzcholek.length; i++)
			for ( j = 0; j < wierzcholek[i].sasiad.length; j++)
				if (wierzcholek[i].sasiad[j] > i)
					document.getElementById("dane").value += "\n" + wierzcholek[i].sasiad[j] + " " + i;
	}
	ctx = document.getElementById("canvas").getContext("2d");
	ctx.clearRect(0, 0, c_width, c_height);
	ctx.font = (wierzcholek.length < 20 ? 22 : "bold 12") + "px Consolas";
	n = document.getElementById('graf_n').value;
	for ( i = 0; i < wierzcholek.length; i++)
		for ( j = 0; j < wierzcholek[i].sasiad.length; j++)
			if (wierzcholek[i].sasiad[j] > i) {
				ctx.beginPath();
				ctx.strokeStyle = "black";
				ctx.lineWidth = "1";
				ctx.moveTo(c_width / 2.2 * Math.sin(Math.PI * 2 * i / n) + c_width / 2, c_height / -2.2 * Math.cos(Math.PI * 2 * i / n) + c_height / 2);
				ctx.lineTo(c_width / 2.2 * Math.sin(Math.PI * 2 * wierzcholek[i].sasiad[j] / n) + c_width / 2, c_height / -2.2 * Math.cos(Math.PI * 2 * wierzcholek[i].sasiad[j] / n) + c_height / 2);
				ctx.stroke();
			}
	for ( i = 0; i < wierzcholek.length; i++) {
		ctx.beginPath();
		ctx.arc(c_width / 2.2 * Math.sin(Math.PI * 2 * i / n) + c_width / 2, c_height / -2.2 * Math.cos(Math.PI * 2 * i / n) + c_height / 2, (wierzcholek.length < 20 ? 20 : 10), 0, 2 * Math.PI, false);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#000';
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.textAlign = "center";
		ctx.fillText(i, c_width / 2.2 * Math.sin(Math.PI * 2 * i / n) + c_width / 2, c_height / -2.2 * Math.cos(Math.PI * 2 * i / n) + c_height / 2 + (wierzcholek.length < 20 ? 6 : 3));
	}
}

function czytaj_graf(dane) {
	dane = dane.replace(/ /g, '_');
	dane = dane.replace(/\n/g, '_');
	dane = dane.replace(/____/g, '_');
	dane = dane.replace(/___/g, '_');
	dane = dane.replace(/__/g, '_');
	i = 0;
	n = parseInt(dane.substr(i));
	while (dane[i] != '_')
	i++;
	i++;
	m = parseInt(dane.substr(i));
	while (dane[i] != '_')
	i++;
	i++;
	document.getElementById('graf_n').value = n;
	document.getElementById('graf_m').value = m;
	wierzcholek = [];
	for ( j = 0; j < n; j++) {
		wierzcholek[j] = {};
		wierzcholek[j].sasiad = [];
		wierzcholek[j].odwiedzony = 0;
	}
	for ( j = 0; j < m; j++) {
		if (i >= dane.length) {
			alert('Za mało danych');
			return false;
		}
		r1 = parseInt(dane.substr(i));
		while (dane[i] != '_')
		i++;
		i++;
		r2 = parseInt(dane.substr(i));
		while (dane[i] != '_' && i < dane.length)
		i++;
		i++;
		if (r1 == r2) {
			alert('Zła krawędź - pętla');
			return false;
		}
		if (wierzcholek[r1].sasiad.indexOf(r2) != -1) {
			alert('Zła krawędź - zdublowana krawędź');
			return false;
		}
		wierzcholek[r1].sasiad[wierzcholek[r1].sasiad.length] = r2;
		wierzcholek[r2].sasiad[wierzcholek[r2].sasiad.length] = r1;
	}
	rysuj_graf(wierzcholek, false);
}

function czytaj_drzewo(dane) {
	dane = dane.replace(/ /g, '_');
	dane = dane.replace(/\n/g, '_');
	dane = dane.replace(/____/g, '_');
	dane = dane.replace(/___/g, '_');
	dane = dane.replace(/__/g, '_');
	i = 0;
	n = parseInt(dane.substr(i));
	while (dane[i] != '_')
	i++;
	i++;
	document.getElementById('n').value = n;
	wierzcholek = [];
	wierzcholek[0] = {};
	wierzcholek[0].dziecko = [];
	wierzcholek[0].rodzic = 0;
	wierzcholek[0].lewa = 0;
	for ( j = 1; j < n; j++) {
		wierzcholek[j] = {};
		wierzcholek[j].dziecko = [];
		if (i >= dane.length) {
			alert('Za mało danych');
			return false;
		}
		r = parseInt(dane.substr(i));
		while (dane[i] != '_' && i < dane.length)
		i++;
		i++;
		if (j == r) {
			alert('Błąd danych - rodzicem dla ' + j + " nie może być " + r);
			return false;
		}
		wierzcholek[j].rodzic = r;
		wierzcholek[r].dziecko[wierzcholek[r].dziecko.length] = j;
	}
	rysuj_drzewo(wierzcholek, false);
}