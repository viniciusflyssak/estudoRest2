ler();
function ler() {
	const linhas = document.getElementById('linhas');

	const http = new XMLHttpRequest();
	http.open('GET', 'http://localhost:3000/pessoas/find', true);

	http.onreadystatechange = function() {
		if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			const objJSON = JSON.parse(http.responseText);

			let txt = '';
			for(let i=0; i<objJSON.length; i++) {
				txt += `
					<tr>
						<td>${objJSON[i].nome}</td>
						<td>${objJSON[i].idade}</td>
						<td>${objJSON[i].email}</td>
						<td>
							<button class="btn" onclick="selecionar(${objJSON[i].codigo})">
								selecionar
							</button>
						</td>
					</tr>
				`;
			}
			linhas.innerHTML = txt;
		}
	}
	http.send();
}

function selecionar(_codigo=0) {
	const codigo = document.getElementById('codigo');
	const nome = document.getElementById('nome');
	const idade = document.getElementById('idade');
	const email = document.getElementById('email');

	const http = new XMLHttpRequest();
	http.open('GET', 'http://localhost:3000/pessoas/find/'+_codigo, true);

	http.onreadystatechange = function() {
		if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			const objJSON = JSON.parse(http.responseText);

			codigo.value = objJSON.codigo;
			nome.value = objJSON.nome;
			idade.value = objJSON.idade;
			email.value = objJSON.email;
		}
	}
	http.send();	
}

function limpar() {
	document.getElementById('codigo').value = 0;
	document.getElementById('nome').value = '';
	document.getElementById('idade').value = '';
	document.getElementById('email').value = '';
	document.getElementById('nome').focus();	
}

function salvar() {
	const codigo = Number(document.getElementById('codigo').value);
	const nome = document.getElementById('nome').value.toString().trim();
	const idade = Number(document.getElementById('idade').value);
	const email = document.getElementById('email').value.toString().trim();

	let url = '';
	let method = '';
	let params = {};
	let strJSON = '';
	if(codigo>0) {
		method = 'PUT';
		url = 'http://localhost:3000/pessoas/update/'+codigo;
		if(nome.length>0) params.nome = nome;
		if(idade>0) params.idade = idade;
		if(email.length>0) params.email = email;
	}else {
		method = 'POST';
		url = 'http://localhost:3000/pessoas/insert';
		params.nome = nome;
		params.idade = idade;
		params.email = email;
	}
	strJSON = JSON.stringify(params);

	const http = new XMLHttpRequest();
	http.open(method, url, true);
	http.setRequestHeader('Content-Type', 'application/json');

	http.onreadystatechange = function() {
		if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			ler();
			limpar();
		}
	}
	http.send(strJSON);	
}

function deletar() {
	const codigo = Number(document.getElementById('codigo').value);

	if(codigo>0) {
		const http = new XMLHttpRequest();
		http.open('DELETE', 'http://localhost:3000/pessoas/delete/'+codigo, true);

		http.onreadystatechange = function() {
			if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				ler();
				limpar();
			}
		}
		http.send();
	}	
}
