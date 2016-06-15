/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('partialsApplication', []);


angular.module('partialsApplication').controller('DownloaderController', ['partialsBackendServiceFactory','partialsServiceStateFactory', function (partialsBackendServiceFactory, partialsServiceStateFactory) {

        var self = this;
        self.filename = partialsServiceStateFactory.getFilename();
        self.identifier = partialsServiceStateFactory.getIdentifier();

        self.result;
        self.downloading = false;


        self.download = function () {
            var JSONObj = {"name": self.filename, "identifier": self.identifier};
            partialsBackendServiceFactory.download(JSONObj).then(function (result) {
                self.result = result;
                self.downloading = true;
            });

        };

    }]);
angular.module('partialsApplication').controller('UploaderController', ['partialsBackendServiceFactory', 'partialsServiceStateFactory', function (partialsBackendServiceFactory, partialsServiceStateFactory) {

        var self = this;
        self.filename = partialsServiceStateFactory.getFilename();
        self.identifier = partialsServiceStateFactory.getIdentifier();

        self.result;
        self.uploading = false;


        self.upload = function () {
            var JSONObj = {"name": self.filename, "identifier": self.identifier};
            partialsBackendServiceFactory.upload(JSONObj).then(function (result) {
                self.result = result;
                self.uploading = true;
            });

        };

    }]);
angular.module('partialsApplication').controller('StoperController', ['partialsBackendServiceFactory', 'partialsServiceStateFactory', function (partialsBackendServiceFactory, partialsServiceStateFactory) {

        var self = this;
        self.filename = partialsServiceStateFactory.getFilename();
        self.identifier = partialsServiceStateFactory.getIdentifier();

        self.result;
        self.stoped = false;


        self.stop = function () {
            var JSONObj = {"name": self.filename, "identifier": self.identifier};
            partialsBackendServiceFactory.stop(JSONObj).then(function (result) {
                self.result = result;
                self.stoped = true;
            });

        };

    }]);

angular.module('partialsApplication').controller('LibraryController', ['partialsBackendServiceFactory', 'partialsServiceStateFactory', function (partialsBackendServiceFactory, partialsServiceStateFactory) {

        var self = this;
        self.identifier = partialsServiceStateFactory.getIdentifier();
        self.filename = partialsServiceStateFactory.getFilename();

        self.uri;
        self.size;
        self.description;
        self.result;
        self.viewToLoad;

        self.showView = new Array(0);
        self.status = false;
        self.addFile = function () {

            var fileInfo = {
                name: self.filename,
                uri: self.uri,
                size: self.size,
                description: self.description

            };

            var JSONObj = {"identifier": self.identifier, "fileInfo": fileInfo};

            partialsBackendServiceFactory.addFile(JSONObj).then(function (result) {
                self.result = result;
            });

        };

        self.getLibraryContents = function () {

            partialsBackendServiceFactory.getLibraryContents().then(function (result) {
                self.result = result;
            });

        };

        self.getLibraryElement = function () {
            var JSONObj = {"identifier": self.identifier, "name": self.filename};
            partialsBackendServiceFactory.getLibraryElement(JSONObj).then(function (result) {
                self.result = result;
            });
            self.status = true;
        };
        
        self.closeLibraryElement = function(){
            self.status = false;
        };

        self.enlarge = function (status, name, identifier, index) {

            switch (status) {
                case "NONE":
                    self.viewToLoad = "upload";
                    break;
                case "UPLOADING":
                    self.viewToLoad = "stop";
                    break;
                case "DOWNLOADING" :
                    self.viewToLoad = "stop";
                    break;
            }

            partialsServiceStateFactory.setFilename(name);
            partialsServiceStateFactory.setIdentifier(identifier);
            
            if(self.showView.length === 0){
                self.showView = new Array(self.result.data.contents.length);
                self.showView[index] = true;
            }else{
                self.showView[index] = true;
            }
            
            

        };
        
        self.minimize = function(index){
          
          self.showView[index]= false;  
            
        };


    }]);

