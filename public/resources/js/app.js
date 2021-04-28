
var app = angular.module('tarefas', []);

app.controller('tarefasCTRL', function ($scope, $http) {
    
    $scope.loader = {
        loading: false
    };
    
    $scope.showCreateForm = function () {
      
        $scope.clearForm();
        $('#modal-product-title').text('Criar nova tarefa');
        $('#btn-update-product').hide();
        $('#btn-create-product').show();

    };


    $scope.clearForm = function () {
        $scope.idtarefas = "";
        $scope.nome = "";
        $scope.descricao = "";
        $scope.email = "";
        $scope.senha = "";
        $scope.status = "";
        $scope.modalstatustext = "";
    };
    
    $scope.hideFormFields = function () {
        $('#form-dinminder').hide();
    };
    
   $scope.showFormFields = function () {
        $('#form-dinminder').show();
    };

    $scope.getAll = function () {
        
        $scope.loader.loading = true;
        
        $http.get("api/list")
            .success(function (response) {
                if (response.error === 2) {
				    $scope.statustext = "Atualmente não há tarefas disponíveis!";
					$scope.loader.loading = false;
				} else {
					$scope.todo = response.tarefas;
                    $scope.todoPendente = response.tarefas.filter(v=> v.status == 0);
                    $scope.todoConcluido = response.tarefas.filter(v=> v.status == 1);
					
					$scope.loader.loading = false;
					$scope.statustext = "";
				}
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.statustext = data.tarefas;
            });
    };

   
    $scope.readOne = function (id) {
        
        $scope.clearForm();
        $scope.hideFormFields();
        
       
        $('#modal-product-title').text("Editar Tarefa");
        $('#btn-update-product').show();
        $('#btn-create-product').hide();
        
        $scope.loader.loading = true;

        // get id 
        $http.get('api/list/' + id)
            .success(function (data, status, headers, config) {
                
                $scope.loader.loading = true;
                $scope.showFormFields();
        
                $scope.idtarefas = data.tarefas[0].idtarefas;
                $scope.nome = data.tarefas[0].nome;
                $scope.descricao = data.tarefas[0].descricao;
                $scope.email = data.tarefas[0].email;
                $scope.status = data.tarefas[0].status;
                $scope.n_concluido = data.tarefas[0].n_concluido;

                $('#myModal').modal('show');
                $scope.loader.loading = false;
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = data.tarefas;
            });
    };

    $scope.createTarefa = function () {
        
        $scope.loader.loading = true;
        
        $http.post('/api/insert', {
            'nome' : $scope.nome,
            'descricao' : $scope.descricao,
            'email' : $scope.email
        })
            .success(function (data, status, headers, config) {
                $('#myModal').modal('hide');
                $scope.clearForm();
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = data.tarefas;
            });
    };
	
    $scope.updateTarefa = function () {
        
        $scope.loader.loading = true;
        
        $http.put('/api/update', {
            'idtarefas' : $scope.idtarefas,
            'nome' : $scope.nome,
            'descricao' : $scope.descricao,
            'email' : $scope.email
        })
            .success(function (data, status, headers, config) {
                $('#myModal').modal('hide');
                $scope.clearForm();
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = data.tarefas;
            });
    };

    $scope.deleteTarefa = function (id) {
        $scope.loader.loading = true;
		
        $http.post('/api/delete', {
            'id' : id
        })
            .success(function (data, status, headers, config) {
			    $('#confirm' + id).modal('hide');
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = data.tarefas;
				$scope.getAll();
            });
    };

    $scope.moveTarefa = function () {
        $scope.loader.loading = true;

        $http.put('/api/updateStatus', {
            'idtarefas' : $scope.idtarefas,
            'status' : $scope.status,
            'senha': $scope.senha,
            'n_concluido': $scope.n_concluido
        })
            .success(function (data, status, headers, config) {
                $('#myModal').modal('hide');
                $scope.clearForm();
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {                
                $scope.loader.loading = false;
                $scope.modalstatustext = data.tarefas;
                $scope.getAll();
            });
    };

    $scope.emailValid = function () {              
        $http.get('https://apilayer.net/api/check?access_key=f20f7ae318c34b92ee6a685fac758feb&email='+ $scope.email)
        .success(function(data){
           if(!data.format_valid || !data.mx_found){                
                $scope.modalstatustext = "Email não válido! " + " did_you_mean "+data.did_you_mean;
                return;
            }            
        })
        .error(function(data){
            $scope.modalstatustext = "Erro ao validar email";
        })  
    }

    $scope.noTask = function () {             
        $http.get('https://cat-fact.herokuapp.com/facts/random?animal_type=dog&amount=3')
        .success(function(data){
            $scope.TextCatFact = data;                    
        })
        .error(function(data){
            $scope.modalstatustext = "Erro ao adicionar tarefas";
        })  
    }

    $scope.deletaCatFact = function(i){
        $scope.TextCatFact.splice(i,1);
    }

});