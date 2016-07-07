/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('partialsApplication', []);

angular.module('partialsApplication').factory('nRestCalls', ['$http', 'nRestServerState', 'nHdfsEndpoint', 'nHdfsEndpointTypes',
    function ($http, nRestServerState, nHdfsEndpoint, nHdfsEndpointTypes) {
    var service = {
        vodEndpoint: function () {
            return $http({
                method: 'GET',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/vod/endpoint'
            });
        },
        contents: function () {
            return $http({
                method: 'GET',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/library/contents'
            });
        },
        torrentStatus: function (json) {
            console.log("torrent status " + JSON.stringify(json));
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/library/torrentStatus',
                data: json
            });
        },
        hopsUpload: function(json) {
            console.log("upload torrent " + JSON.stringify(json));
            var path;
            switch(nHdfsEndpoint.type) {
                case nHdfsEndpointTypes.basic : path = '/torrent/hops/upload/basic'; break;
                case nHdfsEndpointTypes.xml : path = '/torrent/hops/upload/xml'; break
            }
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + path,
                data: json
            });
        },
        hopsDownload: function (json) {
            console.log("download torrent " + JSON.stringify(json));
            var path;
            switch(nHdfsEndpoint.type) {
                case nHdfsEndpointTypes.basic : path = '/torrent/hops/download/basic'; break;
                case nHdfsEndpointTypes.xml : path = '/torrent/hops/download/xml'; break
            }
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + path,
                data: json
            });
        }, 
        hopsStop: function (json) {
            console.log("stop torrent " + JSON.stringify(json));
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/torrent/hops/stop',
                data: json
            });
        },
        hdfsConnection: function (json) {
            console.log("hdfs connection " + JSON.stringify(json));
            var path;
            switch(nHdfsEndpoint.type) {
                case nHdfsEndpointTypes.basic : path = '/torrent/hops/download/basic'; break;
                case nHdfsEndpointTypes.xml : path = '/torrent/hops/download/xml'; break
            }
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + path,
                data: json
            });
        },
        hdfsDelete: function (json) {
            console.log("delete file " + JSON.stringify(json));
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/hdfs/file/delete',
                data: json
            });
        },
        hdfsCreate: function (json) {
            console.log("create file " + JSON.stringify(json));
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/hdfs/file/create',
                data: json
            });
        },
        hdfsAvroCreate: function (json) {
            console.log("avro create file " + JSON.stringify(json));
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/hdfs/avrofile/create',
                data: json
            });
        }
    };
    return service;
}]);

angular.module('partialsApplication').factory('nRestServerState', [function () {
     var state = {
            url :"http://localhost",
            port : "18180",
            setPort : function (port) {
                this.port = port;
            },
            setURL : function (url) {
                this.url = url;
            },
            getURL : function(){
                return this.url;
            },
            getPort : function () {
                return this.port;
            }
        };
        return state;
}]);
angular.module('partialsApplication').controller('NRestServerController', ['nRestServerState', function (nRestServerState) {
    var self = this;
    self.url = nRestServerState.getURL();
    self.port = nRestServerState.getPort();

    self.setURL = function(){
        nRestServerState.setURL(self.url);
    }
    self.setPORT = function(){
        nRestServerState.setPort(self.port);
    }
}]);

angular.module('partialsApplication').factory('nHdfsEndpointTypes', [function () {
    var types = {
        basic : "basic",
        xml : "xml"
    };
    return types;
}]); 
angular.module('partialsApplication').factory('nHdfsBasicEndpoint', [function () {
    var hdfsEndpoint = {
        ip : "cloud1.sics.se",
        port : "26801",
        user : "glassfish"
    };
    return hdfsEndpoint;
}]);
angular.module('partialsApplication').factory('nHdfsXmlEndpoint', [function () {
    var hdfsEndpoint = {
        xmlPath : "path",
        user : "glassfish",
    };
    return hdfsEndpoint;
}]);
angular.module('partialsApplication').factory('nHdfsEndpoint', ['nHdfsEndpointTypes', 'nHdfsBasicEndpoint', 'nHdfsXmlEndpoint', 
    function (nHdfsEndpointTypes, nHdfsBasicEndpoint, nHdfsXmlEndpoint) {
    var hdfsEndpoint = {
        type : nHdfsEndpointTypes.basic,
        basicVal : nHdfsBasicEndpoint,
        xmlVal : nHdfsXmlEndpoint,
    };
    return hdfsEndpoint;
}]);

