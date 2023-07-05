ler();
function ler() {
	const linhas = document.getElementById('linhas');

	const query = {
		query: `{
			findPessoa(input: {}) {
				codigo,
				nome,
				idade,
				email
			}
		}`
	};

	const http = new XMLHttpRequest();
	http.open('POST', 'http://localhost:3000/graphql', true);
	http.setRequestHeader('Content-Type', 'application/json');

	http.onreadystatechange = function() {
		if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			const objJSON = JSON.parse(http.responseText);
			const arrJSON = objJSON.data.findPessoa;

			let txt = '';
			for(let i=0; i<arrJSON.length; i++) {
				txt += `
					<tr>
						<td>${arrJSON[i].nome}</td>
						<td>${arrJSON[i].idade}</td>
						<td>${arrJSON[i].email}</td>
						<td>
							<button class="btn" onclick="selecionar(${arrJSON[i].codigo})">
								selecionar
							</button>
						</td>
					</tr>
				`;
			}
			linhas.innerHTML = txt;
		}
	}
	http.send(JSON.stringify(query));
}

function selecionar(_codigo=0) {
	const codigo = document.getElementById('codigo');
	const nome = document.getElementById('nome');
	const idade = document.getElementById('idade');
	const email = document.getElementById('email');

	const query = {
		query: `{
			findPessoaOne(codigo: ${_codigo}) {
				codigo,
				nome,
				idade,
				email
			}
		}`
	};

	const http = new XMLHttpRequest();
	http.open('POST', 'http://localhost:3000/graphql', true);
	http.setRequestHeader('Content-Type', 'application/json');

	http.onreadystatechange = function() {
		if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			const objJSON = JSON.parse(http.responseText);
			const pessoa = objJSON.data.findPessoaOne;

			codigo.value = pessoa.codigo;
			nome.value = pessoa.nome;
			idade.value = pessoa.idade;
			email.value = pessoa.email;
		}
	}
	http.send(JSON.stringify(query));	
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

	let query = '';
	if(codigo>0) {
		query = {
			query: `mutation {
				updatePessoa(codigo: ${codigo}, input: {
					nome: "${nome}",
					idade: ${idade},
					email: "${email}"
				})
			}`
		};
	}else {
		query = {
			query: `mutation {
				insertPessoa(input: {
					nome: "${nome}",
					idade: ${idade},
					email: "${email}"
				}) {
					codigo,
					nome,
					idade,
					email
				}
			}`
		};
	}

	const http = new XMLHttpRequest();
	http.open('POST', 'http://localhost:3000/graphql', true);
	http.setRequestHeader('Content-Type', 'application/json');

	http.onreadystatechange = function() {
		if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			ler();
			limpar();
		}
	}
	http.send(JSON.stringify(query));	
}

function deletar() {
	const codigo = Number(document.getElementById('codigo').value);

	if(codigo>0) {
		const query = {
			query: `mutation {
				deletePessoa(codigo: ${codigo})
			}`
		};

		const http = new XMLHttpRequest();
		http.open('POST', 'http://localhost:3000/graphql', true);
		http.setRequestHeader('Content-Type', 'application/json');

		http.onreadystatechange = function() {
			if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				ler();
				limpar();
			}
		}
		http.send(JSON.stringify(query));
	}	
}