angular.module('partialsApplication').controller('RestHostController', ['partialsServiceStateFactory', 'partialsBackendServiceFactory',  function (partialsServiceStateFactory, partialsBackendServiceFactory) {

    var self = this;
    self.url = partialsServiceStateFactory.getURL();
    self.port = partialsServiceStateFactory.getPort();

    self.setURL = function(){
        partialsServiceStateFactory.setURL(self.url);
    }

    self.setPORT = function(){
        partialsServiceStateFactory.setPort(self.port);
    }

    self.checkStatus = function(){
        partialsBackendServiceFactory.checkStatus().then(function(result){
            self.result = result;
        })
    };

}]);

angular.module('partialsApplication').factory('partialsServiceStateFactory',[function(){
        
        var state = {

            identifier : "",
            filename : "",
            url :"http://localhost",
            port : "8080",

            setIdentifier : function (id) {
                this.identifier = id;
            },

            setFilename : function (name) {
                this.filename = name;
            },

            getIdentifier : function () {
                return this.identifier;
            },

            getFilename : function () {
                return this.filename;
            },

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

angular.module('partialsApplication').factory('partialsBackendServiceFactory', ['partialsServiceStateFactory','$http', function (partialsServiceStateFactory, $http) {

        var service = {

            download: function (json) {
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/torrent/download',
                            data: json
                        });
            },
            upload: function (json) {
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/torrent/upload',
                            data: json
                        });
            },
            stop: function (json) {
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/torrent/stop',
                            data: json
                        });
            },
            getLibraryContents: function () {
                return $http({
                            method: 'GET',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/library/contents'
                        });
            },
            addFile: function(json){
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/library/add',
                            data: json
                        });
            },
            getLibraryElement: function(json){
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/library/element',
                            data: json
                        });
            },
            checkStatus:  function () {
                return $http({
                        method: 'GET',
                        url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/status'
                    });

            }
            

        };

        return service;
    }]);

//new controllers
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
            var JSONObj = {"fileName": self.fileName, "torrentId": self.torrentId};
            nRestCalls.torrentStatus(JSONObj).then(function (result) {
                self.result = result;
                self.done = true;
            });

        };
    }]);

angular.module('partialsApplication').controller('NHopsUploadController', ['nRestCalls', function (nRestCalls) {
        var self = this;
        self.hopsIp = "hdfs://bbc1.sics.se";
        self.hopsPort = "26801";
        self.dirPath = "/experiment/upload/";
        self.fileName = "file";
        self.user = "glassfish";
        self.torrentId = "1";
        self.uploading = false;

        self.upload = function () {
            var JSONObj = {"resource": {"hopsIp": self.hopsIp, "hopsPort": self.hopsPort, "dirPath": self.dirPath, 
            "fileName": self.fileName}, "user": self.user, "torrentId": self.torrentId};
            nRestCalls.hopsUpload(JSONObj).then(function (result) {
                self.result = result;
                self.uploading = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsDownloadController', ['nRestCalls', function (nRestCalls) {
        var self = this;
        self.hopsIp = "hdfs://bbc1.sics.se";
        self.hopsPort = "26801";
        self.dirPath = "/experiment/download/";
        self.fileName = "file";
        self.user = "glassfish";
        self.torrentId = "1";
        self.partnerIp = "193.10.67.178";
        self.partnerPort = "30000";
        self.partnerId = "1";
        self.downloading = false;

        self.download = function () {
            var JSONObj = {"resource":{"hopsIp": self.hopsIp, "hopsPort": self.hopsPort, "dirPath": self.dirPath, 
            "fileName": self.fileName}, "user": self.user, "torrentId": self.torrentId, 
            "partners": [{"ip": self.partnerIp, "port": self.partnerPort, "id": self.partnerId}]};
            nRestCalls.hopsDownload(JSONObj).then(function (result) {
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
            var JSONObj = {"fileName": self.fileName, "torrentId": self.torrentId};
            nRestCalls.hopsStop(JSONObj).then(function (result) {
                self.result = result;
                self.report = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHopsDeleteController', ['nRestCalls', function (nRestCalls) {
        var self = this;
        self.hopsIp = "bbc1.sics.se";
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
        self.hopsIp = "bbc1.sics.se";
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