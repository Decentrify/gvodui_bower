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

angular.module('partialsApplication').factory('nRESTResult', [function () {
    var state = {
        report : false,
        req : "original",
        status : "NOT_YET_DONE",
        report : function() {
            return report;
        },
        setJSON : function (jsonObj) {
            report = true;
            req = jsonObj.config.data;
            status = jsonObj.result.statusText;
        },
        getReq : function () {
            return this.req;
        },
        getStatus : function() {
            return this.status;
        }
    };
    return state;
}]);

angular.module('partialsApplication').factory('nRestServerState', [function () {
     var state = {
            url :"http://localhost",
            port : "18180",
            setURL : function(url) {
                this.url = url;
            }, 
            setPORT : function(port) {
                this.port = port;
            }
        };
        return state;
}]);

angular.module('partialsApplication').controller('NRestServerController', ['nRestServerState', function (nRestServerState) {
    var self = this;
    self.getState = function () {
        return nRestServerState;
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

// angular.module('partialsApplication').factory('nHDFSEndpoint', [function () {
//     var state = {
//         ip : "bbc1.sics.se",
//         port : "26801",
//         user : "glassfish",
//         setIp : function(ip) {
//             this.ip = ip;
//             this.port = port;
//         },
//         getIp : function() {
//             return ip;
//         },
//         setPort : function(port) {
//             this.port = port;
//         },
//         getPort : function() {
//             return this.port;
//         },
//         setUser : function(user) {
//             this.user = user;
//         },
//         getUser : function() {
//             return this.user;
//         }
//     };
//     return state;
// }]};

// angular.module('partialsApplication').controller('NHDFSEndpointController', ['nHDFSEndpoint', function (nHDFSEndpoint) {
//     var self = this;
//     self.op = {
//         getHDFSEndpoint : function {
//             return nHDFSEndpoint;
//         }
//     };
// }]);

// angular.module('partialsApplication').controller('NContentsController', ['nRestCalls', function (nRestCalls) {
//         var self = this;

//         self.getContents = function () {
//             nRestCalls.contents().then(function (result) {
//                 self.result = result;
//             });

//         };
// }]);


// angular.module('partialsApplication').factory('nSelectedFile', [function () {
//     var state = {
//         filename : "file",
//         torrentId : "1",
//         setFilename : function(filename) {
//             this.filename = filename;
//         },
//         getFilename : function() {
//             return this.filename;
//         },
//         setTorrentId : function(torrentId) {
//             this.torrentId = torrentId;
//         },
//         getTorrentId : function() {
//             return this.torrentId;
//         },
//         getJSON : function() {
//             var jsonObj = {"fileName": this.filename, "torrentId": this.torrentId};
//             return jsonObj;
//         }
//     };
//     return state;
// }]);

// angular.module('partialsApplication').factory('nSelectedTorrentInDetails', [function () {
//     var state = {
//         torrentId : "1",
//         setTorrentId : function(torrentId) {
//             this.torrentId = torrentId;
//         },
//         getTorrentId : function() {
//             return this.torrentId;
//         }
//     };  
//     return state;
// }]};

// angular.module('partialsApplication').factory('nSelectedTorrentOutDetails', [function () {
//     var state = {
//         status : "status",
//         speed : "0 KB/s",
//         progress : "0 %",
//         setJSON : function(jsonObj) {
//             this.status = jsonObj.torrentStatus;
//             this.speed = jsonObj.downloadSpeed + " KB/s";
//             this.progress = jsonObj.downloadProgress + " %";
//         },
//         getStatus : function() {
//             return this.status;
//         },
//         getSpeed : function() {
//             return this.speed;
//         },
//         getProgress : function() {
//             return this.progress;
//         }
//     }
//     return state;
// }]};

// angular.module('partialsApplication').controller('NTorrentStatusController', [
//     'nSelectedFile', 'nSelectedTorrentOutDetails', 'nRESTResult', 'nRestCalls', 
//     function (nSelectedFile, nSelectedTorrentOutDetails, nRESTResult, nRestCalls) {
//         var self = this;
//         self.op = {
//             getSelectedFile : function () {
//                 return nSelectedFile;
//             },
//             getSelectedTorrentOutDetails : function () {
//                 return nSelectedTorrentOutDetails;
//             },
//             getRESTResultStatus : function () {
//                 return nResultStatus;
//             },
//             triggerTorrentStatus : function() {
//                 var jsonObj = nSelectedFile.getJSON();
//                 nRestCalls.torrentStatus(jsonObj).then(function (result) {
//                     nResultStatus.setJSON(result);
//                     nSelectedTorrentOutDetails.setJSON(result.data);
//                 });
//             }
//         };
//     }]);

// angular.module('partialsApplication').factory('nSelectedResource', [function () {
//     var state = {
//         dirPath : "dirPath",
//         filename : "filename",
//         setDirPath : function(dirPath) {
//             this.dirPath = dirPath;
//         },
//         getDirPath : function() {
//             return dirPath();
//         },
//         setFilename : function(filename) {
//             this.filename = filename;
//         },
//         getFilename : function() {
//             return this.filename;
//         }
//     };  
//     return state;
// }]};     

// angular.module('partialsApplication').controller('NHopsUploadController', [
//     'nHDFSEndpoint', 'nSelectedResource', 'nSelectedTorrentInDetails', 'nRESTResult', 'nRestCalls', 
//     function (nHDFSEndpoint, nSelectedResource, nSelectedTorrentInDetails, nRESTResult, nRestCalls) {
//         var self = this;
//         self.operations = {

//         }
//         self.upload = function () {
//             var JSONObj = {"resource": {"hopsIp": self.hopsIp, "hopsPort": self.hopsPort, "dirPath": self.dirPath, 
//             "fileName": self.fileName}, "user": self.user, "torrentId": self.torrentId};
//             nRestCalls.hopsUpload(JSONObj).then(function (result) {
//                 self.result = result;
//                 self.uploading = true;
//             })
//         };
//     }]);

// angular.module('partialsApplication').controller('NHopsDownloadController', ['nRestCalls', function (nRestCalls) {
//         var self = this;
//         self.hopsIp = "hdfs://bbc1.sics.se";
//         self.hopsPort = "26801";
//         self.dirPath = "/experiment/download/";
//         self.fileName = "file";
//         self.user = "glassfish";
//         self.torrentId = "1";
//         self.partnerIp = "193.10.67.178";
//         self.partnerPort = "30000";
//         self.partnerId = "1";
//         self.downloading = false;

//         self.download = function () {
//             var JSONObj = {"resource":{"hopsIp": self.hopsIp, "hopsPort": self.hopsPort, "dirPath": self.dirPath, 
//             "fileName": self.fileName}, "user": self.user, "torrentId": self.torrentId, 
//             "partners": [{"ip": self.partnerIp, "port": self.partnerPort, "id": self.partnerId}]};
//             nRestCalls.hopsDownload(JSONObj).then(function (result) {
//                 self.result = result;
//                 self.downloading = true;
//             })
//         };
//     }]);

// angular.module('partialsApplication').controller('NHopsStopController', ['nRestCalls', function (nRestCalls) {
//         var self = this;
//         self.fileName = "file";
//         self.torrentId = "1";
//         self.report = false;

//         self.stop = function () {
//             var JSONObj = {"fileName": self.fileName, "torrentId": self.torrentId};
//             nRestCalls.hopsStop(JSONObj).then(function (result) {
//                 self.result = result;
//                 self.report = true;
//             })
//         };
//     }]);

// angular.module('partialsApplication').controller('NHopsDeleteController', ['nRestCalls', function (nRestCalls) {
//         var self = this;
//         self.hopsIp = "bbc1.sics.se";
//         self.hopsPort = "26801";
//         self.dirPath = "/experiment/download/";
//         self.fileName = "file";
//         self.user = "glassfish";
//         self.report = false;

//         self.delete = function () {
//             var JSONObj = {"resource": {"hopsIp": self.hopsIp, "hopsPort": self.hopsPort, "dirPath": self.dirPath, 
//             "fileName": self.fileName}, "user": self.user};
//             nRestCalls.hdfsDelete(JSONObj).then(function (result) {
//                 self.result = result;
//                 self.report = true;
//             })
//         };
//     }]);

// angular.module('partialsApplication').controller('NHopsCreateController', ['nRestCalls', function (nRestCalls) {
//        var self = this;
//         self.hopsIp = "bbc1.sics.se";
//         self.hopsPort = "26801";
//         self.dirPath = "/experiment/download/";
//         self.fileName = "file";
//         self.user = "glassfish";
//         self.fileSize = "100000000";
//         self.report = false;

//         self.create = function () {
//             var JSONObj = {"resource": {"hopsIp": self.hopsIp, "hopsPort": self.hopsPort, "dirPath": self.dirPath, 
//             "fileName": self.fileName}, "user": self.user, "fileSize": self.fileSize};
//             nRestCalls.hdfsCreate(JSONObj).then(function (result) {
//                 self.result = result;
//                 self.report = true;
//             })
//         };
//     }]);

// angular.module('partialsApplication').controller('NVoDHopsController', ['nRestCalls', function (nRestCalls) {
//         var self = this;
//         self.hopsIp = "bbc1.sics.se";
//         self.hopsPort = "26801";
//         self.report = false;

//         self.hopsConnection = function () {
//             var JSONObj = {"hopsIp": self.hopsIp, "hopsPort": self.hopsPort};
//             nRestCalls.hdfsConnection(JSONObj).then(function (result) {
//                 self.result = result;
//                 self.report = true;
//             })
//         };
//     }]);