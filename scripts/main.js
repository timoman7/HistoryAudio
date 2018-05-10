let _audioFiles = [];
let _noteFiles = [];
let root = [];
function getStructure(path, file, cb){
  fetch(`./${path.length>0?(path.join('/')+'/'):''}${file}`).then((r)=>{
    if(r.status == 200 && r.ok == true){
      r.text().then(cb);
    }
  });
}
function sortByDate(sep, key){
  return function(a,b){
    let trueSortA = key!=undefined?a[key]:a;
    let trueSortB = key!=undefined?b[key]:b;
    let _trueSortA = trueSortA.split('');
    _trueSortA.reverse();
    _trueSortA = _trueSortA.join('').replace(/(.)+\./,'').split('');
    _trueSortA.reverse();
    trueSortA = _trueSortA.join('');
    let _trueSortB = trueSortB.split('');
    _trueSortB.reverse();
    _trueSortB = _trueSortB.join('').replace(/(.)+\./,'').split('');
    _trueSortB.reverse();
    trueSortB = _trueSortB.join('');
    let sepA = trueSortA.split(sep);
    let sepB = trueSortB.split(sep);
    if(!isNaN(parseFloat(sepA[0]))){
      if(isNaN(parseFloat(sepB[0]))){
        return -1;
      }
    }else if(isNaN(parseFloat(sepA[0]))){
      if(!isNaN(parseFloat(sepB[0]))){
        return 1;
      }
    }
    for(let ind = 0; ind < sepA.length; ind++){
      if(ind < sepB.length){
        if(!isNaN(parseFloat(sepA[ind]))){
          if(!isNaN(parseFloat(sepB[ind]))){
            if(parseFloat(sepA[ind]) > parseFloat(sepB[ind])){
              return 1;
            }else if(parseFloat(sepA[ind]) < parseFloat(sepB[ind])){
              return -1;
            }
          }else{
            if(parseFloat(sepA[ind]) > sepB[ind]){
              return 1;
            }else if(parseFloat(sepA[ind]) < sepB[ind]){
              return -1;
            }
          }
        }else{
          if(!isNaN(parseFloat(sepB[ind]))){
            if(sepA[ind] > parseFloat(sepB[ind])){
              return 1;
            }else if(sepA[ind] < parseFloat(sepB[ind])){
              return -1;
            }
          }else{
            if(sepA[ind] > sepB[ind]){
              return 1;
            }else if(sepA[ind] < sepB[ind]){
              return -1;
            }
          }
        }
      }
    }
    return 0;
  }
}
let ctx = new AudioContext();
function setView(fileName, pathToFile){
  if(document.getElementById('docViewer')){
    document.getElementById('viewerContainer').removeChild(document.getElementById('docViewer'));
  }
  let iframeTemplate = document.getElementById('iframeTemplate');
  iframeTemplate.content.querySelector('#docViewer').src = `./scripts/ViewerJS/#${pathToFile!=undefined?pathToFile:'https://timoman7.github.io/HistoryAudio/History%202/'}${fileName}`;
  console.log(iframeTemplate.content)
  let clone = document.importNode(iframeTemplate.content, true);
  //clone.src = "./scripts/ViewerJS/#https://timoman7.github.io/HistoryAudio/History%202/" + fileName;
  document.getElementById('viewerContainer').appendChild(clone);
}
getStructure(['Audio Recordings'], 'files.prn', function(t){
  let arr = t.split('\n').filter(o=>o!='');
  arr.forEach((f)=>{
    // let mp3Info;
    // fetch(`./Audio Recordings/${f[4]}`).then((m)=>{
    //   m.arrayBuffer().then((b)=>{
    //     ctx.decodeAudioData(b, function(d){
    //       mp3Info = d;
    //     });
    //   });
    // });
    _audioFiles.push({
      name: f
    });
  });
  _audioFiles.sort(sortByDate('_','name'));
});
getStructure(['History 2'], 'files.prn', function(t){
  let arr = t.split('\n').filter(o=>o!='');
  arr.forEach((f)=>{
    _noteFiles.push({
      name: f
    });
  });
  _noteFiles.sort(sortByDate('-','name'));
});
var app = angular.module('app', []);
app.controller("audioControl", function($scope) {
  $scope.audio_files = _audioFiles;
  $scope.changeAudio = function(_src){
    document.getElementById('soundControls').src = './Audio Recordings/'+_src;//el.getAttribute('audio-src');//URL.createObjectURL(el.get);
    // not really needed in this exact case, but since it is really important in other cases,
    // don't forget to revoke the blobURI when you don't need it
    // sound.onend = function(e) {
    //   URL.revokeObjectURL(fileSrc.src);
    // }
  }
});
app.controller("noteControl", function($scope) {
  $scope.note_files = _noteFiles;
});
app.controller("page", function($scope) {
  $scope.onAudio = true;
  $scope.onHistory = !$scope.onAudio;
  $scope.gotoAudio = function(){
    $scope.onAudio = true;
    $scope.onHistory = false;
  };
  $scope.gotoHistory = function(){
    $scope.onHistory = true;
    $scope.onAudio = false;
  };
  $scope.setView = setView;
});
