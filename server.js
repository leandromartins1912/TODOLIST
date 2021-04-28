var express = require('express');
var app = express();
var mysql = require('mysql2');
var bodyParser = require("body-parser");

//STATIC FILES
app.use(express.static('public'));

app.use(bodyParser.json()); // Body parser use JSON data

/*MY SQL Connection Info*/
var pool = mysql.createPool({
	connectionLimit : 25,
	host     : 'localhost',
	user     : '****',
	password : '****',
	database : 'saipos_challenge',
	port :'3306'
});

pool.getConnection(function (err, connection) {
	if (!err) {
		console.log("Database is connected ... ");
		//log.info('Database is connected ... ');
		connection.release();
	} else {
		console.log("Error connecting database ... ");
		//log.error('Error connecting database ... ');
	}
	console.log("releasing connection ... ");
});

// ROOT - Loads Angular App
app.get('/', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/api/list', function (req, res) {
	var data = {
        "error": 1,
        "tarefas": ""
    };
	
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from tarefas', function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["tarefas"] = rows;
				res.json(data);
			} else if (rows.length === 0) {
				//Error code 2 = sem rows no db.
				data["error"] = 2;
				data["tarefas"] = 'Tarefas não encontradas';
				res.json(data);
			} else {
				data["tarefas"] = 'Erro ao buscar dados';
				res.json(data);				
			}
		});
	
	});
});

//UPDATE Product
app.put('/api/update', function (req, res) {
    var id = req.body.idtarefas;
    var nome = req.body.nome;
    var descricao = req.body.descricao;
    var email = req.body.email;
    var data = {
        "error": 1,
        "tarefas": ""
    };
	
    if (!!id && !!nome && !!descricao && !!email) {
		pool.getConnection(function (err, connection) {
			connection.query("UPDATE tarefas SET nome = ?, descricao = ?, email = ? WHERE idtarefas=?",[nome,  descricao, email, id], function (err, rows, fields) {
				if (!!err) {
					data["tarefas"] = "Erro ao atualizar dado!";					
				} else {
					data["error"] = 0;
					data["tarefas"] = "Atualizado com sucesso!";
				}
				res.json(data);
			});
		});
    } else {
        data["tarefas"] = "Não foi possível atualizar a tarefa";
        res.json(data);
    }
});

app.put('/api/updateStatus', function (req, res) {
    var id = req.body.idtarefas;
    var status = req.body.status;
	var senha = req.body.senha;
	var n_concluido = req.body.n_concluido;

	var data = {
        "error": 1,
        "tarefas": ""
    };

	if(n_concluido == 2 && status == 1){
		data["tarefas"] = "Quantidade de Tentativas Excedidas.";
		return res.status(401).json(data);
	}

  if((status == 0 && senha == '') || (status == 1 && senha == 'TrabalheNaSaipos')){	
	let statusNovo = status == '0' ? 1 : 0;

	if(status == 1){
		n_concluido+=1
	}

	pool.getConnection(function (err, connection) {
		connection.query("UPDATE tarefas SET status = ?, n_concluido=? WHERE idtarefas=?",[statusNovo,n_concluido, id], function (err, rows, fields) {
			if (!!err) {
				data["tarefas"] = "Erro ao atualizar dado!";				
			} else {
				data["error"] = 0;
				data["tarefas"] = "Atualizado com sucesso!";				
			}
			res.json(data);
		});
	});
	} else {
		data["tarefas"] = "Acesso não autorizado.";
		return res.status(401).json(data);
	}
});

app.get('/api/list/:id', function (req, res) {
	var id = req.params.id;
	var data = {
        "error": 1,
        "tarefas": ""
    };
	
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from tarefas WHERE idtarefas = ?', id, function (err, rows, fields) {
			connection.release();
			
			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["tarefas"] = rows;
				res.json(data);
			} else {
				data["tarefas"] = 'Não foram encontradas tarefas';
				res.json(data);				
			}
		});
	
	});
});

app.post('/api/insert', function (req, res) {
	
    var nome = req.body.nome;
    var descricao = req.body.descricao;
    var email = req.body.email;
    var data = {
        "error": 1,
        "tarefas": ""
    };

    if (!!nome && !!descricao && !!email) {
		pool.getConnection(function (err, connection) {
			connection.query("INSERT INTO tarefas SET nome = ?, descricao = ?, email = ?, status = 0",[nome,  descricao, email], function (err, rows, fields) {
				if (!!err) {
					data["tarefas"] = "Não foi possível adicionar a tarefa.";
				} else {
					data["error"] = 0;
					data["tarefas"] = "Tarefa adicionada com sucesso.";
				}
				res.json(data);
			});
        });
    } else {
        data["tarefas"] = "Informe todos os dados obrigatórios (i.e : nome, desc, email)";
        res.json(data);
    }
});

app.post('/api/delete', function (req, res) {
    var id = req.body.id;
    var data = {
        "error": 1,
        "tarefas": ""
    };

    if (!!id) {
		pool.getConnection(function (err, connection) {
			connection.query("DELETE FROM tarefas WHERE idtarefas=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["tarefas"] = "Erro ao deletar dado.";
				} else {
					data["tarefas"] = 0;
					data["tarefas"] = "Tarefa deletada com sucesso";
				}
				res.json(data);
			});
		});
    } else {
        data["tarefas"] = "Forneça todos os dados necessários (i.e : id ) deve ser um inteiro";
        res.json(data);
    }
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("dummy app listening at: " + host + ":" + port);

})