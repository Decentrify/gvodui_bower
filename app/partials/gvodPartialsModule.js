/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('partialsApplication', ['nvd3']);

angular.module('partialsApplication').factory('nRestCalls', ['$http', 'nRestServerState', 'nHdfsEndpoint',
    function ($http, nRestServerState, nHdfsEndpoint) {
    var service = {
        vodEndpoint: function () {
            return $http({
                method: 'GET',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/vod/endpoint'
            });
        },
        nHTcontents: function (json) {
            console.log("contents " + JSON.stringify(json));
            return $http({
                method: 'POST',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/library/contents',
                data: json
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
        htStartUpload: function(json) {
            console.log("upload torrent " + JSON.stringify(json));
            var path;
            switch(nHdfsEndpoint.type) {
                case nHdfsEndpoint.types.basic : path = '/torrent/hops/upload/basic'; break;
                case nHdfsEndpoint.types.xml : path = '/torrent/hops/upload/xml'; break
            }
            return $http({
                method: 'POST',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + path,
                data: json
            });
        },
        htStartDownload: function (json) {
            console.log("ht start download " + JSON.stringify(json));
            var path;
            switch(nHdfsEndpoint.type) {
                case nHdfsEndpoint.types.basic : path = '/torrent/hops/download/start/basic'; break;
                case nHdfsEndpoint.types.xml : path = '/torrent/hops/download/start/xml'; break
            }
            return $http({
                method: 'POST',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + path,
                data: json
            });
        }, 
        htAdvanceDownload: function (json) {
            console.log("ht advance download " + JSON.stringify(json));
            var path;
            switch(nHdfsEndpoint.type) {
                case nHdfsEndpoint.types.basic : path = '/torrent/hops/download/advance/basic'; break;
                case nHdfsEndpoint.types.xml : path = '/torrent/hops/download/advance/xml'; break
            }
            return $http({
                method: 'POST',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + path,
                data: json
            });
        }, 
        htStop: function (json) {
            console.log("stop torrent " + JSON.stringify(json));
            return $http({
                method: 'POST',
                url: nRestServerState.getURL() + ":" + nRestServerState.getPort() + '/torrent/hops/stop',
                data: json
            });
        },
        hdfsConnection: function (json) {
            console.log("hdfs connection " + JSON.stringify(json));
            var path;
            switch(nHdfsEndpoint.type) {
                case nHdfsEndpoint.types.basic : path = '/torrent/hops/download/basic'; break;
                case nHdfsEndpoint.types.xml : path = '/torrent/hops/download/xml'; break
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
        },
        hdfsResourceJSON: function(hdfsResource) {
            var json = {"dirPath" : hdfsResource.dirPath, "fileName": hdfsResource.fileName};
            console.log("jsoning hdfs resource" + JSON.stringify(json));
            return json;
        }, 
        hopsResourceJSON: function(hopsResource) {
            var json = {"projectId": hopsResource.projectId};
            console.log("jsoning hops resource" + JSON.stringify(json));
            return json;
        },
        addressJSON: function(address) {
            var json = {"ip":address.ip, "port":address.port, "id":address.id};
            console.log("jsoning hdfs endpoint" + JSON.stringify(json));
            return json;
        }
    };
    return service;
}]);

angular.module('partialsApplication').factory('hopsHelper', [
    function () {
    var service = {
        hdfsResource: function() {
            return {
                dirPath: "",
                fileName: "",
                getJSON: function() {
                    var json = {"dirPath": this.dirPath, "fileName": this.fileName};
                    console.log("jsoning hdfs resource" + JSON.stringify(json));
                    return json;
                }
            }
        },
        kafkaResource: function() {
            return {
                sessionId: "",
                topicName: "",    
                getJSON: function() {
                    var json = {"sessionId": this.sessionId, "topicName": this.topicName};
                    console.log("jsoning kafka resource" + JSON.stringify(json));
                    return json;
                }
            };
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

angular.module('partialsApplication').factory('nHdfsEndpoint', [
    function () {
    var hdfsEndpoint = {
        types: {
            basic : "basic",
            xml : "xml"
        },
        type : "basic",
        basic : {
            ip : "cloud1.sics.se",
            port : "26801",
            user : "glassfish"
        },
        xml : {
            xmlPath : "path",
            user : "glassfish",
        },
        getJSON: function() {
            var json;
            switch(hdfsEndpoint.type) {
                case this.types.basic : 
                    json = {"ip": this.basic.ip, "port": this.basic.port, "user": this.basic.user};
                    break;
                case this.types.xml : 
                    json = {"xmlPath": this.xml.xmlPath, "user": this.xml.user};
                    break;
            }
            console.log("jsoning hdfs endpoint" + JSON.stringify(json));
            return json;
        }
    };
    return hdfsEndpoint;
}]);
angular.module('partialsApplication').controller('NHdfsEndpointSetController', ['$scope', 'nHdfsEndpoint', 
    function ($scope, nHdfsEndpoint) {
        $scope.endpoint = nHdfsEndpoint;
        $scope.endpoint.readOnly = false;
}]);  

angular.module('partialsApplication').factory('nKafkaEndpoint', [function () {
    var kafkaEndpoint = {
        brokerEndpoint : "10.0.2.15:9091",
        restEndpoint : "http://bbc1.sics.se:14003",
        domain : "bbc1.sics.se",
        projectId : "10",
        keyStore : "/var/lib/kagent/keystores/node_server_keystore.jks",
        trustStore : "/var/lib/kagent/keystores/node_server_truststore.jks",
        getJSON : function() {
            var json = {"brokerEndpoint": this.brokerEndpoint, "restEndpoint": this.restEndpoint, "domain": this.domain, 
            "projectId": this.projectId, "topicName": this.topicName, "keyStore": this.keyStore, "trustStore": this.trustStore};
            console.log("jsoning hdfs endpoint" + JSON.stringify(json));
            return json;
        }
    };
    return kafkaEndpoint;
}]);

angular.module('partialsApplication').controller('NKafkaEndpointSetController', ['$scope', 'nKafkaEndpoint',
    function ($scope, nKafkaEndpoint) {
        $scope.endpoint = nKafkaEndpoint;
        $scope.endpoint.readOnly = false;
}]);

angular.module('partialsApplication').controller('NHTContentsController', ['$scope', 'nRestCalls', function ($scope, nRestCalls) {
        $scope.done = false;
        $scope.selectProject = false;
        $scope.projectId = null;
        $scope.click = function() {
            if($scope.selectProject == false) {
                $scope.projectId = null;
            }
        }
        $scope.getContents = function () {
            var json = {"projectId": $scope.projectId};
            nRestCalls.nHTcontents(json).then(function (result) {
                $scope.result = result;
                $scope.done = true;
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

angular.module('partialsApplication').controller('NHTUploadController', ['$scope', 'nHdfsEndpoint', 'nKafkaEndpoint', 'nRestCalls',
    function ($scope, nHdfsEndpoint, nKafkaEndpoint, nRestCalls) {
        $scope.torrentId = "1";
        $scope.torrentName = "";
        $scope.manifestResource = {
            dirPath : "/experiment/upload/",
            fileName : "manifest.json"
        };
        $scope.done = false;

        $scope.upload = function () {
            var hdfsEndpointJSON = nHdfsEndpoint.getJSON();
            var manifestResourceJSON = nRestCalls.hdfsResourceJSON($scope.manifestResource);
            var reqJSON = {"torrentId": {"val": $scope.torrentId}, "torrentName": $scope.torrentName, 
                "hdfsEndpoint": hdfsEndpointJSON, "manifestHDFSResource": manifestResourceJSON};
            nRestCalls.htStartUpload(reqJSON).then(function (result) {
                 $scope.result = result;
                 $scope.done = true;
            })
        };
    }]);

angular.module('partialsApplication').controller('NHTDownloadController', ['$scope', 'nHdfsEndpoint', 'nKafkaEndpoint', 
    'nRestCalls', 'hopsHelper',
    function ($scope, nHdfsEndpoint, nKafkaEndpoint, nRestCalls, hopsHelper) {
        $scope.torrentId = "1";
        $scope.torrentName = "";
        $scope.manifestResource = {
            dirPath : "/experiment/download/",
            fileName : "manifest.json"
        };
        $scope.partner = {
            ip: "193.10.67.178",
            port: "30000",
            id: "1"
        };
        $scope.files = new Array();
        $scope.fileName = "";
        $scope.advance = false;
        $scope.done = false;

        $scope.startDownload = function() {
            var torrentIdJSON = {"val": $scope.torrentId};
            var hdfsEndpointJSON = nHdfsEndpoint.getJSON();
            var manifestResourceJSON = nRestCalls.hdfsResourceJSON($scope.manifestResource);
            var partnerJSON = nRestCalls.addressJSON($scope.partner);
            var reqJSON = {"torrentId": torrentIdJSON, "hdfsEndpoint": hdfsEndpointJSON, "manifestHDFSResource": manifestResourceJSON,
                "partners": [partnerJSON]};
            nRestCalls.htStartDownload(reqJSON).then(function (result) {
                $scope.result = result;
                $scope.advance = true;
            })
        };
        $scope.advanceDownload = function() {
            var torrentIdJSON = {"val": $scope.torrentId};
            var hdfsEndpointJSON = nHdfsEndpoint.getJSON();
            var kafkaEndpointJSON = nKafkaEndpoint.getJSON();
            var hdfsDetailsJSON = new Object();
            var kafkaDetailsJSON = new Object();
            for(var i=0; i<$scope.files.length; i++) {
                var f = $scope.files[i];
                hdfsDetailsJSON[f.file] = f.hdfsResource.getJSON();
                if(f.kafka) {
                    kafkaDetailsJSON[f.file] = f.kafkaResource.getJSON();
                }
            }
            var extendedDetailsJSON = {"hdfsDetails": hdfsDetailsJSON, "kafkaDetails": kafkaDetailsJSON};
            var json = {"torrentId": torrentIdJSON, "hdfsEndpoint": hdfsEndpointJSON, 
                "kafkaEndpoint": kafkaEndpointJSON, "extendedDetails": extendedDetailsJSON};
            console.log("jsoning extended" + JSON.stringify(json));
            nRestCalls.htAdvanceDownload(json).then(function (result) {
                $scope.result = result;
                $scope.done = true;
            })
        };
        $scope.newFile = function() {
            var aux = {
                file: $scope.fileName,
                kafkaResource: null,
                hdfsResource: hopsHelper.hdfsResource(),
                kafka: false,
                expanded: false,
                readOnly: false
            };
            $scope.files.push(aux);
            $scope.fileName = "";
        };
        $scope.updateKafka = function(file) {
            if(file.kafka) {
                file.kafkaResource=hopsHelper.kafkaResource();
            } else {
                file.kafkaResource=null;
            }
        };
        $scope.showKafka = function(file){
            return file.kafka && file.expanded;
        }
    }]);

angular.module('partialsApplication').controller('NHTStopController', ['$scope', 'nRestCalls', 
    function ($scope, nRestCalls) {
        $scope.torrentId = "1";
        $scope.done = false;

        $scope.stop = function () {
            var json = {"val": $scope.torrentId};
            nRestCalls.htStop(json).then(function (result) {
                $scope.result = result;
                $scope.done = true;
            })
        };
    }]);

// angular.module('partialsApplication').controller('NHopsDeleteController', ['$scope', 'nRestCalls', 'nHdfsResource',
//     function ($scope, nRestCalls, nHdfsResource) {
//         $scope.done = false;

//         $scope.delete = function () {
//             var hdfsResourceJson = nHdfsResource.getJSON();
//             var JSONObj = {"resource": hdfsResourceJson, "fileSize": $scope.fileSize};
//             nRestCalls.hdfsDelete(JSONObj).then(function (result) {
//                 self.result = result;
//                 self.done = true;
//             })
//         };
//     }]);

// angular.module('partialsApplication').controller('NHopsCreateController', ['$scope', 'nRestCalls', 'nHdfsResource', 
//     function ($scope, nRestCalls, nHdfsResource) {
//         $scope.filesize = "100000000";
//         $scope.done = false;

//         $scope.create = function () {
//             var hdfsResourceJSON = nHdfsResource.getJSON();
//             var JSONObj = {"resource": hdfsResourceJSON, "fileSize": $scope.filesize};
//             nRestCalls.hdfsCreate(JSONObj).then(function (result) {
//                 $scope.result = result;
//                 $scope.done = true;
//             })
//         };
//     }]);

// angular.module('partialsApplication').controller('NHopsAvroCreateController', ['$scope', 'nRestCalls', 'nHdfsResource', 'nKafkaResource',
//     function ($scope, nRestCalls, nHdfsResource, nKafkaResource) {
//         $scope.avroMsgs = "1000";
//         $scope.done = false;

//         $scope.create = function () {
//             var hdfsResourceJSON = nHdfsResource.getJSON();
//             var kafkaResourceJSON = nKafkaResource.getJSON();
//             var JSONObj = {"hdfsResource": hdfsResourceJSON, "kafkaResource": kafkaResourceJSON, "nrMsgs": $scope.avroMsgs};
//             nRestCalls.hdfsAvroCreate(JSONObj).then(function (result) {
//                 $scope.result = result;
//                 $scope.done = true;
//             })
//         };
//     }]);

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

angular.module('partialsApplication').controller('NGraphsController', function($scope){

        /* Chart options */
        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        /* Chart data */
        $scope.data = [{values: [{x:0,y:1},{x:1,y:1},{x:2,y:2},{x:3,y:3}], key: 'l1'}, {values: [{x:0,y:3},{x:1,y:3},{x:2,y:4},{x:3,y:5}], key: 'l2'}]

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e'  //color - optional: choose your own line color.
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                },
                {
                    values: sin2,
                    key: 'Another sine wave',
                    color: '#7777ff',
                    area: true      //area - set to true if you want this line to turn into a filled area chart.
                }
            ];
        };

        var loadData = $.csv.toArrays(loadContent);
    });

angular.module('partialsApplication').directive('fileReader', function() {
  return {
    scope: {
      fileReader:"="
    },
    link: function(scope, element) {
      $(element).on('change', function(changeEvent) {
        var files = changeEvent.target.files;
        if (files.length) {
          var r = new FileReader();
          r.onload = function(e) {
              var contents = e.target.result;
              scope.$apply(function () {
                scope.fileReader = contents;
              });
          };
          
          r.readAsText(files[0]);
        }
      });
    }
  };
});
//neccessary for the partials - would like to get rid of if possible

// angular.module('partialsApplication').controller('NKafkaResourceController', ['$scope', 'nKafkaResource',
//     function ($scope, nKafkaResource) {
//         $scope.resource = nKafkaResource;
// }]); 