angular.module('partialsApplication').factory('nHdfsResource', ['nHdfsEndpoint', 'nHdfsEndpointTypes', 
    function (nHdfsEndpoint, nHdfsEndpointTypes) { 
    var hdfsResource = {
        dir : "/experiment/upload",
        file : "file",
        getJSON : function() {
            var json;
            switch(nHdfsEndpoint.type) {
                case nHdfsEndpointTypes.basic : 
                    json = {"hopsIp": nHdfsEndpoint.basicVal.ip, "hopsPort": nHdfsEndpoint.basicVal.port, "user": nHdfsEndpoint.basicVal.user,
                        "dirPath": this.dir, "fileName": this.file};
                    break;
                case nHdfsEndpointTypes.xml : 
                    json = {"hdfsXMLPath": nHdfsEndpoint.xmlVal.xmlPath, "user": nHdfsEndpoint.xmlVal.user, 
                        "dirPath": this.dir, "fileName": this.file}; 
                    break;
            }
            return json;
        }
    };
    return hdfsResource;
}]);

angular.module('partialsApplication').factory('nKafkaEndpoint', [function () {
    var kafkaEndpoint = {
        brokerEndpoint : "10.0.2.15:9091",
        restEndpoint : "http://bbc1.sics.se:14003",
        domain : "bbc1.sics.se",
        sessionId : "sessionId"
    };
    return kafkaEndpoint;
}]);

angular.module('partialsApplication').factory('nKafkaResource', ['nKafkaEndpoint', function (nKafkaEndpoint) {
    var kafkaResource = {
        endpoint : nKafkaEndpoint,
        projectId : "10",
        topicName : "testTopic",
        keyStore : "/var/lib/kagent/keystores/node_server_keystore.jks",
        trustStore : "/var/lib/kagent/keystores/node_server_truststore.jks",
        getJSON : function() {
            return {"brokerEndpoint": kafkaResource.endpoint.brokerEndpoint, "restEndpoint": kafkaResource.endpoint.restEndpoint, 
            "domain": kafkaResource.endpoint.domain, "sessionId": kafkaResource.endpoint.sessionId, 
            "projectId": kafkaResource.projectId, "topicName": kafkaResource.topicName, 
            "keyStore": kafkaResource.keyStore, "trustStore": kafkaResource.trustStore};
        }
    };
    return kafkaResource;
}]);

angular.module('partialsApplication').factory('nHopsResource', [function () {
    var hopsResource = {
        projectId : "10",
        getJSON : function() {
            var json = {"projectId": projectId}
            return json;
        }
    };
    return hopsResource;
}]);

angular.module('partialsApplication').controller('NContentsController', ['nRestCalls', function (nRestCalls) {
        var self = this;

        self.getContents = function () {
            nRestCalls.contents().then(function (result) {
                self.result = result;
            });

        };
    }]);

angular.module('partialsApplication').controller('NTorrentStatusController', ['nRestCalls', function (nRestCalls) {
        var self = this;
        self.fileName = "file";
        self.torrentId = "1";
        self.done = false;

        self.getTorrentStatus = function () {
            var JSONObj = {"fileName": self.fileName, "torrentId": {"val" : self.torrentId}};
            nRestCalls.torrentStatus(JSONObj).then(function (result) {
                self.result = result;
                self.done = true;
            });

        };
    }]);

