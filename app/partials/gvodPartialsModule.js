/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('partialsApplication', []);

angular.module('partialsApplication').factory('nRestCalls', ['nRestServerState','$http', function (nRestServerState, $http) {
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
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/library/torrentStatus',
                data: json
            });
        },
        hopsUpload: function (json) {
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/torrent/hops/upload',
                data: json
            });
        },
        hopsDownload: function (json) {
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/torrent/hops/download',
                data: json
            });
        }, 
        hopsStop: function (json) {
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/torrent/hops/stop',
                data: json
            });
        },
        hdfsConnection: function (json) {
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/hdfs/connection',
                data: json
            });
        },
        hdfsDelete: function (json) {
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/hdfs/file/delete',
                data: json
            });
        },
        hdfsCreate: function (json) {
            return $http({
                method: 'PUT',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/hdfs/file/create',
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
angular.module('partialsApplication').factory('nHDFSEndpoint', [function () {
    var hdfsEndpoint = {
        ip : "cloud1.sics.se",
        port : "26801",
        user : "glassfish"
    };
    return hdfsEndpoint;
}]);

angular.module('partialsApplication').factory('nHDFSResource', ['nHDFSEndpoint', function (nHDFSEndpoint) {
    var hdfsResource = {
        endpoint : nHDFSEndpoint,
        dir : "/experiment/upload",
        file : "file",
        getJSON : function() {
            return {"hopsIp": hdfsResource.endpoint.hopsIp, "hopsPort": hdfsResource.endpoint.hopsPort, "user": hdfsResource.endpoint.user, 
            "dirPath": hdfsResource.dir, "fileName": hdfsResource.file};
        }
    };
    return hdfsResource;
}]);

angular.module('partialsApplication').factory('nKafkaEndpoint', [function () {
    var kafkaEndpoint = {
        brokerEndpoint : "brokerEndpoint",
        restEndpoint : "restEndpoint",
        domain : "domain",
        sessionId : "sessionId"
    };
    return kafkaEndpoint;
}]);

angular.module('partialsApplication').factory('nKafkaResource', ['nKafkaEndpoint', function (nKafkaEndpoint) {
    var kafkaResource = {
        endpoint : nKafkaEndpoint,
        projectId : "projectId",
        topicName : "topicName",
        schemaName : "schemaName",
        keyStore : "keyStore",
        trustStore : "trustStore",
        getJSON : function() {
            return {"brokerEndpoint": kafkaResource.endpoint.brokerEndpoint, "restEndpoint": kafkaResource.endpoint.restEndpoint, 
            "domain": kafkaResource.endpoint.domain, "sessionId": kafkaResource.endpoint.sessionId, 
            "projectId": kafkaResource.projectId, "topicName": kafkaResource.topicName, "schemaName": kafkaResource.schemaName, 
            "keyStore": kafkaResource.keyStore, "trustStore": kafkaResource.trustStore};
        }
    };
    return kafkaResource;
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

angular.module('partialsApplication').controller('NHopsUploadController', ['nHDFSResource', 'nRestCalls', 
    function (nHDFSResource, nRestCalls) {
        var self = this;
        self.hdfsResource = nHDFSResource;
        self.torrentId = "1";
        self.uploading = false;

        self.upload = function () {
            var hdfsResourceJSON = nHDFSResource.getJSON();
            var reqJSON = {"resource": hdfsResourceJSON, "torrentId": {"val": self.torrentId}};
            nRestCalls.hopsUpload(reqJSON).then(function (result) {
                self.result = result;
                self.uploading = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsDownloadController', ['$scope', 'nHDFSResource', 'nKafkaResource', 'nRestCalls', 
    function ($scope, nHDFSResource, nKafkaResource, nRestCalls) {
        var self = this;
        self.hdfsResource = nHDFSResource;
        self.selectKafka = false;
        self.kafkaResource = nKafkaResource;
        self.torrentId = "1";
        self.partnerIp = "193.10.67.178";
        self.partnerPort = "30000";
        self.partnerId = "1";
        self.downloading = false;

        self.download = function () {
            var hdfsResourceJSON = nHDFSResource.getJSON();
            var kafkaResourceJSON = null;
            if(self.selectKafka) {
               kafkaResourceJSON = nKafkaResource.getJSON();
            }
            var reqJSON = {"hdfsResource": hdfsResourceJSON, "kafkaResource": kafkaResourceJSON,
            "torrentId": {"val": self.torrentId}, 
            "partners": [{"ip": self.partnerIp, "port": self.partnerPort, "id": self.partnerId}]};
            nRestCalls.hopsDownload(reqJSON).then(function (result) {
                self.result = result;
                self.downloading = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsStopController', ['nRestCalls', function (nRestCalls) {
        var self = this;
        self.fileName = "file";
        self.torrentId = "1";
        self.report = false;

        self.stop = function () {
            var JSONObj = {"fileName": self.fileName, "torrentId": {"val": self.torrentId}};
            nRestCalls.hopsStop(JSONObj).then(function (result) {
                self.result = result;
                self.report = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsDeleteController', ['nRestCalls', function (nRestCalls) {
        var self = this;
        self.hopsIp = "cloud1.sics.se";
        self.hopsPort = "26801";
        self.dirPath = "/experiment/download/";
        self.fileName = "file";
        self.user = "glassfish";
        self.report = false;

        self.delete = function () {
            var JSONObj = {"resource": {"hopsIp": self.hopsIp, "hopsPort": self.hopsPort, "dirPath": self.dirPath, 
            "fileName": self.fileName}, "user": self.user};
            nRestCalls.hdfsDelete(JSONObj).then(function (result) {
                self.result = result;
                self.report = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsCreateController', ['nRestCalls', function (nRestCalls) {
       var self = this;
        self.hopsIp = "cloud1.sics.se";
        self.hopsPort = "26801";
        self.dirPath = "/experiment/download/";
        self.fileName = "file";
        self.user = "glassfish";
        self.fileSize = "100000000";
        self.report = false;

        self.create = function () {
            var JSONObj = {"resource": {"hopsIp": self.hopsIp, "hopsPort": self.hopsPort, "dirPath": self.dirPath, 
            "fileName": self.fileName}, "user": self.user, "fileSize": self.fileSize};
            nRestCalls.hdfsCreate(JSONObj).then(function (result) {
                self.result = result;
                self.report = true;
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
            nRestCalls.hdfsConnection(JSONObj).then(function (result) {
                self.result = result;
                self.report = true;
            })
        };
    }]);