angular.module('partialsApplication').controller('NHopsUploadController', ['$scope', 'nHdfsResource', 'nHopsResource', 'nRestCalls',
    function ($scope, nHdfsResource, nHopsResource, nRestCalls) {
        $scope.torrentId = "1";
        $scope.done = false;

        $scope.upload = function () {
            var hdfsResourceJSON = nHdfsResource.getJSON();
            var hopsResourceJSON = nHopsResource.getJSON();
            var reqJSON = {"hdfsResource": hdfsResourceJSON, "hopsResource": hopsResourceJSON, "torrentId": {"val": $scope.torrentId}};
            nRestCalls.hopsUpload(reqJSON).then(function (result) {
                $scope.result = result;
                $scope.done = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsDownloadController', ['$scope', 'nHdfsResource', 'nKafkaResource', 
    'nHopsResource', 'nRestCalls', function ($scope, nHdfsResource, nKafkaResource, nHopsResource, nRestCalls) {
        $scope.selectKafka = false;
        $scope.torrentId = "1";
        $scope.partnerIp = "193.10.67.178";
        $scope.partnerPort = "30000";
        $scope.partnerId = "1";
        $scope.done = false;

        $scope.download = function () {
            var hdfsResourceJSON = nHdfsResource.getJSON();
            var kafkaResourceJSON = null;
            if($scope.selectKafka) {
               kafkaResourceJSON = nKafkaResource.getJSON();
            }
            var hopsResourceJSON = nHopsResource.getJSON();
            var reqJSON = {"hdfsResource": hdfsResourceJSON, "kafkaResource": kafkaResourceJSON, "hopsResource": hopsResourceJSON,
            "torrentId": {"val": $scope.torrentId}, "partners": [{"ip": $scope.partnerIp, "port": $scope.partnerPort, "id": $scope.partnerId}]};
            nRestCalls.hopsDownload(reqJSON).then(function (result) {
                $scope.result = result;
                $scope.done = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsStopController', ['$scope', 'nRestCalls', 
    function ($scope, nRestCalls) {
        $scope.fileName = "file";
        $scope.torrentId = "1";
        $scope.done = false;

        $scope.stop = function () {
            var JSONObj = {"fileName": $scope.fileName, "torrentId": {"val": $scope.torrentId}};
            nRestCalls.hopsStop(JSONObj).then(function (result) {
                $scope.result = result;
                $scope.done = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsDeleteController', ['$scope', 'nRestCalls', 'nHdfsResource',
    function ($scope, nRestCalls, nHdfsResource) {
        $scope.done = false;

        $scope.delete = function () {
            var hdfsResourceJson = nHdfsResource.getJSON();
            var JSONObj = {"resource": hdfsResourceJson, "fileSize": $scope.fileSize};
            nRestCalls.hdfsDelete(JSONObj).then(function (result) {
                self.result = result;
                self.done = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsCreateController', ['$scope', 'nRestCalls', 'nHdfsResource', 
    function ($scope, nRestCalls, nHdfsResource) {
        $scope.filesize = "100000000";
        $scope.done = false;

        $scope.create = function () {
            var hdfsResourceJSON = nHdfsResource.getJSON();
            var JSONObj = {"resource": hdfsResourceJSON, "fileSize": $scope.filesize};
            nRestCalls.hdfsCreate(JSONObj).then(function (result) {
                $scope.result = result;
                $scope.done = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsAvroCreateController', ['$scope', 'nRestCalls', 'nHdfsResource', 'nKafkaResource',
    function ($scope, nRestCalls, nHdfsResource, nKafkaResource) {
        $scope.avroMsgs = "1000";
        $scope.done = false;

        $scope.create = function () {
            var hdfsResourceJSON = nHdfsResource.getJSON();
            var kafkaResourceJSON = nKafkaResource.getJSON();
            var JSONObj = {"hdfsResource": hdfsResourceJSON, "kafkaResource": kafkaResourceJSON, "nrMsgs": $scope.avroMsgs};
            nRestCalls.hdfsAvroCreate(JSONObj).then(function (result) {
                $scope.result = result;
                $scope.done = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NVoDEndpointController', ['nRestCalls', function (nRestCalls) {
        var self = this;
        self.report = false;

        self.vodEndpoint = function () {
            nRestCalls.vodEndpoint().then(function (result) {
                self.result = result;
                self.report = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NVoDHopsController', ['nRestCalls', function (nRestCalls) {
        var self = this;
        self.hopsIp = "bbc1.sics.se";
        self.hopsPort = "26801";
        self.report = false;

        self.hopsConnection = function () {
            var JSONObj = {"hopsIp": self.hopsIp, "hopsPort": self.hopsPort};
            nRestCalls.hdfsBasicConnection(JSONObj).then(function (result) {
                self.result = result;
                self.report = true;
            })
        };
    }]);

//neccessary for the partials - would like to get rid of if possible
angular.module('partialsApplication').controller('NHdfsEndpointController', ['$scope', 'nHdfsEndpointTypes', 'nHdfsEndpoint',
    function ($scope, nHdfsEndpointTypes, nHdfsEndpoint) {
        $scope.endpoint = nHdfsEndpoint;
        $scope.typeValues = nHdfsEndpointTypes;
}]);
angular.module('partialsApplication').controller('NHdfsEndpointSetController', ['$scope', 'nHdfsEndpointTypes', 'nHdfsEndpoint', 
    function ($scope, nHdfsEndpointTypes, nHdfsEndpoint) {
        $scope.endpoint = nHdfsEndpoint;
        $scope.typeValues = nHdfsEndpointTypes;
}]);  
angular.module('partialsApplication').controller('NHdfsResourceController', ['$scope', 'nHdfsResource', 
    function ($scope, nHdfsResource) {
        $scope.resource = nHdfsResource;
}]); 

angular.module('partialsApplication').controller('NKafkaEndpointController', ['$scope', 'nKafkaEndpoint',
    function ($scope, nKafkaEndpoint) {
        $scope.endpoint = nKafkaEndpoint;
}]);
angular.module('partialsApplication').controller('NKafkaResourceController', ['$scope', 'nKafkaResource',
    function ($scope, nKafkaResource) {
        $scope.resource = nKafkaResource;
}]); 
angular.module('partialsApplication').controller('NHopsResourceController', ['$scope', 'nHopsResource',
    function ($scope, nHopsResource) {
        $scope.resource = nHopsResource;
}]); 